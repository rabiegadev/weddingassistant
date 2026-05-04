import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma, SessionScope } from "@prisma/client";
import { getAppPublicUrl } from "@/lib/env/public";
import { getGoogleOAuthSecrets } from "@/lib/auth/google-config";
import {
  GOOGLE_OAUTH_PKCE_COOKIE,
  unpackGooglePkceCookie,
} from "@/lib/auth/google-oauth-pkce-cookie";
import { exchangeGoogleCode, fetchGoogleUserInfo } from "@/lib/auth/google-oauth-flow";
import { upsertClientUserFromGoogle } from "@/lib/auth/google-oauth-user";
import {
  COOKIE_NAME_CLIENT,
  buildSessionCookieOptions,
  createClientSessionForUserId,
  getSessionTtlForScope,
} from "@/lib/auth/session";

function redirectWithCookieClear(
  path: string,
  clearPkce: boolean
): NextResponse {
  const base = getAppPublicUrl();
  const res = NextResponse.redirect(new URL(path, base));
  if (clearPkce) {
    res.cookies.delete(GOOGLE_OAUTH_PKCE_COOKIE);
  }
  return res;
}

export async function GET(req: Request) {
  const base = getAppPublicUrl();
  const secrets = getGoogleOAuthSecrets();
  if (!secrets) {
    return redirectWithCookieClear("/logowanie?k=client&ge=cfg", true);
  }

  const url = new URL(req.url);
  const oauthError = url.searchParams.get("error");
  if (oauthError === "access_denied") {
    return redirectWithCookieClear("/logowanie?k=client&ge=denied", true);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    return redirectWithCookieClear("/logowanie?k=client&ge=state", true);
  }

  const jar = await cookies();
  const raw = jar.get(GOOGLE_OAUTH_PKCE_COOKIE)?.value;

  const payload = raw ? unpackGooglePkceCookie(raw, secrets.cookieSecret) : null;
  if (!payload || payload.state !== state) {
    return redirectWithCookieClear("/logowanie?k=client&ge=state", true);
  }

  try {
    const exchanged = await exchangeGoogleCode(secrets, code, payload.codeVerifier);
    if ("error" in exchanged) {
      return redirectWithCookieClear("/logowanie?k=client&ge=token", true);
    }

    const profile = await fetchGoogleUserInfo(exchanged.access_token);
    if (!profile) {
      return redirectWithCookieClear("/logowanie?k=client&ge=profile", true);
    }

    const auth = await upsertClientUserFromGoogle(profile);
    if (!auth.ok) {
      return redirectWithCookieClear(`/logowanie?k=client&ge=${auth.redirectCode}`, true);
    }

    const { token } = await createClientSessionForUserId(auth.userId);
    const res = NextResponse.redirect(new URL("/dashboard", base));
    res.cookies.delete(GOOGLE_OAUTH_PKCE_COOKIE);
    res.cookies.set(
      COOKIE_NAME_CLIENT,
      token,
      buildSessionCookieOptions(getSessionTtlForScope(SessionScope.CLIENT))
    );
    return res;
  } catch (err) {
    console.error("[api/auth/google/callback]", err);
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return redirectWithCookieClear("/logowanie?k=client&ge=duplicate", true);
    }
    return redirectWithCookieClear("/logowanie?k=client&ge=server", true);
  }
}
