type TurnstileResult = { success: boolean; "error-codes"?: string[] };

/**
 * Weryfikacja odpowiedzi Cloudflare Turnstile. Brak `TURNSTILE_SECRET` w dev: pomija (z logiem).
 * W `production` — gdy brak secret: blokuje (lub wymuś tylko na wrażliwych formularzach).
 */
export async function verifyTurnstileIfConfigured(
  token: string | undefined
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!token || !token.length) {
    if (!secret) {
      return { ok: true };
    }
    return { ok: false, error: "Brak odpowiedzi captcha." };
  }
  if (!secret) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[turnstile] TURNSTILE_SECRET_KEY puste — weryfikacja pominięta (dev).");
    }
    return { ok: true };
  }
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  const r = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!r.ok) {
    return { ok: false, error: "Nie udało się potwierdzić captcha. Spróbuj ponownie." };
  }
  const j = (await r.json()) as TurnstileResult;
  if (!j.success) {
    return { ok: false, error: "Nie udało się potwierdzić, że nie jesteś botem." };
  }
  return { ok: true };
}
