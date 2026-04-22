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
      <label className="block text-sm text-zinc-300" htmlFor="code">
        Kod 2FA
      </label>
      <input
        id="code"
        name="code"
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
        inputMode="numeric"
        autoComplete="one-time-code"
        maxLength={8}
        required
        aria-invalid={state.error ? "true" : "false"}
      />
      {state.error ? <p className="text-sm text-rose-300">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-emerald-300">{state.success}</p> : null}
      <button
        type="submit"
        className="w-full rounded-md bg-amber-600/90 py-2.5 text-sm font-medium text-zinc-950 transition hover:bg-amber-500"
      >
        <SubmitLabel idle="Kontynuuj" busy="Trwa…" />
      </button>
    </form>
  );
}
