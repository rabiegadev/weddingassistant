import { createHmac, randomInt, timingSafeEqual } from "node:crypto";

export type MathChallengeClient = { question: string; token: string };

const CHALLENGE_TTL_MS = 15 * 60 * 1000; // 15 min

function getSecret(): string | null {
  const s = process.env.MATH_CAPTCHA_SECRET?.trim();
  return s && s.length >= 12 ? s : null;
}

type Payload = { a: number; b: number; c: number; exp: number; v: 1 };

function isPayload(x: unknown): x is Payload {
  if (typeof x !== "object" || x === null) {
    return false;
  }
  const o = x as Record<string, unknown>;
  return (
    o.v === 1 &&
    typeof o.a === "number" &&
    typeof o.b === "number" &&
    typeof o.c === "number" &&
    typeof o.exp === "number"
  );
}

/**
 * Losowe trzy składniki, suma do wpisania; token podpisany HMAC (bez sesji w DB).
 */
export function buildMathChallenge(): MathChallengeClient {
  const devFallback = !getSecret() && process.env.NODE_ENV === "development";
  if (devFallback) {
    return { question: "1 + 1 + 1", token: "dev" };
  }
  const secret = getSecret();
  if (!secret) {
    throw new Error(
      "MATH_CAPTCHA_SECRET nie jest ustawiony. Dodaj go do .env (min. 12 znaków, np. openssl rand -base64 32)."
    );
  }
  const a = randomInt(5, 99);
  const b = randomInt(5, 99);
  const c = randomInt(5, 99);
  const exp = Date.now() + CHALLENGE_TTL_MS;
  const payload: Payload = { a, b, c, exp, v: 1 };
  const json = JSON.stringify(payload);
  const sig = createHmac("sha256", secret).update(json, "utf8").digest("hex");
  const token = `${Buffer.from(json, "utf8").toString("base64url")}.${sig}`;
  return {
    question: `${a} + ${b} + ${c}`,
    token,
  };
}

/**
 * Weryfikacja pól: `math_captcha_token`, `math_captcha_answer` (dodatnia suma trzech liczb).
 */
export function verifyMathCaptchaForm(
  formData: FormData
): { ok: true } | { ok: false; error: string } {
  const token = (formData.get("math_captcha_token") as string | null)?.trim() ?? "";
  const answerRaw = (formData.get("math_captcha_answer") as string | null)?.trim() ?? "";

  const devNoSecret = !getSecret() && process.env.NODE_ENV === "development";
  if (devNoSecret && token === "dev") {
    const n = Number.parseInt(answerRaw, 10);
    if (n === 3) {
      return { ok: true };
    }
    return { ok: false, error: "Nieprawidłowa odpowiedź (1 + 1 + 1 = 3)." };
  }

  const secret = getSecret();
  if (!secret) {
    console.error("[math-captcha] MATH_CAPTCHA_SECRET brak w produkcji / preview.");
    return { ok: false, error: "Błąd konfiguracji serwera. Skontaktuj się z administratorem." };
  }
  if (!token.length) {
    return { ok: false, error: "Brak zadania zabezpieczenia. Odśwież stronę i spróbuj ponownie." };
  }

  const lastDot = token.lastIndexOf(".");
  if (lastDot < 1) {
    return { ok: false, error: "Nieprawidłowe zadanie. Odśwież stronę." };
  }
  const payloadB64 = token.slice(0, lastDot);
  const sig = token.slice(lastDot + 1);
  let json: string;
  try {
    json = Buffer.from(payloadB64, "base64url").toString("utf8");
  } catch {
    return { ok: false, error: "Nieprawidłowe zadanie. Odśwież stronę." };
  }
  const expected = createHmac("sha256", secret).update(json, "utf8").digest("hex");
  if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(sig, "hex"))) {
    return { ok: false, error: "Nieprawidłowe zadanie. Odśwież stronę." };
  }
  let p: unknown;
  try {
    p = JSON.parse(json) as unknown;
  } catch {
    return { ok: false, error: "Nieprawidłowe zadanie. Odśwież stronę." };
  }
  if (!isPayload(p)) {
    return { ok: false, error: "Nieprawidłowe zadanie. Odśwież stronę." };
  }
  if (p.exp < Date.now()) {
    return { ok: false, error: "Zadanie wygasło. Odśwież stronę i spróbuj ponownie." };
  }
  const want = p.a + p.b + p.c;
  const got = Number.parseInt(answerRaw.replace(/\s/g, ""), 10);
  if (!Number.isFinite(got) || got !== want) {
    return { ok: false, error: "Błędna odpowiedź. Policz sumę trzech liczb (np. 2 + 3 + 4 = 9)." };
  }
  return { ok: true };
}
