"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createOrderForClientAction, type OrderActionState } from "@/app/actions/orders";

const init: OrderActionState = undefined;

type P = { id: string; name: string; priceCents: number }[];

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full max-w-sm rounded bg-[#B8955C] py-2 text-sm text-white disabled:opacity-50"
      disabled={pending}
    >
      {pending ? "Wysyłam…" : "Zarejestruj zamówienie"}
    </button>
  );
}

export function CreateOrderForm({ action, packages: packs }: { action: typeof createOrderForClientAction; packages: P }) {
  const [st, formAction] = useFormState(action, init);
  return (
    <form action={formAction} className="space-y-2 text-left text-sm">
      <div>
        <label className="block" htmlFor="pkg">
          Pakiet
        </label>
        <select
          className="mt-1 w-full max-w-sm rounded border border-[#A09080] bg-white px-2 py-1.5"
          name="packageId"
          id="pkg"
          required
        >
          {packs.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name} — {(p.priceCents / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block" htmlFor="sel">
          Notatka / wybory (JSON, opcjonalnie, np. {`{"dodatki":["RSVP"]}`})
        </label>
        <textarea
          id="sel"
          className="mt-1 w-full min-h-16 max-w-2xl rounded border border-[#A09080] font-mono text-xs"
          name="selection"
          defaultValue="{}"
        />
      </div>
      {st && "error" in st && st.error ? <p className="text-rose-700">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-emerald-800">Zamówienie zapisane.</p> : null}
      <Submit />
    </form>
  );
}
