import Link from "next/link";
import { PlanTier } from "@prisma/client";
import { prisma } from "@/lib/db";
import { HomeOfferSectionClient } from "@/components/marketing/home-offer-section.client";
import type { OfferPackageVm } from "@/components/marketing/offer-packages-types";

const PREVIEW_SRC: Record<PlanTier, string> = {
  FREE: "/images/funcimg/bg5.jpg",
  ASSIST_BASIC: "/images/funcimg/bg6.jpg",
  WWW_TEMPLATE: "/images/funcimg/bg4.jpg",
  ASSIST_BASIC_WWW_TEMPLATE: "/images/funcimg/bg3.jpg",
  ASSIST_PREMIUM_WWW_TEMPLATE: "/images/funcimg/bg2.jpg",
  ASSIST_PREMIUM_WWW_CUSTOM: "/images/funcimg/bg6.jpg",
};

function tierSubtitle(tier: PlanTier): string {
  const m: Record<PlanTier, string> = {
    FREE: "Podstawowe funkcje — start dla każdej pary",
    ASSIST_BASIC: "Asystent planowania dla spokojnych przygotowań",
    WWW_TEMPLATE: "Wasza wizytówka od szczęśliwego pierwszego tak",
    ASSIST_BASIC_WWW_TEMPLATE: "Asystent i strona z szablonu w zestawie",
    ASSIST_PREMIUM_WWW_TEMPLATE: "Rozbudowany pakiet z elegancką wizytówką",
    ASSIST_PREMIUM_WWW_CUSTOM: "Indywidualna oprawa opracowana dla Was",
  };
  return m[tier];
}

function packageHighlights(tier: PlanTier): readonly string[] {
  switch (tier) {
    case PlanTier.FREE:
      return [
        "lista gości (limit jak w pakiecie)",
        "podstawowy planer przygotowań",
        "spokojne tempo — idealny start",
      ];
    case PlanTier.ASSIST_BASIC:
      return [
        "moduły asystenta i wyższe limity niż FREE",
        "checklisty, harmonogram, przypomnienia",
        "dostęp po dacie ślubu — wg ustawień pakietu",
      ];
    case PlanTier.WWW_TEMPLATE:
      return ["wizytówka na podstawie szablonu", "domena i publikacja strony", "RSVP oraz kluczowe informacje dla gości"];
    case PlanTier.ASSIST_BASIC_WWW_TEMPLATE:
      return [
        "wszystkie atuty pakietu asystenta",
        "strona ślubna wybrana z kolekcji motywów",
        "jeden spójny panel od inspiracji po RSVP",
      ];
    case PlanTier.ASSIST_PREMIUM_WWW_CUSTOM:
      return [
        "najwyższe widełki funkcji planera",
        "indywidualny wygląd wizytówki pod Was",
        "brief i poprawki w ramach realizacji",
      ];
    case PlanTier.ASSIST_PREMIUM_WWW_TEMPLATE:
      return ["rozszerzony zestaw przygotowany na duże przyjęcia", "wizytówka premium z szablonu", "płynniejszy kontakt przy najważniejszych momentach"];
    default:
      return [];
  }
}

function previewSrcOrFallback(tier: PlanTier, index: number): string {
  const base = PREVIEW_SRC[tier] ?? `/images/funcimg/bg${(index % 4) + 2}.jpg`;
  return base;
}

function pickCta(i: number, tier: PlanTier): OfferPackageVm["ctaLabel"] {
  if (tier === PlanTier.ASSIST_PREMIUM_WWW_CUSTOM) return "Porozmawiajmy";
  if (i % 2 === 0) return "Zobacz szczegóły";
  return "Poznaj pakiet";
}

export async function HomeOfferSection() {
  const packages = await prisma.package.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    take: 5,
  });

  if (packages.length === 0) {
    return (
      <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-[#7d746d] sm:text-base">
        Cennik jest w przygotowaniu.{" "}
        <Link className="font-semibold text-[#8a6f45] underline underline-offset-4 hover:text-[#2b2118]" href="/cennik">
          Zajrzyj na stronę cennika
        </Link>{" "}
        — wkrótce pakiety pojawią się i tutaj.
      </p>
    );
  }

  const midpoint = Math.floor(packages.length / 2);

  const vm: OfferPackageVm[] = packages.map((p, idx) => ({
    id: p.id,
    slug: p.slug,
    planTier: p.planTier,
    name: p.name,
    subtitle: tierSubtitle(p.planTier),
    priceCents: p.priceCents,
    highlights: packageHighlights(p.planTier),
    previewSrc: previewSrcOrFallback(p.planTier, idx),
    featured: idx === midpoint,
    ctaLabel: pickCta(idx, p.planTier),
  }));

  return <HomeOfferSectionClient packages={vm} />;
}
