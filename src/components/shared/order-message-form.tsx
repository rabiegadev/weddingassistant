"use client";

import { useFormState, useFormStatus } from "react-dom";
import { postOrderMessageAction, type OrderActionState } from "@/app/actions/orders";

const init: OrderActionState = undefined;

function Send() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded border border-slate-300 bg-[#B8955C] py-1.5 px-3 text-xs font-medium text-white disabled:opacity-50 hover:brightness-105"
      disabled={pending}
    >
      {pending ? "…" : "Wyślij"}
    </button>
  );
}

type Props = { orderId: string; isFromAdmin: boolean };

export function OrderMessageForm({ orderId, isFromAdmin }: Props) {
  const [st, formAction] = useFormState(postOrderMessageAction, init);
  return (
    <form action={formAction} className="space-y-1 text-sm text-slate-800">
      <input name="orderId" type="hidden" value={orderId} readOnly />
      <textarea
        className="min-h-20 w-full rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 shadow-sm"
        name="body"
        required
        placeholder={
          isFromAdmin
            ? "Odpowiedź do pary młodej (e-mail wychodzi automatycznie)"
            : "Napisz do obsługi…"
        }
      />
      {st && "error" in st && st.error ? <p className="text-rose-600 text-xs">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-xs text-emerald-700">Wysłano.</p> : null}
      <Send />
    </form>
  );
}
