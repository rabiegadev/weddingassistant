"use client";

import { useActionState } from "react";
import { WeddingPageRequestStatus } from "@prisma/client";
import {
  adminUpdateWeddingPageRequestAction,
  adminCreateWeddingPageRequestAction,
  type AdminWeddingReqState,
} from "@/app/actions/admin-wedding-requests";

const init: AdminWeddingReqState = undefined;

function statusPl(s: WeddingPageRequestStatus): string {
  const m: Record<WeddingPageRequestStatus, string> = {
    NEW: "Nowe",
    IN_REVIEW: "W recenzji",
    IN_PROGRESS: "W realizacji",
    AWAITING_CLIENT: "Oczekuje na parę",
    DONE: "Zakończone",
    CANCELLED: "Anulowane",
  };
  return m[s] ?? s;
}

export function CreateWeddingRequestForm() {
  const [st, action] = useActionState(adminCreateWeddingPageRequestAction, init);
  return (
    <form action={action} className="flex flex-wrap items-end gap-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <label className="text-xs font-medium text-slate-600">E-mail użytkownika (para)</label>
        <input
          name="userEmail"
          type="email"
          required
          placeholder="para@example.com"
          className="mt-0.5 block w-72 max-w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-slate-800 px-3 py-2 text-xs font-medium text-white hover:bg-slate-700"
      >
        Utwórz zgłoszenie
      </button>
      {st && "error" in st && st.error ? <span className="text-xs text-rose-600">{st.error}</span> : null}
      {st && "ok" in st && st.ok ? <span className="text-xs text-emerald-700">Dodano.</span> : null}
    </form>
  );
}

export function EditWeddingRequestForm({
  id,
  userEmail,
  currentStatus,
  internalNote,
}: {
  id: string;
  userEmail: string;
  currentStatus: WeddingPageRequestStatus;
  internalNote: string | null;
}) {
  const [st, action] = useActionState(adminUpdateWeddingPageRequestAction, init);
  return (
    <form action={action} className="mt-3 space-y-2 rounded-lg border border-slate-100 bg-slate-50/80 p-3">
      <input type="hidden" name="id" value={id} readOnly />
      <div className="flex flex-wrap gap-2">
        <div>
          <label className="text-xs text-slate-600">Status</label>
          <select
            name="status"
            defaultValue={currentStatus}
            className="mt-0.5 block rounded border border-slate-300 bg-white px-2 py-1 text-sm"
          >
            {(Object.values(WeddingPageRequestStatus) as WeddingPageRequestStatus[]).map((s) => (
              <option key={s} value={s}>
                {statusPl(s)}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="self-end rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700"
        >
          Zapisz
        </button>
      </div>
      <div>
        <label className="text-xs text-slate-600">Notatka wewnętrzna</label>
        <textarea
          name="internalNote"
          rows={3}
          defaultValue={internalNote ?? ""}
          className="mt-0.5 w-full max-w-2xl rounded border border-slate-300 bg-white px-2 py-1 text-sm"
        />
      </div>
      {st && "error" in st && st.error ? <p className="text-xs text-rose-600">{st.error}</p> : null}
      {st && "ok" in st && st.ok ? <p className="text-xs text-emerald-700">Zapisano.</p> : null}
      <p className="text-xs text-slate-400">Klient: {userEmail}</p>
    </form>
  );
}
