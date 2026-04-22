"use client";

import { Turnstile } from "@marsidev/react-turnstile";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * W formularzach: Cloudflare wstrzykuje `cf-turnstile-response` (gdy `siteKey` obecne).
 * Bez site key (dev) — puste pole, serwer pomija weryfikację w trybie testowym.
 */
export function TurnstileField() {
  if (!siteKey) {
    return <input name="cf-turnstile-response" type="hidden" value="" readOnly aria-hidden />;
  }
  return (
    <Turnstile
      siteKey={siteKey}
      options={{ theme: "light", size: "normal" }}
    />
  );
}
