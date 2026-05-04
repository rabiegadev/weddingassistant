import { createHash, randomBytes } from "node:crypto";
import { getAppPublicUrl } from "@/lib/env/public";
import type { GoogleOAuthSecrets } from "@/lib/auth/google-config";

const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const USERINFO_URL = "https://openidconnect.googleapis.com/v1/userinfo";

function base64Url(buf: Buffer): string {
  return buf
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/u, "");
}

export function randomUrlSafeString(byteLength = 32): string {
  return base64Url(randomBytes(byteLength));
}

export function pkceChallengeFromVerifier(verifier: string): string {
  return base64Url(createHash("sha256").update(verifier, "utf8").digest());
}

export function buildGoogleAuthorizeUrl(secrets: GoogleOAuthSecrets, state: string, codeVerifier: string): string {
  const redirectUri = `${getAppPublicUrl()}/api/auth/google/callback`;
  const challenge = pkceChallengeFromVerifier(codeVerifier);
  const params = new URLSearchParams({
    client_id: secrets.clientId,
    redirect_uri: redirectUri,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return `${AUTH_URL}?${params.toString()}`;
}

export type GoogleUserInfo = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
};

export async function exchangeGoogleCode(
  secrets: GoogleOAuthSecrets,
  code: string,
  codeVerifier: string
): Promise<{ access_token: string } | { error: string }> {
  const redirectUri = `${getAppPublicUrl()}/api/auth/google/callback`;
  const body = new URLSearchParams({
    client_id: secrets.clientId,
    client_secret: secrets.clientSecret,
    code,
    code_verifier: codeVerifier,
    grant_type: "authorization_code",
    redirect_uri: redirectUri,
  });
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json: unknown = await res.json().catch(() => null);
  if (!res.ok) {
    return { error: "token" };
  }
  if (!json || typeof json !== "object") {
    return { error: "token" };
  }
  const token = (json as Record<string, unknown>).access_token;
  if (typeof token !== "string" || !token) {
    return { error: "token" };
  }
  return { access_token: token };
}

export async function fetchGoogleUserInfo(accessToken: string): Promise<GoogleUserInfo | null> {
  const res = await fetch(USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) {
    return null;
  }
  const json: unknown = await res.json().catch(() => null);
  if (!json || typeof json !== "object") {
    return null;
  }
  const o = json as Record<string, unknown>;
  if (typeof o.sub !== "string" || typeof o.email !== "string") {
    return null;
  }
  const emailVerified = o.email_verified === true || o.email_verified === "true";
  return {
    sub: o.sub,
    email: o.email.trim().toLowerCase(),
    email_verified: emailVerified,
    name: typeof o.name === "string" ? o.name : undefined,
    picture: typeof o.picture === "string" ? o.picture : undefined,
  };
}
