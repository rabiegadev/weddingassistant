import Link from "next/link";
import { PlanTier } from "@prisma/client";
import { prisma } from "@/lib/db";

function formatPln(cents: number) {
  return (cents / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

export async function HomeOfferSection() {
  const packages = await prisma.package.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    take: 5,
  });
  if (packages.length === 0) {
    return (
      <p className="mt-2 text-sm text-[#4A4A4A] sm:text-base">
        Cennik jest w przygotowaniu.{" "}
        <Link className="font-medium text-[#6B5427] underline" href="/cennik">
          Zobacz stronę cennika
        </Link>{" "}
        — wkrótce pakiety pojawią się i tutaj.
      </p>
    );
  }

  const tierMeta: Record<PlanTier, { accent: string; ring: string; glow: string }> = {
    FREE: {
      accent: "from-[#f8f3eb] to-[#fefcf8]",
      ring: "ring-[#dcc8ab]/70",
      glow: "bg-[#ceb184]/20",
    },
    ASSIST_BASIC: {
      accent: "from-[#f4ecdf] to-[#fcf8f0]",
      ring: "ring-[#d8c09b]/70",
      glow: "bg-[#b8955c]/20",
    },
    WWW_TEMPLATE: {
      accent: "from-[#efe3d1] to-[#f9f2e8]",
      ring: "ring-[#d5b992]/70",
      glow: "bg-[#a9743a]/20",
    },
    ASSIST_BASIC_WWW_TEMPLATE: {
      accent: "from-[#eadcca] to-[#f6efe5]",
      ring: "ring-[#cfb089]/70",
      glow: "bg-[#8f5f2b]/20",
    },
    ASSIST_PREMIUM_WWW_TEMPLATE: {
      accent: "from-[#e9ddcf] to-[#f5eee4]",
      ring: "ring-[#cda67a]/70",
      glow: "bg-[#845225]/20",
    },
    ASSIST_PREMIUM_WWW_CUSTOM: {
      accent: "from-[#e5d3bc] to-[#f2e9dd]",
      ring: "ring-[#c79f6d]/70",
      glow: "bg-[#7a4a1f]/20",
    },
  };

  const packageHighlights = (tier: PlanTier): string[] => {
    switch (tier) {
      case PlanTier.FREE:
        return [
          "lista gości do 25 osób",
          "podstawowe moduły planera",
          "tygodniowy reset danych w planie darmowym",
        ];
      case PlanTier.ASSIST_BASIC:
        return [
          "większość narzędzi asystenta",
          "wyższe limity niż w pakiecie darmowym",
          "dostęp do 6 miesięcy po dacie ślubu",
        ];
      case PlanTier.WWW_TEMPLATE:
        return [
          "wizytówka weselna na gotowym szablonie",
          "domena i publikacja strony",
          "podstawowe RSVP dla gości",
        ];
      case PlanTier.ASSIST_BASIC_WWW_TEMPLATE:
        return [
          "pakiet asystenta + wizytówka z szablonu",
          "wybór motywu strony przy zamówieniu",
          "dostęp do 6 miesięcy po ślubie",
        ];
      case PlanTier.ASSIST_PREMIUM_WWW_CUSTOM:
        return [
          "asystent z najwyższymi limitami",
          "indywidualny projekt wizytówki",
          "brief, inspiracje i poprawki w ramach realizacji",
        ];
      case PlanTier.ASSIST_PREMIUM_WWW_TEMPLATE:
        return ["szablon premium", "rozszerzone RSVP", "dostęp po ślubie"];
      default:
        return [];
    }
  };

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-5">
        {packages.map((p, i) => {
          const meta = tierMeta[p.planTier];
          const highlights = packageHighlights(p.planTier);
          return (
            <article
              key={p.id}
              className={`group animate-wa-offer-card-in relative flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-[#d9c5a5]/70 bg-gradient-to-b ${meta.accent} p-5 shadow-[0_14px_30px_-20px_rgba(62,44,18,0.65)] ring-1 ring-inset ${meta.ring} transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_38px_-22px_rgba(62,44,18,0.72)]`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className={`absolute -right-7 -top-7 h-24 w-24 rounded-full ${meta.glow} blur-2xl transition group-hover:scale-105`} />
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#7f6a4c]">Plan {i + 1}</p>
              <h3 className="mt-2 min-h-16 font-wa-display text-lg font-semibold leading-snug text-[#2B2B2B]">{p.name}</h3>
              <div className="my-3 h-px bg-gradient-to-r from-[#cdb089]/80 via-[#e4d3bc]/80 to-transparent" />
              <p className="text-sm leading-relaxed text-[#4A4A4A]">{p.description}</p>
              <ul className="mt-4 flex-1 space-y-1.5 text-sm text-[#3e362d]">
                {highlights.map((line) => (
                  <li key={line} className="leading-relaxed">
                    - {line}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-wa-display text-3xl font-semibold text-[#6B5427]">{formatPln(p.priceCents)}</p>
              <Link
                className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-[#B8955C] bg-white/90 py-2.5 text-sm font-semibold text-[#2B2B2B] transition hover:bg-[#B8955C] hover:text-white"
                href="/cennik"
              >
                Szczegóły pakietu
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
