"use client";

import { useActionState, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { createOrderForClientAction, type OrderActionState } from "@/app/actions/orders";

const init: OrderActionState = undefined;

type PackageOption = { id: string; name: string; priceCents: number; description: string | null };
type P = PackageOption[];

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

export function CreateOrderForm({
  action,
  packages: packs,
  initialPackageId,
}: {
  action: typeof createOrderForClientAction;
  packages: P;
  initialPackageId?: string;
}) {
  const [st, formAction] = useActionState(action, init);
  const defaultPackageId = packs.some((p) => p.id === initialPackageId) ? initialPackageId : packs[0]?.id;
  const [selectedPackageId, setSelectedPackageId] = useState(defaultPackageId ?? "");
  const selectedPackage = useMemo(
    () => packs.find((p) => p.id === selectedPackageId) ?? null,
    [packs, selectedPackageId]
  );

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
          value={selectedPackageId}
          onChange={(event) => setSelectedPackageId(event.currentTarget.value)}
          required
        >
          {packs.map((p) => (
            <option value={p.id} key={p.id}>
              {p.name} — {(p.priceCents / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
            </option>
          ))}
        </select>
      </div>
      {selectedPackage ? (
        <div className="max-w-2xl rounded-md border border-[#D0C8BE] bg-[#faf6ef] p-3">
          <p className="font-medium text-[#2B1B0A]">
            Wybrany pakiet: {selectedPackage.name} -{" "}
            {(selectedPackage.priceCents / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" })}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[#4A4A4A]">
            {selectedPackage.description?.trim() || "Szczegóły pakietu pojawią się po zatwierdzeniu zamówienia."}
          </p>
        </div>
      ) : null}
      <div>
        <label className="block" htmlFor="sel">
          Dodatkowe informacje do zamówienia (opcjonalnie)
        </label>
        <input
          type="text"
          id="sel"
          className="mt-1 w-full max-w-2xl rounded border border-[#A09080] bg-white px-2 py-1.5"
          name="selection"
          defaultValue=""
          placeholder="Np. preferujemy kontakt mailowy po 18:00"
        />
      </div>
      {st && "error" in st && st.error ? <p className="text-rose-700">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-emerald-800">Zamówienie zapisane.</p> : null}
      <Submit />
    </form>
  );
}
