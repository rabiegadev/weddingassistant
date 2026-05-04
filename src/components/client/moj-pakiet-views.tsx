import Link from "next/link";
import { prisma } from "@/lib/db";
import { getClientEntitlements } from "@/lib/entitlements/resolve";

function fmt(n: number) {
  return (n / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

export async function MojPakietView({ userId }: { userId: string }) {
  const [ent, subs, orders] = await Promise.all([
    getClientEntitlements(userId),
    prisma.userSubscription.findMany({
      where: { userId },
      orderBy: { endsAt: "desc" },
      include: { package: true },
      take: 20,
    }),
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { package: true },
    }),
  ]);
  if (!ent) {
    return <p className="text-sm text-rose-700">Nie udało się odczytać planu.</p>;
  }
  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-5 shadow-[0_8px_20px_rgba(56,72,120,0.08)]">
        <h1 className="text-lg font-semibold text-[var(--wa-dash-navy)]">Mój pakiet</h1>
        <p className="mt-2 text-sm text-[var(--wa-dash-muted)]">
          <span className="font-medium text-[var(--wa-dash-navy)]">{ent.labelPl}</span>
          {ent.subscriptionEndsAt ? (
            <> — dostęp do {ent.subscriptionEndsAt.toLocaleString("pl-PL")}</>
          ) : (
            <> — brak aktywnej subskrypcji płatnej</>
          )}
        </p>
        <ul className="mt-3 list-inside list-disc text-sm text-[var(--wa-dash-muted)]">
          <li>Goście (limit): {ent.maxGuests}</li>
          <li>Stoły (limit): {ent.maxTables}</li>
          <li>QR: {ent.qr === "full" ? "pełny" : ent.qr === "limited" ? "ograniczony" : "wyłączony"}</li>
          <li>Galeria: {ent.galleryEnabled ? "tak" : "nie"}</li>
          <li>Strona WWW: {ent.weddingPageEnabled ? "tak" : "nie"}</li>
        </ul>
      </section>

      <section className="rounded-xl border border-[var(--wa-dash-border)] bg-[#f7f9ff] p-5">
        <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Aktywne / ostatnie subskrypcje</h2>
        {subs.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--wa-dash-muted)]">Brak wpisów — po zakupie pakietu pojawi się tutaj.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {subs.map((s) => (
              <li key={s.id} className="rounded-lg border border-[var(--wa-dash-border)] bg-white px-3 py-2">
                <span className="font-medium text-[var(--wa-dash-navy)]">{s.package.name}</span>
                <span className="text-[var(--wa-dash-muted)]">
                  {" "}
                  → do {s.endsAt.toLocaleString("pl-PL")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-5 shadow-[0_8px_20px_rgba(56,72,120,0.08)]">
        <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Ostatnie zamówienia</h2>
        {orders.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--wa-dash-muted)]">Brak zamówień.</p>
        ) : (
          <ul className="mt-2 space-y-2 text-sm">
            {orders.map((o) => (
              <li key={o.id}>
                <Link className="font-medium text-[#6B5427] underline" href={`/dashboard/zamowienia/${o.id}`}>
                  {o.package.name}
                </Link>
                <span className="text-[var(--wa-dash-muted)]">
                  {" "}
                  · {fmt(o.totalCents)} · {o.createdAt.toLocaleDateString("pl-PL")}
                </span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-sm">
          <Link className="font-medium text-[#6B5427] underline" href="/dashboard/zamowienia">
            Wszystkie zamówienia
          </Link>
        </p>
      </section>
    </div>
  );
}

export async function WszystkiePakietyView() {
  const packs = await prisma.package.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <div className="space-y-4">
      <header className="rounded-xl border border-[var(--wa-dash-border)] bg-[#f7f9ff] p-5">
        <h1 className="text-lg font-semibold text-[var(--wa-dash-navy)]">Wszystkie pakiety</h1>
        <p className="mt-1 text-sm text-[var(--wa-dash-muted)]">
          Porównanie ofert z katalogu — te same ceny co na{" "}
          <Link className="font-medium text-[#6B5427] underline" href="/cennik">
            stronie cennika
          </Link>
          .
        </p>
      </header>
      <ul className="grid gap-4 md:grid-cols-2">
        {packs.map((p) => (
          <li
            key={p.id}
            className="flex flex-col rounded-xl border border-[var(--wa-dash-border)] bg-white p-5 shadow-[0_8px_20px_rgba(56,72,120,0.06)]"
          >
            <h2 className="text-base font-semibold text-[var(--wa-dash-navy)]">{p.name}</h2>
            <p className="mt-2 text-2xl font-semibold text-[var(--wa-dash-navy)]">{fmt(p.priceCents)}</p>
            <p className="mt-3 flex-1 whitespace-pre-wrap text-sm text-[var(--wa-dash-muted)]">{p.description}</p>
            <div className="mt-4">
              <Link
                className="inline-flex rounded-lg bg-[#B8955C] px-4 py-2 text-sm font-medium text-white hover:brightness-105"
                href="/dashboard/zamowienia"
              >
                Zamów w panelu
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
