"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginClientAction, type LoginState } from "@/app/actions/auth";
import { MathCaptchaField } from "./math-captcha-field";
import type { MathChallengeClient } from "@/lib/captcha/math-challenge";

const initial: LoginState = undefined;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="h-12 w-full rounded-md bg-[#B8955C] px-4 text-sm font-semibold text-white disabled:opacity-60"
      disabled={pending}
    >
      {pending ? "Ładowanie…" : "Zaloguj się"}
    </button>
  );
}

export function ClientLoginForm({ challenge }: { challenge: MathChallengeClient }) {
  const [state, formAction] = useFormState(loginClientAction, initial);
  return (
    <form action={formAction} className="mt-4 space-y-3">
      <div>
        <label className="text-sm text-[#3A3A3A]" htmlFor="c-email">
          E-mail
        </label>
        <input
          id="c-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="mt-1 w-full rounded-md border border-[#D9C6A0] bg-white/90 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm text-[#3A3A3A]" htmlFor="c-pass">
          Hasło
        </label>
        <input
          id="c-pass"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-md border border-[#D9C6A0] bg-white/90 px-3 py-2 text-sm"
        />
      </div>
      <MathCaptchaField challenge={challenge} inputId="c-math" />
      {state && "error" in state && state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
      <Submit />
    </form>
  );
}
