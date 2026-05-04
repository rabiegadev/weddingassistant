import { buildRegistrationTimingToken } from "@/lib/captcha/registration-shield";

export type RegisterPreflight = {
  timingToken: string | null;
  turnstileSiteKey: string | null;
};

export function getRegisterPreflight(): RegisterPreflight {
  return {
    timingToken: buildRegistrationTimingToken(),
    turnstileSiteKey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? null,
  };
}

/**
 * Czy rejestracja może działać w tym środowisku (Turnstile skonfigurowany albo token czasu albo dev).
 */
export function isRegistrationFormConfigured(preflight: RegisterPreflight): boolean {
  const turnstileOk =
    Boolean(preflight.turnstileSiteKey) && Boolean(process.env.TURNSTILE_SECRET_KEY?.trim());
  if (turnstileOk) {
    return true;
  }
  if (preflight.timingToken) {
    return true;
  }
  return process.env.NODE_ENV === "development";
}
