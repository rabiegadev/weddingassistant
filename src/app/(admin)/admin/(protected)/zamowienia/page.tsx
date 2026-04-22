import Link from "next/link";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { orderStatusPl } from "@/lib/mail/order-notify";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return (n / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

export default async function AdminZamowieniaPage() {
  const a = await getFullAdminSession();
  if (!a) {
    return null;
  }
  const list = await prisma.order.findMany({
    orderBy: { updatedAt: "desc" },
    include: { user: { select: { email: true } }, package: true },
    take: 200,
  });
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="text-lg font-semibold text-slate-800">Wszystkie zamówienia (ostatnie 200)</h2>
      {list.length === 0 ? <p className="mt-2 text-sm text-slate-500">Pusto.</p> : null}
      <ul className="mt-4 divide-y divide-slate-200 rounded border border-slate-200 bg-white shadow-sm">
        {list.map((o) => (
          <li key={o.id} className="p-3 sm:flex sm:items-baseline sm:justify-between sm:gap-2">
            <div>
              <Link
                className="font-medium text-[#6B5427] hover:underline"
                href={`/admin/zamowienia/${o.id}`}
              >
                {o.package.name}
              </Link>
              <p className="text-xs text-slate-500">{o.user.email}</p>
            </div>
            <p className="shrink-0 text-sm text-slate-600">
              {orderStatusPl(o.status)} · {fmt(o.totalCents)} · {o.createdAt.toLocaleString("pl-PL")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
