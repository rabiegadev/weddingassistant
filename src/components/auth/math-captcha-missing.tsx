/**
 * Gdy w produkcji brak `MATH_CAPTCHA_SECRET` — zamiast błędu 500 na stronie formularza.
 */
export function MathCaptchaMissingNotice() {
  return (
    <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-left text-sm text-amber-950">
      <p className="font-medium">Formularz chwilowo niedostępny</p>
      <p className="mt-2">
        Na serwerze nie ustawiono zmiennej{" "}
        <code className="rounded bg-white/90 px-1.5 py-0.5 font-mono text-xs">MATH_CAPTCHA_SECRET</code>{" "}
        (min. 12 znaków). W Vercel:{" "}
        <strong>Settings → Environment Variables → Production</strong> — dodaj sekret i zrób redeploy.
      </p>
      <p className="mt-2 text-xs text-amber-900/90">
        Generacja (Node):{" "}
        <code className="break-all rounded bg-white/90 px-1 font-mono text-[0.7rem]">
          node -e &quot;console.log(require(&apos;crypto&apos;).randomBytes(32).toString(&apos;base64&apos;))&quot;
        </code>
      </p>
    </div>
  );
}
