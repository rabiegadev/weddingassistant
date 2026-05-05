import { prisma } from "@/lib/db";
import { CennikRegisterButton } from "@/components/marketing/cennik-register-button";

export const dynamic = "force-dynamic";

function parseFeatures(f: string): { label: string; on: boolean }[] {
  try {
    const j = JSON.parse(f) as Record<string, boolean | string> | string[];
    if (Array.isArray(j)) {
      return j.map((k) => ({ label: String(k), on: true }));
    }
    return Object.entries(j)
      .filter(([, v]) => Boolean(v))
      .map(([k, v]) => ({ label: k, on: Boolean(v) }));
  } catch {
    return [];
  }
}

function featureLabelPl(raw: string): string {
  const map: Record<string, string> = {
    maxGuests: "Limit gości wg pakietu",
    maxTables: "Limit stołów wg pakietu",
    qr: "QR dla gości",
    gallery: "Galeria",
    weddingPage: "Strona weselna",
    rsvp: "RSVP",
    requiresTemplateId: "Wybór szablonu",
    fulfillmentType: "Tryb realizacji",
    revisionsMajorMax: "Duże poprawki w cenie",
    revisionsMinorFree: "Drobne poprawki bez dopłat",
  };
  return map[raw] ?? raw;
}

function formatCents(n: number): string {
  return (n / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

export default async function CennikPage() {
  const packs = await prisma.package.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <main className="border-b border-[#dcc9ab]/70 bg-[#f2e8da]">
      <div className="mx-auto w-full max-w-6xl px-4 py-8 pb-20 sm:px-6 sm:py-10 sm:pb-24">
        <h1 className="font-wa-display text-balance text-2xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-3xl">
          Cennik
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-[#4A4A4A] sm:text-base">
          Pakiety ustawiane w panelu obsługi — ta strona pokazuje aktualnie opublikowane oferty (tę samą listę, z której
          korzystają pary przy zamówieniu).
        </p>
        {packs.length === 0 ? (
          <p className="mt-6 rounded-xl border border-[#ece6dc] bg-[#fdfcfa] px-4 py-3 text-sm text-[#6A6A6A]">
            Jeszcze nie opublikowano żadnych pakietów. Po dodaniu ich w panelu administracyjnym pojawią się tutaj
            automatycznie.
          </p>
        ) : (
          <ul className="mt-6 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {packs.map((p) => {
              const feats = parseFeatures(p.featuresJson);
              return (
                <li
                  key={p.id}
                  className="group flex flex-col rounded-2xl border border-[#d6c1a1]/75 bg-gradient-to-b from-[#fffdf9] to-[#f8f0e5] p-5 shadow-[0_12px_28px_-22px_rgba(62,44,18,0.82)] transition hover:-translate-y-1 hover:shadow-[0_22px_38px_-22px_rgba(62,44,18,0.82)]"
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7f6a4c]">Oferta</p>
                  <h2 className="font-wa-display text-lg font-semibold text-[#2E2A26]">{p.name}</h2>
                  <div className="my-3 h-px bg-gradient-to-r from-[#ccb08b]/80 via-[#e5d5bf]/80 to-transparent" />
                  <p className="mt-2 font-wa-display text-2xl font-semibold text-[#6B5427]">{formatCents(p.priceCents)}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#4A4A4A]">{p.description}</p>
                  {feats.length > 0 ? (
                    <ul className="mt-3 space-y-1.5 text-sm text-[#2B2B2B]">
                      {feats.map((f) => (
                        <li key={f.label}>- {featureLabelPl(f.label)}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-auto flex flex-1 flex-col justify-end pt-4">
                    <CennikRegisterButton />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
