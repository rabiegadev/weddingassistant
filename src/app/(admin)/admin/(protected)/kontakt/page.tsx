import { ContactInquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { ContactInquiryRowActions } from "@/components/admin/contact-inquiry-row";

export const dynamic = "force-dynamic";

function statusPl(s: ContactInquiryStatus): string {
  const m: Record<ContactInquiryStatus, string> = {
    NEW: "Nowe",
    READ: "Przeczytane",
    ARCHIVED: "Archiwum",
  };
  return m[s] ?? s;
}

export default async function AdminKontaktPage() {
  const a = await getFullAdminSession();
  if (!a) {
    return null;
  }
  const rows = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 300,
  });
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="text-xl font-semibold text-slate-900">Zapytania kontaktowe</h2>
      <p className="mt-1 text-sm text-slate-600">Statusy: nowe → przeczytane → archiwum.</p>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Brak wiadomości.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {rows.map((r) => (
            <article
              key={r.id}
              className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium text-slate-900">{r.name}</p>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-700">
                  {statusPl(r.status)}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {r.email}
                {r.phone ? ` · ${r.phone}` : ""} · {r.createdAt.toLocaleString("pl-PL")}
              </p>
              {r.sourcePage ? (
                <p className="mt-1 text-xs text-slate-400">Źródło: {r.sourcePage}</p>
              ) : null}
              <p className="mt-3 whitespace-pre-wrap text-sm text-slate-800">{r.message}</p>
              <ContactInquiryRowActions id={r.id} current={r.status} />
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
