import { verifyRegistrationTimingForm } from "@/lib/captcha/registration-shield";
import { verifyTurnstileResponse } from "@/lib/captcha/turnstile-verify";
import { headers } from "next/headers";

/**
 * Rejestracja: honeypot + (Turnstile **lub** token czasu).
 */
export async function verifyRegistrationAntiSpam(
  formData: FormData
): Promise<{ ok: true } | { ok: false; error: string }> {
  const hp = (formData.get("wa_company") as string | null)?.trim() ?? "";
  if (hp.length > 0) {
    return { ok: false, error: "Nie udało się wysłać formularza. Odśwież stronę." };
  }

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim();
  /** Na localhost klucze produkcyjnego Turnstile zwykle nie przechodzą (domena). */
  if (siteKey && turnstileSecret && process.env.NODE_ENV !== "development") {
    const response = (formData.get("cf-turnstile-response") as string | null)?.trim() ?? "";
    if (!response) {
      return { ok: false, error: "Potwierdź pole weryfikacji (Cloudflare) poniżej formularza." };
    }
    const h = await headers();
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || undefined;
    const ok = await verifyTurnstileResponse(response, turnstileSecret, ip);
    if (!ok) {
      return { ok: false, error: "Weryfikacja antyspamowa nie powiodła się. Odśwież stronę i spróbuj ponownie." };
    }
    return { ok: true };
  }

  return verifyRegistrationTimingForm(formData);
}
