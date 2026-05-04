import { PlanTier, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { ClientEntitlements } from "@/lib/entitlements/types";

const FREE_MAX_GUESTS = 25;
const FREE_MAX_TABLES = 3;

function tierLabelPl(tier: PlanTier): string {
  const m: Record<PlanTier, string> = {
    FREE: "Darmowy",
    ASSIST_BASIC: "Asystent podstawowy",
    WWW_TEMPLATE: "Wizytówka WWW (szablon)",
    ASSIST_BASIC_WWW_TEMPLATE: "Asystent podstawowy + wizytówka (szablon)",
    ASSIST_PREMIUM_WWW_TEMPLATE: "Asystent premium + wizytówka (szablon)",
    ASSIST_PREMIUM_WWW_CUSTOM: "Asystent premium + wizytówka (projekt indywidualny)",
  };
  return m[tier] ?? tier;
}

type FeaturesShape = {
  gallery?: boolean;
  guestGallery?: boolean;
  weddingPage?: boolean;
  qr?: boolean | string;
  maxGuests?: number;
  maxTables?: number;
};

function parseFeaturesJson(raw: string): FeaturesShape {
  try {
    const v = JSON.parse(raw) as unknown;
    if (v && typeof v === "object" && !Array.isArray(v)) {
      return v as FeaturesShape;
    }
  } catch {
    /* ignore */
  }
  return {};
}

function qrLevelFromFeatures(f: FeaturesShape, tier: PlanTier): ClientEntitlements["qr"] {
  if (tier === PlanTier.FREE) {
    return "limited";
  }
  if (f.qr === "limited") {
    return "limited";
  }
  if (f.qr === false) {
    return "none";
  }
  return "full";
}

/**
 * Zwraca efektywny tier i limity dla konta CLIENT.
 */
export async function getClientEntitlements(userId: string): Promise<ClientEntitlements | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (!user || user.role !== UserRole.CLIENT) {
    return null;
  }

  const now = new Date();
  const activeSub = await prisma.userSubscription.findFirst({
    where: { userId, endsAt: { gt: now } },
    orderBy: { endsAt: "desc" },
    include: { package: true },
  });

  if (activeSub && activeSub.package.planTier !== PlanTier.FREE) {
    const f = parseFeaturesJson(activeSub.package.featuresJson);
    const maxGuests = typeof f.maxGuests === "number" ? f.maxGuests : 10_000;
    const maxTables = typeof f.maxTables === "number" ? f.maxTables : 500;
    const galleryEnabled = Boolean(f.gallery ?? f.guestGallery);
    const weddingPageEnabled = Boolean(f.weddingPage);
    return {
      tier: activeSub.package.planTier,
      labelPl: tierLabelPl(activeSub.package.planTier),
      hasActivePaidSubscription: true,
      subscriptionEndsAt: activeSub.endsAt,
      maxGuests,
      maxTables,
      qr: qrLevelFromFeatures(f, activeSub.package.planTier),
      galleryEnabled,
      weddingPageEnabled,
    };
  }

  return {
    tier: PlanTier.FREE,
    labelPl: tierLabelPl(PlanTier.FREE),
    hasActivePaidSubscription: false,
    subscriptionEndsAt: null,
    maxGuests: FREE_MAX_GUESTS,
    maxTables: FREE_MAX_TABLES,
    qr: "limited",
    galleryEnabled: false,
    weddingPageEnabled: false,
  };
}
