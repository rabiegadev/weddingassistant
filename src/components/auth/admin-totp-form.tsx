"use client";

import { useFormState, useFormStatus } from "react-dom";
import { completeTotpSetupAction, verifyAdminTotpAfterPasswordAction } from "@/app/actions/auth";
import type { AuthFormState } from "@/app/actions/auth";

function SubmitLabel({ idle, busy }: { idle: string; busy: string }) {
  const { pending } = useFormStatus();
  return <span>{pending ? busy : idle}</span>;
}

const initial: AuthFormState = {};

type Props = { action: "firstSetup" | "afterLogin" };

export function AdminTotpForm({ action: kind }: Props) {
  const act = kind === "firstSetup" ? completeTotpSetupAction : verifyAdminTotpAfterPasswordAction;
  const [state, formAction] = useFormState(act, initial);
  return (
    <form action={formAction} className="space-y-3">
      <label className="block text-sm text-slate-700" htmlFor="code">
        Kod 2FA
      </label>
      <input
        id="code"
        name="code"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-slate-900"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={8}
        required
        aria-invalid={state.error ? "true" : "false"}
      />
      {state.error ? <p className="text-sm text-rose-600">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-700">{state.success}</p> : null}
      <button
        type="submit"
        className="w-full rounded-md bg-[#B8955C] py-2.5 text-sm font-medium text-white transition hover:brightness-105"
      >
        <SubmitLabel idle="Kontynuuj" busy="Trwa…" />
      </button>
    </form>
  );
}
