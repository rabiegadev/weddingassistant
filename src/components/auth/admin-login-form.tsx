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
      className="h-12 w-full rounded-md bg-[#B8955C] py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105 disabled:opacity-50"
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
      <p className="text-xs text-slate-500">Wymaga potwierdzonego e-maila i 2FA po pierwszym logowaniu.</p>
      <div>
        <label className="text-sm text-slate-700" htmlFor="a-email">
          E-mail
        </label>
        <input
          id="a-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
        />
      </div>
      <div>
        <label className="text-sm text-slate-700" htmlFor="a-pass">
          Hasło
        </label>
        <input
          id="a-pass"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="mt-1 w-full rounded border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm"
        />
      </div>
      <div className="pt-1">
        <TurnstileField />
      </div>
      {state && "error" in state && state.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
      <Submit />
    </form>
  );
}
