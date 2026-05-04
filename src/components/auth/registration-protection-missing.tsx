/**
 * Gdy w produkcji brak zarówno Turnstile (site + secret), jak i `MATH_CAPTCHA_SECRET` do tokena czasu.
 */
export function RegistrationProtectionMissingNotice() {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-950">
      <p className="font-medium">Rejestracja chwilowo niedostępna</p>
      <p className="mt-2">
        Ustaw na serwerze <strong>albo</strong> Cloudflare Turnstile:{" "}
        <code className="rounded bg-white/90 px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_TURNSTILE_SITE_KEY</code> +{" "}
        <code className="rounded bg-white/90 px-1.5 py-0.5 font-mono text-xs">TURNSTILE_SECRET_KEY</code>
        , <strong>albo</strong> sekret czasu (min. 12 znaków):{" "}
        <code className="rounded bg-white/90 px-1.5 py-0.5 font-mono text-xs">MATH_CAPTCHA_SECRET</code> — ten sam
        mechanizm co przy resecie hasła; po dodaniu zrób redeploy (Vercel).
      </p>
    </div>
  );
}
