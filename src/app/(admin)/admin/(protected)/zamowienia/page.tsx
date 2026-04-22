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
      <h2 className="text-lg text-zinc-200">Wszystkie zamówienia (ostatnie 200)</h2>
      {list.length === 0 ? <p className="mt-2 text-sm text-amber-100/50">Pusto.</p> : null}
      <ul className="mt-4 divide-y divide-amber-900/20 rounded border border-amber-900/30">
        {list.map((o) => (
          <li key={o.id} className="p-3 sm:flex sm:items-baseline sm:justify-between sm:gap-2">
            <div>
              <Link className="font-medium text-amber-200/90 hover:underline" href={`/admin/zamowienia/${o.id}`}>
                {o.package.name}
              </Link>
              <p className="text-xs text-zinc-500">{o.user.email}</p>
            </div>
            <p className="shrink-0 text-sm text-amber-100/70">
              {orderStatusPl(o.status)} · {fmt(o.totalCents)} · {o.createdAt.toLocaleString("pl-PL")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
