"use client";

import { useState, useCallback } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

/**
 * W formularzach: Cloudflare wstrzykuje `cf-turnstile-response` (gdy `siteKey` obecne).
 * Bez site key (dev) — puste pole, serwer pomija weryfikację w trybie testowym.
 *
 * Gdy domena strony (np. *.vercel.app) **nie** jest w panelu Cloudflare dla tego site key,
 * widżet się nie załaduje / nie da tokenu — poniżej komunikat + link do dokumentacji.
 */
export function TurnstileField() {
  const [loadError, setLoadError] = useState(false);

  const onError = useCallback(() => {
    setLoadError(true);
  }, []);

  if (!siteKey) {
    return <input name="cf-turnstile-response" type="hidden" value="" readOnly aria-hidden />;
  }
  return (
    <div className="space-y-2">
      <div
        className="min-h-[70px] rounded-md border border-[#D9C6A0]/80 bg-white/50 p-1"
        data-turnstile-container
      >
        <Turnstile
          siteKey={siteKey}
          onError={onError}
          options={{
            theme: "light",
            size: "normal",
            appearance: "always",
            language: "pl",
          }}
        />
      </div>
      {loadError ? (
        <p className="text-xs text-amber-900/90">
          Nie udało się załadować captcha (często: ta domena nie jest wpisana w Cloudflare
          Turnstile przy tym kluczu). Dla <strong>preview</strong> w Vercel weryfikacja bywa
          automatycznie pomijana. Na produkcji:{" "}
          <a
            className="underline"
            href="https://developers.cloudflare.com/turnstile/troubleshooting/client-side-errors/"
            rel="noreferrer"
            target="_blank"
          >
            troubleshooting
          </a>{" "}
          albo dodaj host w panelu widgetu.
        </p>
      ) : null}
    </div>
  );
}
