"use client";

import { useFormState, useFormStatus } from "react-dom";
import { postOrderMessageAction, type OrderActionState } from "@/app/actions/orders";

const init: OrderActionState = undefined;

function Send() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="rounded bg-zinc-800 py-1.5 px-3 text-xs text-amber-100 disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "…" : "Wyślij"}
    </button>
  );
}

type Props = { orderId: string; isFromAdmin: boolean; dark?: boolean };

export function OrderMessageForm({ orderId, isFromAdmin, dark }: Props) {
  const [st, formAction] = useFormState(postOrderMessageAction, init);
  return (
    <form action={formAction} className="space-y-1 text-sm">
      <input name="orderId" type="hidden" value={orderId} readOnly />
      <textarea
        className={
          dark
            ? "min-h-20 w-full rounded border border-amber-900/40 bg-zinc-900/50 px-2 py-1 text-amber-50"
            : "min-h-20 w-full rounded border border-[#B8A99A] bg-white px-2 py-1"
        }
        name="body"
        required
        placeholder={isFromAdmin ? "Odpowiedź do pary młodej (e-mail wychodzi automatycznie)" : "Napisz do obsługi…"}
      />
      {st && "error" in st && st.error ? <p className="text-rose-400 text-xs">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-xs text-emerald-400">Wysłano.</p> : null}
      <Send />
    </form>
  );
}
