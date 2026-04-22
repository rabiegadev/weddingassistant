"use client";

import { useFormState, useFormStatus } from "react-dom";
import { registerClientAction, type AuthFormState } from "@/app/actions/auth";
import { MathCaptchaField } from "./math-captcha-field";
import type { MathChallengeClient } from "@/lib/captcha/math-challenge";

const initial: AuthFormState = {};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="h-12 w-full rounded-md bg-[#B8955C] px-4 text-sm font-semibold text-white disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Wysyłam…" : "Załóż konto"}
    </button>
  );
}

export function RegisterForm({ challenge }: { challenge: MathChallengeClient }) {
  const [state, formAction] = useFormState(registerClientAction, initial);
  return (
    <form action={formAction} className="mt-4 space-y-3">
      <div>
        <label className="text-sm text-[#3A3A3A]" htmlFor="name">
          Imię pary (opcjonalne)
        </label>
        <input
          id="name"
          name="name"
          className="mt-1 w-full rounded-md border border-[#D9C6A0] bg-white/90 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm text-[#3A3A3A]" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-md border border-[#D9C6A0] bg-white/90 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm text-[#3A3A3A]" htmlFor="password">
          Silne hasło
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1 w-full rounded-md border border-[#D9C6A0] bg-white/90 px-3 py-2 text-sm"
        />
        <p className="mt-0.5 text-xs text-[#5A5A5A]">min. 12 znaków, wielka i mała litera, cyfra, znak spec.</p>
      </div>
      <MathCaptchaField challenge={challenge} inputId="reg-math" />
      {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-800">{state.success}</p> : null}
      {state.warning ? <p className="text-sm text-amber-900/90">{state.warning}</p> : null}
      <Submit />
    </form>
  );
}
