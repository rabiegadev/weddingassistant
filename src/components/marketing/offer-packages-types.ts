import type { PlanTier } from "@prisma/client";

export type OfferPackageVm = {
  id: string;
  slug: string;
  planTier: PlanTier;
  name: string;
  subtitle: string;
  priceCents: number;
  highlights: readonly string[];
  previewSrc: string;
  featured: boolean;
  ctaLabel: "Zobacz szczegóły" | "Poznaj pakiet" | "Porozmawiajmy";
};
