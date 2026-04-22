import { prisma } from "@/lib/db";
import Link from "next/link";

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

function formatCents(n: number): string {
  return (n / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

export default async function CennikPage() {
  const packs = await prisma.package.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
  });
  return (
    <div className="min-h-0 border-b border-[#E8DCC4]/60 bg-white">
      <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-serif text-2xl font-semibold text-[#2B2B2B] sm:text-3xl">Cennik (oferta)</h1>
        <p className="mt-2 text-sm text-[#4A4A4A] sm:text-base">
          Pakiety konfigurowalne w panelu obsługi. Ta strona ładuje tę samą tabelę co wybór u klienta.
        </p>
        {packs.length === 0 ? (
          <p className="mt-8 text-sm text-[#6A6A6A]">Jeszcze opublikowano żadnych pakietów. Przejdź do /admin (po 2FA).</p>
        ) : (
          <ul className="mt-8 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packs.map((p) => {
              const feats = parseFeatures(p.featuresJson);
              return (
                <li
                  key={p.id}
                  className="flex flex-col rounded-2xl border border-[#E6D4B0]/50 bg-gradient-to-b from-white to-[#FDF8F0] p-5 shadow-sm"
                >
                  <h2 className="font-serif text-lg font-semibold text-[#2B2B2B]">{p.name}</h2>
                  <p className="mt-2 text-2xl font-semibold text-[#6B5427]">{formatCents(p.priceCents)}</p>
                  <p className="mt-2 line-clamp-4 text-sm text-[#4A4A4A]">{p.description}</p>
                  {feats.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-0.5 pl-4 text-sm text-[#2B2B2B]">
                      {feats.map((f) => (
                        <li key={f.label}>{f.label}</li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-auto flex flex-1 flex-col justify-end pt-4">
                    <Link
                      className="inline-block w-full rounded-md border border-[#B8955C] py-2 text-center text-sm font-medium text-[#2B2B2B] transition hover:bg-white"
                      href="/rejestracja"
                    >
                      Utwórz konto, aby złożyć zamówienie
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
