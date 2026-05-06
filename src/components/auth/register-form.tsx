"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { registerClientAction, type AuthFormState } from "@/app/actions/auth";
import type { RegisterPreflight } from "@/lib/captcha/register-preflight";
import { RegistrationAntispamFields } from "@/components/auth/registration-antispam-fields";

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

export function RegisterForm({ preflight }: { preflight: RegisterPreflight }) {
  const [state, formAction] = useActionState(registerClientAction, initial);
  return (
    <form action={formAction} className="relative mt-0 space-y-3">
      <div>
        <label className="text-sm text-[#3A3A3A]" htmlFor="name">
          Imię i nazwisko
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
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
          Hasło
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1 w-full rounded-md border border-[#D9C6A0] bg-white/90 px-3 py-2 text-sm"
        />
        <p className="mt-0.5 text-xs text-[#5A5A5A]">
          Hasło musi zawierać min. 12 znaków - w tym wielką literę, małą literę, cyfrę oraz znak specjalny.
        </p>
      </div>
      <div>
        <label className="text-sm text-[#3A3A3A]" htmlFor="passwordConfirm">
          Powtórz hasło
        </label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          autoComplete="new-password"
          required
          className="mt-1 w-full rounded-md border border-[#D9C6A0] bg-white/90 px-3 py-2 text-sm"
        />
      </div>
      <RegistrationAntispamFields preflight={preflight} />
      {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-800">{state.success}</p> : null}
      {state.warning ? <p className="text-sm text-amber-900/90">{state.warning}</p> : null}
      <Submit />
    </form>
  );
}
