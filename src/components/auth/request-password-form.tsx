"use client";

import { useFormState, useFormStatus } from "react-dom";
import { requestPasswordResetAction, type PassState } from "@/app/actions/password";
import { TurnstileField } from "./turnstile-field";

const initial: PassState = {};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="mt-2 w-full rounded-md border border-[#B8955C] bg-white py-2.5 text-sm font-medium text-[#2B2B2B] disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Wysyłam…" : "Wyślij link"}
    </button>
  );
}

export function RequestPasswordForm() {
  const [state, formAction] = useFormState(requestPasswordResetAction, initial);
  return (
    <form action={formAction} className="mt-4 space-y-2">
      <label className="text-sm" htmlFor="e">
        E-mail
      </label>
      <input
        id="e"
        name="email"
        type="email"
        required
        className="w-full rounded-md border border-[#D9C6A0] px-3 py-2 text-sm"
      />
      <div className="pt-1">
        <TurnstileField />
      </div>
      {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-800">{state.success}</p> : null}
      <Submit />
    </form>
  );
}
