"use client";

import { useEffect, useRef } from "react";
import type { RegisterPreflight } from "@/lib/captcha/register-preflight";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        options: {
          sitekey: string;
          theme?: "light" | "dark";
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

/**
 * Honeypot + opcjonalnie Cloudflare Turnstile; bez Turnstile — ukryty token czasu (`wa_reg_timing`).
 */
export function RegistrationAntispamFields({ preflight }: { preflight: RegisterPreflight }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const { turnstileSiteKey, timingToken } = preflight;

  useEffect(() => {
    if (!turnstileSiteKey || !hostRef.current) {
      return;
    }

    const mount = () => {
      const el = hostRef.current;
      if (!el || !window.turnstile) {
        return;
      }
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
      widgetIdRef.current = window.turnstile.render(el, {
        sitekey: turnstileSiteKey,
        theme: "light",
      });
    };

    const existing = document.querySelector<HTMLScriptElement>("script[data-wa-turnstile-api]");
    if (existing) {
      if (window.turnstile) {
        mount();
      } else {
        existing.addEventListener("load", mount, { once: true });
      }
      return () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch {
            /* ignore */
          }
          widgetIdRef.current = null;
        }
      };
    }

    const script = document.createElement("script");
    script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.dataset.waTurnstileApi = "1";
    script.addEventListener("load", mount, { once: true });
    document.body.appendChild(script);

    return () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          /* ignore */
        }
        widgetIdRef.current = null;
      }
    };
  }, [turnstileSiteKey]);

  return (
    <div className="relative space-y-3">
      <input
        name="wa_company"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        defaultValue=""
        className="pointer-events-none absolute left-0 top-0 -z-[1] h-px w-px opacity-0"
      />
      {timingToken ? <input type="hidden" name="wa_reg_timing" value={timingToken} /> : null}
      {turnstileSiteKey ? (
        <div className="flex flex-col items-center gap-1">
          <p className="text-center text-[0.7rem] font-medium uppercase tracking-[0.12em] text-[#7a726a]">
            Weryfikacja Cloudflare
          </p>
          <div ref={hostRef} className="min-h-[65px]" />
        </div>
      ) : timingToken ? (
        <p className="text-center text-[0.65rem] leading-snug text-[#7a726a]">
          Formularz jest chroniony przed zautomatyzowanym wysyłaniem (czas wypełnienia).
        </p>
      ) : null}
    </div>
  );
}
