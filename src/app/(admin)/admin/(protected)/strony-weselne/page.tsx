import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { CreateWeddingRequestForm, EditWeddingRequestForm } from "@/components/admin/wedding-request-forms";

export const dynamic = "force-dynamic";

export default async function AdminStronyWeselnePage() {
  const a = await getFullAdminSession();
  if (!a) {
    return null;
  }
  const rows = await prisma.weddingPageRequest.findMany({
    orderBy: { updatedAt: "desc" },
    take: 200,
    include: { user: { select: { email: true } } },
  });
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="text-xl font-semibold text-slate-900">Zgłoszenia strony weselnej</h2>
      <p className="mt-1 text-sm text-slate-600">
        Workflow operacyjny (MVP): tworzenie zgłoszenia po e-mailu użytkownika, zmiana statusu i notatki.
      </p>

      <div className="mt-6">
        <CreateWeddingRequestForm />
      </div>

      {rows.length === 0 ? (
        <p className="mt-6 text-sm text-slate-500">Brak zgłoszeń.</p>
      ) : (
        <ul className="mt-8 space-y-6">
          {rows.map((r) => (
            <li key={r.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs text-slate-400">
                ID {r.id} · utworzono {r.createdAt.toLocaleString("pl-PL")}
              </p>
              <EditWeddingRequestForm
                id={r.id}
                userEmail={r.user.email}
                currentStatus={r.status}
                internalNote={r.internalNote}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
