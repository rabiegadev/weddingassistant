"use client";

import { useFormState, useFormStatus } from "react-dom";
import { OrderStatus } from "@prisma/client";
import { updateOrderStatusAction, type OrderActionState } from "@/app/actions/orders";

const init: OrderActionState = undefined;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="mt-1 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-800 shadow-sm hover:bg-slate-50"
      disabled={pending}
    >
      {pending ? "…" : "Zmień status (mail do pary)"}
    </button>
  );
}

const all: OrderStatus[] = [
  "DRAFT",
  "SUBMITTED",
  "PENDING_REVIEW",
  "APPROVED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export function AdminOrderStatusForm({ orderId, current }: { orderId: string; current: OrderStatus }) {
  const [st, formAction] = useFormState(updateOrderStatusAction, init);
  return (
    <form action={formAction} className="mt-2 space-y-1 text-left text-sm text-slate-800">
      <input name="orderId" type="hidden" value={orderId} readOnly />
      <div>
        <label htmlFor="st">Status</label>
        <select
          id="st"
          name="status"
          className="mt-0.5 block w-full max-w-md rounded border border-slate-300 bg-white px-2 py-1.5 text-slate-900 shadow-sm"
          defaultValue={current}
        >
          {all.map((x) => (
            <option value={x} key={x}>
              {x}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="n">Notatka (w historii + w mailu)</label>
        <textarea
          id="n"
          name="note"
          className="mt-0.5 min-h-16 w-full max-w-2xl rounded border border-slate-300 bg-white px-2 py-1 text-slate-900 shadow-sm"
        />
      </div>
      {st && "error" in st && st.error ? <p className="text-rose-600 text-xs">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-xs text-emerald-700">Zaktualizowano.</p> : null}
      <Submit />
    </form>
  );
}
