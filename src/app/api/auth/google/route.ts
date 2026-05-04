import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getAppPublicUrl } from "@/lib/env/public";
import { getGoogleOAuthSecrets } from "@/lib/auth/google-config";
import {
  COOKIE_MAX_AGE_SEC,
  GOOGLE_OAUTH_PKCE_COOKIE,
  packGooglePkceCookie,
} from "@/lib/auth/google-oauth-pkce-cookie";
import { buildGoogleAuthorizeUrl, randomUrlSafeString } from "@/lib/auth/google-oauth-flow";
import { rateLimitOrThrow } from "@/lib/rate-limit";

export async function GET() {
  const secrets = getGoogleOAuthSecrets();
  const base = getAppPublicUrl();
  if (!secrets) {
    return NextResponse.redirect(new URL("/logowanie?k=client&ge=cfg", base));
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "0";
  try {
    await rateLimitOrThrow(`go:${ip}`, "googleOAuth");
  } catch {
    return NextResponse.redirect(new URL("/logowanie?k=client&ge=limit", base));
  }

  const state = randomUrlSafeString(24);
  const codeVerifier = randomUrlSafeString(32);
  const packed = packGooglePkceCookie(
    {
      state,
      codeVerifier,
      exp: Date.now() + COOKIE_MAX_AGE_SEC * 1000,
    },
    secrets.cookieSecret
  );

  const authorize = buildGoogleAuthorizeUrl(secrets, state, codeVerifier);
  const res = NextResponse.redirect(authorize);
  res.cookies.set(GOOGLE_OAUTH_PKCE_COOKIE, packed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: COOKIE_MAX_AGE_SEC,
  });
  return res;
}
