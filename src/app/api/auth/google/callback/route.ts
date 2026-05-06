import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Prisma, SessionScope } from "@prisma/client";
import { getGoogleOAuthSecrets } from "@/lib/auth/google-config";
import {
  GOOGLE_OAUTH_PKCE_COOKIE,
  unpackGooglePkceCookie,
} from "@/lib/auth/google-oauth-pkce-cookie";
import { exchangeGoogleCode, fetchGoogleUserInfo } from "@/lib/auth/google-oauth-flow";
import { upsertClientUserFromGoogle } from "@/lib/auth/google-oauth-user";
import { sendMailIfConfigured } from "@/lib/mail/send";
import { buildWelcomeGoogleMail } from "@/lib/mail/templates/presets";
import {
  COOKIE_NAME_CLIENT,
  buildSessionCookieOptions,
  createClientSessionForUserId,
  getSessionTtlForScope,
} from "@/lib/auth/session";

function redirectWithCookieClear(
  path: string,
  origin: string,
  clearPkce: boolean
): NextResponse {
  const res = NextResponse.redirect(new URL(path, origin));
  if (clearPkce) {
    res.cookies.delete(GOOGLE_OAUTH_PKCE_COOKIE);
  }
  return res;
}

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  const redirectUri = `${origin}/api/auth/google/callback`;
  const secrets = getGoogleOAuthSecrets();
  if (!secrets) {
    return redirectWithCookieClear("/logowanie?k=client&ge=cfg", origin, true);
  }

  const url = new URL(req.url);
  const oauthError = url.searchParams.get("error");
  if (oauthError === "access_denied") {
    return redirectWithCookieClear("/logowanie?k=client&ge=denied", origin, true);
  }

  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    return redirectWithCookieClear("/logowanie?k=client&ge=state", origin, true);
  }

  const jar = await cookies();
  const raw = jar.get(GOOGLE_OAUTH_PKCE_COOKIE)?.value;

  const payload = raw ? unpackGooglePkceCookie(raw, secrets.cookieSecret) : null;
  if (!payload || payload.state !== state) {
    return redirectWithCookieClear("/logowanie?k=client&ge=state", origin, true);
  }

  try {
    const exchanged = await exchangeGoogleCode(secrets, code, payload.codeVerifier, redirectUri);
    if ("error" in exchanged) {
      return redirectWithCookieClear("/logowanie?k=client&ge=token", origin, true);
    }

    const profile = await fetchGoogleUserInfo(exchanged.access_token);
    if (!profile) {
      return redirectWithCookieClear("/logowanie?k=client&ge=profile", origin, true);
    }

    const auth = await upsertClientUserFromGoogle(profile);
    if (!auth.ok) {
      return redirectWithCookieClear(`/logowanie?k=client&ge=${auth.redirectCode}`, origin, true);
    }

    if (auth.shouldSendWelcome) {
      const mail = buildWelcomeGoogleMail(origin);
      await sendMailIfConfigured({
        to: profile.email,
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        templateKey: mail.templateKey,
      });
    }

    const { token } = await createClientSessionForUserId(auth.userId);
    const res = NextResponse.redirect(new URL("/dashboard", origin));
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
      return redirectWithCookieClear("/logowanie?k=client&ge=duplicate", origin, true);
    }
    return redirectWithCookieClear("/logowanie?k=client&ge=server", origin, true);
  }
}
