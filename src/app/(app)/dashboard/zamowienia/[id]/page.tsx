import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getClientSession } from "@/lib/auth/session";
import { orderStatusPl } from "@/lib/mail/order-notify";
import { OrderMessageForm } from "@/components/shared/order-message-form";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ id: string }> };

export default async function ZamowienieClientPage({ params }: P) {
  const s = await getClientSession();
  if (!s) {
    redirect("/logowanie?k=client");
  }
  const { id } = await params;
  const o = await prisma.order.findFirst({
    where: { id, userId: s.user.id },
    include: { package: true, messages: { include: { author: { select: { email: true, name: true } } }, orderBy: { createdAt: "asc" } } },
  });
  if (!o) {
    notFound();
  }
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="text-sm">
        <Link className="text-[#4A2A0A] underline" href="/dashboard/zamowienia">
          ← Moje zamówienia
        </Link>
      </p>
      <h2 className="mt-2 font-sans text-lg font-semibold">{o.package.name}</h2>
      <p className="text-sm text-[#4A4A4A]">Status: {orderStatusPl(o.status)}</p>
      <p className="text-xs text-[#5A5A5A]">Utworzono: {o.createdAt.toLocaleString("pl-PL")}</p>
      <section className="mt-6">
        <h3 className="text-sm font-medium">Wiadomości</h3>
        <ul className="mt-2 max-h-80 space-y-2 overflow-y-auto rounded border border-[#C0B0A0] bg-white/80 p-2 text-sm">
          {o.messages.map((m) => (
            <li
              key={m.id}
              className={m.isFromAdmin ? "border-l-2 border-[#8B6914] pl-2" : "border-l-2 border-[#3A3A3A] pl-2"}
            >
              <span className="text-xs text-[#4A4A4A]">
                {m.isFromAdmin ? "Obsługa" : "Ty"} · {m.createdAt.toLocaleString("pl-PL")}
              </span>
              <p className="whitespace-pre-wrap text-[#1A1A1A]">{m.body}</p>
            </li>
          ))}
        </ul>
        <div className="mt-3">
          <OrderMessageForm orderId={o.id} isFromAdmin={false} dark={false} />
        </div>
      </section>
    </div>
  );
}
