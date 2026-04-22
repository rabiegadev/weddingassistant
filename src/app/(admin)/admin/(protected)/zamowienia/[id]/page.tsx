import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { orderStatusPl } from "@/lib/mail/order-notify";
import { OrderMessageForm } from "@/components/shared/order-message-form";
import { AdminOrderStatusForm } from "@/components/admin/order-status-form";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ id: string }> };

function fmt(n: number) {
  return (n / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

export default async function AdminZamowieniePage({ params }: P) {
  const a = await getFullAdminSession();
  if (!a) {
    return null;
  }
  const { id } = await params;
  const o = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { email: true, name: true } },
      package: true,
      messages: {
        orderBy: { createdAt: "asc" },
        include: { author: { select: { email: true, name: true } } },
      },
      events: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!o) {
    notFound();
  }
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <p>
        <Link className="text-amber-300/80 text-sm underline" href="/admin/zamowienia">
          ← Lista
        </Link>
      </p>
      <h2 className="mt-1 font-sans text-lg text-zinc-200">{o.package.name}</h2>
      <p className="text-sm text-amber-100/70">Klient: {o.user.email} · {fmt(o.totalCents)}</p>
      <p className="text-xs text-zinc-500">Aktualny: {orderStatusPl(o.status)}</p>
      <section className="mt-6 max-w-2xl rounded border border-amber-900/30 p-3">
        <h3 className="text-sm font-medium text-amber-200/90">Zmień status</h3>
        <AdminOrderStatusForm orderId={o.id} current={o.status} />
      </section>
      <section className="mt-6">
        <h3 className="text-sm text-amber-200/80">Historia statusów</h3>
        <ol className="mt-1 list-decimal pl-4 text-sm text-amber-100/60">
          {o.events.map((e) => (
            <li key={e.id}>
              {e.createdAt.toLocaleString("pl-PL")} → {orderStatusPl(e.toStatus)}
              {e.message ? ` (${e.message})` : ""}
            </li>
          ))}
        </ol>
      </section>
      <section className="mt-6">
        <h3 className="text-sm text-amber-200/80">Wiadomości</h3>
        <ul className="mt-2 max-h-96 space-y-2 overflow-y-auto rounded border border-amber-900/30 p-2 text-sm">
          {o.messages.map((m) => (
            <li key={m.id} className="border-b border-amber-900/20 pb-1">
              <span className="text-xs text-amber-100/40">
                {m.isFromAdmin ? "Obsługa" : m.author.email} · {m.createdAt.toLocaleString("pl-PL")}
              </span>
              <p className="whitespace-pre-wrap text-amber-50/95">{m.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3 max-w-2xl">
          <OrderMessageForm orderId={o.id} isFromAdmin={true} dark={true} />
        </div>
      </section>
    </div>
  );
}
