"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAdminAction, type LoginState } from "@/app/actions/auth";

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
  const [state, formAction] = useActionState(loginAdminAction, initial);
  return (
    <form action={formAction} className="mt-0 space-y-3">
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
      {state && "error" in state && state.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
      <Submit />
    </form>
  );
}
