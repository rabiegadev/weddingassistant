"use client";

import { useActionState } from "react";
import { ContactInquiryStatus } from "@prisma/client";
import { adminSetContactInquiryStatusAction, type AdminContactState } from "@/app/actions/admin-contact";

const init: AdminContactState = undefined;

export function ContactInquiryRowActions({
  id,
  current,
}: {
  id: string;
  current: ContactInquiryStatus;
}) {
  const [st, action] = useActionState(adminSetContactInquiryStatusAction, init);
  return (
    <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
      <form action={action} className="flex items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={ContactInquiryStatus.READ} readOnly />
        <button
          type="submit"
          disabled={current === ContactInquiryStatus.READ}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs disabled:opacity-40"
        >
          Oznacz przeczytane
        </button>
      </form>
      <form action={action} className="flex items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={ContactInquiryStatus.ARCHIVED} readOnly />
        <button
          type="submit"
          disabled={current === ContactInquiryStatus.ARCHIVED}
          className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs disabled:opacity-40"
        >
          Archiwizuj
        </button>
      </form>
      <form action={action} className="flex items-center gap-2">
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="status" value={ContactInquiryStatus.NEW} readOnly />
        <button type="submit" className="text-xs text-slate-500 underline">
          Przywróć jako nowe
        </button>
      </form>
      {st && "error" in st && st.error ? (
        <span className="text-xs text-rose-600">{st.error}</span>
      ) : null}
      {st && "ok" in st && st.ok ? <span className="text-xs text-emerald-700">OK</span> : null}
    </div>
  );
}
