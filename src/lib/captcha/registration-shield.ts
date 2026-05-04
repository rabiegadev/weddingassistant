import { createHmac, timingSafeEqual } from "node:crypto";

const TTL_MS = 15 * 60 * 1000;
const MIN_DELAY_MS = 2_800;

type TimingPayload = { v: 2; exp: number; nb: number };

function getShieldSecret(): string | null {
  const s = process.env.MATH_CAPTCHA_SECRET?.trim();
  return s && s.length >= 12 ? s : null;
}

function isTimingPayload(x: unknown): x is TimingPayload {
  if (typeof x !== "object" || x === null) {
    return false;
  }
  const o = x as Record<string, unknown>;
  return o.v === 2 && typeof o.exp === "number" && typeof o.nb === "number";
}

/**
 * Ukryty token czasu (HMAC) — użytkownik musi odczekać ~3 s od załadowania formularza.
 * W dev bez `MATH_CAPTCHA_SECRET` zwraca token „dev-reg”.
 */
export function buildRegistrationTimingToken(): string | null {
  const secret = getShieldSecret();
  const devFallback = !secret && process.env.NODE_ENV === "development";
  if (devFallback) {
    return "dev-reg";
  }
  if (!secret) {
    return null;
  }
  const now = Date.now();
  const payload: TimingPayload = { v: 2, exp: now + TTL_MS, nb: now + MIN_DELAY_MS };
  const json = JSON.stringify(payload);
  const sig = createHmac("sha256", secret).update(json, "utf8").digest("hex");
  return `${Buffer.from(json, "utf8").toString("base64url")}.${sig}`;
}

/**
 * Weryfikacja ukrytego pola `wa_reg_timing` (gdy używane zamiast Turnstile).
 */
export function verifyRegistrationTimingForm(
  formData: FormData
): { ok: true } | { ok: false; error: string } {
  const token = (formData.get("wa_reg_timing") as string | null)?.trim() ?? "";
  const devNoSecret = !getShieldSecret() && process.env.NODE_ENV === "development";
  if (devNoSecret && token === "dev-reg") {
    return { ok: true };
  }
  const secret = getShieldSecret();
  if (!secret) {
    return { ok: false, error: "Błąd konfiguracji serwera (rejestracja). Skontaktuj się z administratorem." };
  }
  if (!token) {
    return { ok: false, error: "Odśwież stronę i spróbuj ponownie (sesja formularza)." };
  }
  const lastDot = token.lastIndexOf(".");
  if (lastDot < 1) {
    return { ok: false, error: "Nieprawidłowe zabezpieczenie. Odśwież stronę." };
  }
  const payloadB64 = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  let json: string;
  try {
    json = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return { ok: false, error: "Nieprawidłowe zabezpieczenie. Odśwież stronę." };
  }
  const expected = createHmac("sha256", secret).update(json, "utf8").digest("hex");
  const sigBuf = Buffer.from(sig, "hex");
  const expBuf = Buffer.from(expected, "hex");
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return { ok: false, error: "Nieprawidłowe zabezpieczenie. Odśwież stronę." };
  }
  let p: unknown;
  try {
    p = JSON.parse(json) as unknown;
  } catch {
    return { ok: false, error: "Nieprawidłowe zabezpieczenie. Odśwież stronę." };
  }
  if (!isTimingPayload(p)) {
    return { ok: false, error: "Nieprawidłowe zabezpieczenie. Odśwież stronę." };
  }
  if (p.exp < Date.now()) {
    return { ok: false, error: "Formularz wygasł. Odśwież stronę i spróbuj ponownie." };
  }
  if (Date.now() < p.nb) {
    return { ok: false, error: "Poczekaj chwilę i wyślij formularz ponownie (ochrona przed botami)." };
  }
  return { ok: true };
}
