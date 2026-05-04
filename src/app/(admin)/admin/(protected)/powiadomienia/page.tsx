import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminPowiadomieniaPage() {
  const a = await getFullAdminSession();
  if (!a) {
    return null;
  }
  const rows = await prisma.notificationLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 250,
  });
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="text-xl font-semibold text-slate-900">Rejestr powiadomień</h2>
      <p className="mt-1 text-sm text-slate-600">
        Wpis powstaje po próbie wysłki e-maila (treść HTML jest minimalnie szablonowana).
      </p>
      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Brak wpisów.</p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="min-w-full text-left text-xs">
            <thead className="bg-slate-100/90 text-slate-700">
              <tr>
                <th className="px-3 py-2 font-medium">Czas</th>
                <th className="px-3 py-2 font-medium">Kanał</th>
                <th className="px-3 py-2 font-medium">Do</th>
                <th className="px-3 py-2 font-medium">Temat</th>
                <th className="px-3 py-2 font-medium">Zajawka</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={r.id} className="align-top text-slate-800">
                  <td className="px-3 py-2 whitespace-nowrap text-slate-500">
                    {r.createdAt.toLocaleString("pl-PL")}
                  </td>
                  <td className="px-3 py-2">{r.channel}</td>
                  <td className="px-3 py-2 font-mono">{r.toEmail ?? "—"}</td>
                  <td className="px-3 py-2 max-w-[14rem] truncate">{r.subject ?? "—"}</td>
                  <td className="px-3 py-2 max-w-xl text-slate-600">{r.bodyPreview ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
