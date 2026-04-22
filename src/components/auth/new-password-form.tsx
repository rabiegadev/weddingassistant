"use client";

import { useFormState, useFormStatus } from "react-dom";
import { resetPasswordWithTokenAction, type PassState } from "@/app/actions/password";
import { MathCaptchaField } from "./math-captcha-field";
import type { MathChallengeClient } from "@/lib/captcha/math-challenge";

const initial: PassState = {};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="mt-2 w-full rounded-md bg-[#B8955C] py-2.5 text-sm font-semibold text-white disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Zapis…" : "Ustaw hasło"}
    </button>
  );
}

export function NewPasswordForm({ token, challenge }: { token: string; challenge: MathChallengeClient }) {
  const [state, formAction] = useFormState(resetPasswordWithTokenAction, initial);
  return (
    <form action={formAction} className="mt-4 space-y-2 text-left text-sm">
      <input name="token" type="hidden" value={token} readOnly />
      <div>
        <label htmlFor="np">Nowe hasło</label>
        <input
          id="np"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1 w-full rounded-md border border-[#D9C6A0] px-3 py-2"
        />
        <p className="text-xs text-[#5A5A5A]">min. 12 znaków, wielka, mała, cyfra, znak spec.</p>
      </div>
      <MathCaptchaField challenge={challenge} inputId="np-math" />
      {state.error ? <p className="text-rose-700">{state.error}</p> : null}
      {state.success ? <p className="text-emerald-800">{state.success}</p> : null}
      <Submit />
    </form>
  );
}
