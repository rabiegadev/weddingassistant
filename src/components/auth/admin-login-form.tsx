"use client";

import { useFormState, useFormStatus } from "react-dom";
import { loginAdminAction, type LoginState } from "@/app/actions/auth";
import { TurnstileField } from "./turnstile-field";

const initial: LoginState = undefined;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="h-12 w-full rounded-md border border-amber-700/60 bg-amber-950/40 py-2 text-sm font-medium text-amber-100 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Ładowanie…" : "Dalej (2FA w kolejnych krokach)"}
    </button>
  );
}

export function AdminLoginForm() {
  const [state, formAction] = useFormState(loginAdminAction, initial);
  return (
    <form action={formAction} className="mt-4 space-y-3">
      <p className="text-xs text-amber-200/50">Wymaga potwierdzonego e-maila i 2FA po pierwszym logowaniu.</p>
      <div>
        <label className="text-sm text-amber-100/80" htmlFor="a-email">
          E-mail
        </label>
        <input
          id="a-email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded border border-amber-900/50 bg-zinc-900/80 px-3 py-2 text-sm"
        />
      </div>
      <div>
        <label className="text-sm text-amber-100/80" htmlFor="a-pass">
          Hasło
        </label>
        <input
          id="a-pass"
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded border border-amber-900/50 bg-zinc-900/80 px-3 py-2 text-sm"
        />
      </div>
      <div className="pt-1">
        <TurnstileField />
      </div>
      {state && "error" in state && state.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}
      <Submit />
    </form>
  );
}
