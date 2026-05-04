import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { getGoogleOAuthSecrets } from "@/lib/auth/google-config";
import {
  COOKIE_MAX_AGE_SEC,
  GOOGLE_OAUTH_PKCE_COOKIE,
  packGooglePkceCookie,
} from "@/lib/auth/google-oauth-pkce-cookie";
import { buildGoogleAuthorizeUrl, randomUrlSafeString } from "@/lib/auth/google-oauth-flow";
import { rateLimitOrThrow } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const secrets = getGoogleOAuthSecrets();
  if (!secrets) {
    return NextResponse.redirect(new URL("/logowanie?k=client&ge=cfg", origin));
  }

  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "0";
  try {
    await rateLimitOrThrow(`go:${ip}`, "googleOAuth");
  } catch {
    return NextResponse.redirect(new URL("/logowanie?k=client&ge=limit", origin));
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

  const redirectUri = `${origin}/api/auth/google/callback`;
  const authorize = buildGoogleAuthorizeUrl(secrets, state, codeVerifier, redirectUri);
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
