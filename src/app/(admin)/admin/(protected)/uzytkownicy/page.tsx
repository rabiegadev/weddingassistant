import Link from "next/link";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminUzytkownicyPage() {
  const a = await getFullAdminSession();
  if (!a) {
    return null;
  }
  const [clients, admins] = await Promise.all([
    prisma.user.findMany({
      where: { role: UserRole.CLIENT },
      orderBy: { createdAt: "desc" },
      take: 500,
      include: {
        clientProfile: true,
        subscriptions: { where: { endsAt: { gt: new Date() } }, take: 1 },
      },
    }),
    prisma.user.count({ where: { role: UserRole.ADMIN } }),
  ]);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="text-xl font-semibold text-slate-900">Pary (konta CLIENT)</h2>
      <p className="mt-1 text-sm text-slate-600">
        Kont adminów w systemie: <span className="font-medium">{admins}</span> (nie edytujemy tutaj).
      </p>
      {clients.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Brak kont pary.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200/80 bg-white shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100/90 text-slate-700">
              <tr>
                <th className="px-4 py-3 font-medium">E-mail</th>
                <th className="px-4 py-3 font-medium">Imię</th>
                <th className="px-4 py-3 font-medium">Aktywny plan</th>
                <th className="px-4 py-3 font-medium">Data ślubu</th>
                <th className="px-4 py-3 font-medium">Rejestracja</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {clients.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/80">
                  <td className="px-4 py-2.5 font-mono text-xs text-slate-800">{u.email}</td>
                  <td className="px-4 py-2.5 text-slate-700">{u.name ?? "—"}</td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {u.subscriptions[0] ? (
                      <span className="text-emerald-800">do {u.subscriptions[0].endsAt.toLocaleDateString("pl-PL")}</span>
                    ) : (
                      <span className="text-slate-400">brak aktywnej</span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-slate-600">
                    {u.clientProfile?.weddingDate
                      ? u.clientProfile.weddingDate.toLocaleDateString("pl-PL")
                      : "—"}
                  </td>
                  <td className="px-4 py-2.5 text-xs text-slate-500">
                    {u.createdAt.toLocaleString("pl-PL")}
                  </td>
                  <td className="px-4 py-2.5">
                    <Link
                      className="font-medium text-amber-900 underline decoration-amber-700/40 hover:decoration-amber-700"
                      href={`/admin/uzytkownicy/${u.id}`}
                    >
                      Edytuj
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
