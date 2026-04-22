import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/auth/session";
import { orderStatusPl } from "@/lib/mail/order-notify";
import { CreateOrderForm } from "@/components/client/create-order-form";
import { redirect } from "next/navigation";
import { createOrderForClientAction } from "@/app/actions/orders";

export const dynamic = "force-dynamic";

function fmt(n: number) {
  return (n / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

export default async function ZamowieniaPage() {
  const s = await getClientSession();
  if (!s) {
    redirect("/logowanie?k=client");
  }
  const [orders, packs] = await Promise.all([
    prisma.order.findMany({
      where: { userId: s.user.id },
      orderBy: { createdAt: "desc" },
      include: { package: true },
    }),
    prisma.package.findMany({ where: { isPublished: true }, orderBy: { sortOrder: "asc" } }),
  ]);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="font-sans text-lg font-semibold">Moje zamówienia</h2>
      <p className="text-sm text-[#4A4A4A]">Status, wiadomości, przebieg — w jednym miejscu (MVP).</p>
      {packs.length > 0 ? (
        <div className="mt-6 rounded-lg border border-[#D0C8BE] bg-white/80 p-4">
          <h3 className="text-sm font-medium">Nowe zamówienie (krok wstępny)</h3>
          <p className="mt-0.5 text-xs text-[#4A4A4A]">Płatności podłączymy w kolejnej wersji — na start zapisz intencję + szczegóły w JSON poniżej (domyślnie {}).</p>
          <div className="mt-2">
            <CreateOrderForm action={createOrderForClientAction} packages={packs.map((p) => ({ id: p.id, name: p.name, priceCents: p.priceCents }))} />
          </div>
        </div>
      ) : null}
      {orders.length === 0 ? (
        <p className="mt-4 text-sm text-[#4A4A4A]">Jeszcze brak zapisanych projektów.</p>
      ) : (
        <ul className="mt-4 divide-y divide-[#D0C8BE]/50 rounded-md border border-[#D0C8BE] bg-white/60">
          {orders.map((o) => (
            <li key={o.id} className="p-3">
              <Link
                className="font-medium text-[#2B1B0A] hover:underline"
                href={`/dashboard/zamowienia/${o.id}`}
              >
                {o.package.name} — {orderStatusPl(o.status)}
              </Link>
              <p className="text-xs text-[#4A4A4A]">
                {fmt(o.totalCents)} · {o.createdAt.toLocaleString("pl-PL")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
