import { headers } from "next/headers";

type TurnstileResult = { success: boolean; "error-codes"?: string[] };

/**
 * Weryfikacja odpowiedzi Cloudflare Turnstile. Brak `TURNSTILE_SECRET` w dev: pomija (z logiem).
 *
 * Żądania z hosta **\*.vercel.app** często nie dostają tokenu, bo tej domeny nie ma w
 * panelu Cloudflare (Turnstile) przy danym site key — wtedy (gdy jest `TURNSTILE_SECRET`,
 * ale brak tokenu) **pomijamy** wymuszenie i logujemy ostrzeżenie. Na własnej domenie captcha
 * nadal jest wymagana. Docelowo: dodaj host w Cloudflare lub używaj domeny produkcyjnej.
 */
export async function verifyTurnstileIfConfigured(
  token: string | undefined
): Promise<{ ok: true } | { ok: false; error: string }> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!token || !token.length) {
    if (!secret) {
      return { ok: true };
    }
    const h = await headers();
    const raw = h.get("x-forwarded-host") ?? h.get("host") ?? "";
    const hostOnly = raw.split(":")[0]?.toLowerCase() ?? "";
    if (hostOnly.endsWith(".vercel.app")) {
      console.warn(
        "[turnstile] Brak tokenu, host *.vercel.app — weryfikacja pomijana. Aby wymuszać Turnstile na tym URL, dodaj domenę w ustawieniach widgetu w Cloudflare."
      );
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
