import type { PlanTier } from "@prisma/client";

export type QrAccessLevel = "none" | "limited" | "full";

export type ClientEntitlements = {
  tier: PlanTier;
  labelPl: string;
  /** Aktywna subskrypcja płatna (data końca w przyszłości). */
  hasActivePaidSubscription: boolean;
  subscriptionEndsAt: Date | null;
  maxGuests: number;
  maxTables: number;
  qr: QrAccessLevel;
  galleryEnabled: boolean;
  /** Moduł strony weselnej (konfigurator) wg pakietu / featuresJson. */
  weddingPageEnabled: boolean;
};
