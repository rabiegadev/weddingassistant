/**
 * Weryfikacja odpowiedzi Cloudflare Turnstile po stronie serwera.
 */
export async function verifyTurnstileResponse(
  token: string,
  secret: string,
  remoteip?: string
): Promise<boolean> {
  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);
  if (remoteip) {
    body.set("remoteip", remoteip);
  }
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  const json: unknown = await res.json().catch(() => null);
  if (!json || typeof json !== "object") {
    return false;
  }
  return (json as Record<string, unknown>).success === true;
}
