"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { adminUpdateOrderDetailsAction, type AdminOrderEditState } from "@/app/actions/admin-order-edit";

const init: AdminOrderEditState = undefined;

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700 disabled:opacity-50"
    >
      {pending ? "Zapis…" : "Zapisz korektę"}
    </button>
  );
}

export function AdminOrderEditForm({
  orderId,
  totalCents,
  packageId,
  packages,
}: {
  orderId: string;
  totalCents: number;
  packageId: string;
  packages: { id: string; name: string }[];
}) {
  const [st, formAction] = useActionState(adminUpdateOrderDetailsAction, init);
  const pln = (totalCents / 100).toFixed(2);
  return (
    <form action={formAction} className="space-y-2 text-sm text-slate-800">
      <input type="hidden" name="orderId" value={orderId} readOnly />
      <div>
        <label htmlFor="totalPln" className="font-medium">
          Kwota brutto (PLN)
        </label>
        <input
          id="totalPln"
          name="totalPln"
          type="number"
          step="0.01"
          min="0"
          defaultValue={pln}
          className="mt-0.5 block w-full max-w-xs rounded border border-slate-300 px-2 py-1.5"
        />
      </div>
      <p className="text-xs text-slate-500">Kwota w PLN — zapisujemy jako grosze w bazie.</p>
      <PackageSelect packages={packages} current={packageId} />
      <div>
        <label htmlFor="noteO" className="font-medium">
          Notatka operacyjna
        </label>
        <textarea
          id="noteO"
          name="note"
          rows={2}
          className="mt-0.5 w-full max-w-xl rounded border border-slate-300 px-2 py-1 text-sm"
          placeholder="Opcjonalnie: powód korekty"
        />
      </div>
      {st && "error" in st && st.error ? <p className="text-xs text-rose-600">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-xs text-emerald-700">Zapisano.</p> : null}
      <Submit />
    </form>
  );
}

function PackageSelect({
  packages,
  current,
}: {
  packages: { id: string; name: string }[];
  current: string;
}) {
  return (
    <div>
      <label htmlFor="pkg" className="font-medium">
        Pakiet (katalog)
      </label>
      <select
        id="pkg"
        name="packageId"
        defaultValue={current}
        className="mt-0.5 block w-full max-w-xl rounded border border-slate-300 px-2 py-1.5"
      >
        {packages.map((p) => (
          <option key={p.id} value={p.id}>
            {p.name}
          </option>
        ))}
      </select>
    </div>
  );
}
