import type { MathChallengeClient } from "@/lib/captcha/math-challenge";

type Props = { challenge: MathChallengeClient; inputId?: string };

/**
 * Proste zadanie „a + b + c” (suma) z tokenem w hidden — bez zewnętrznych usług (Cloudflare itd.).
 */
export function MathCaptchaField({ challenge, inputId = "math_captcha_answer" }: Props) {
  return (
    <div className="space-y-1.5 rounded-md border border-dashed border-[#C4A882]/80 bg-[#FDF8F0]/50 p-3">
      <p className="text-xs text-[#5A5A5A]">Krótkie zadanie (suma trzech liczb, bez kalkulatora w nagłówku to celowe).</p>
      <label className="block text-sm text-[#2B2B2B]" htmlFor={inputId}>
        Ile wynosi: <span className="font-medium tabular-nums">{challenge.question}</span> ?
      </label>
      <input name="math_captcha_token" type="hidden" value={challenge.token} readOnly />
      <input
        id={inputId}
        name="math_captcha_answer"
        type="text"
        inputMode="numeric"
        required
        autoComplete="off"
        className="w-full max-w-[12rem] rounded-md border border-[#D9C6A0] bg-white px-3 py-2 text-sm"
        placeholder="Suma (np. 15)"
        aria-label={`Wynik sumy: ${challenge.question}`}
      />
    </div>
  );
}
