import { createHmac, timingSafeEqual } from "node:crypto";

export const GOOGLE_OAUTH_PKCE_COOKIE = "wa_g_pkce" as const;
const COOKIE_MAX_AGE_SEC = 600;

export type GooglePkcePayload = {
  state: string;
  codeVerifier: string;
  exp: number;
};

function signBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body, "utf8").digest("hex");
}

export function packGooglePkceCookie(payload: GooglePkcePayload, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const sig = signBody(body, secret);
  return `${body}.${sig}`;
}

export function unpackGooglePkceCookie(raw: string, secret: string): GooglePkcePayload | null {
  const dot = raw.lastIndexOf(".");
  if (dot <= 0) {
    return null;
  }
  const body = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (!/^[a-f0-9]{64}$/i.test(sig)) {
    return null;
  }
  const expected = signBody(body, secret);
  const sigBuf = Buffer.from(sig, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return null;
  }
  try {
    const json = Buffer.from(body, "base64url").toString("utf8");
    const p = JSON.parse(json) as unknown;
    if (!p || typeof p !== "object") {
      return null;
    }
    const o = p as Record<string, unknown>;
    if (typeof o.state !== "string" || typeof o.codeVerifier !== "string" || typeof o.exp !== "number") {
      return null;
    }
    if (Date.now() > o.exp) {
      return null;
    }
    return { state: o.state, codeVerifier: o.codeVerifier, exp: o.exp };
  } catch {
    return null;
  }
}

export { COOKIE_MAX_AGE_SEC };
