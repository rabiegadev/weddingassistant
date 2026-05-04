"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  startPrzelewy24PaymentAction,
  type Przelewy24StartState,
} from "@/app/actions/przelewy24-payment";

const initial: Przelewy24StartState = {};

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-lg border border-[#B8955C] bg-[#B8955C] px-4 py-2 text-sm font-medium text-white hover:brightness-105 disabled:opacity-50"
    >
      {pending ? "Przekierowanie…" : "Zapłać przez Przelewy24"}
    </button>
  );
}

export function StartPrzelewy24Payment({ orderId, inline }: { orderId: string; inline?: boolean }) {
  const [state, formAction] = useActionState(startPrzelewy24PaymentAction, initial);
  return (
    <form
      action={formAction}
      className={inline ? "inline-flex flex-col gap-2" : "mt-4 space-y-2 border-t border-[#D0C8BE] pt-4"}
    >
      <input type="hidden" name="orderId" value={orderId} readOnly />
      {!inline ? (
        <>
          <p className="text-sm font-medium text-[#2B1B0A]">Płatność online</p>
          <p className="text-xs text-[#5A5A5A]">
            Po kliknięciu nastąpi przekierowanie do bezpiecznej bramki Przelewy24.
          </p>
        </>
      ) : null}
      {state.error ? <p className="text-sm text-rose-700">{state.error}</p> : null}
      <Submit />
    </form>
  );
}
