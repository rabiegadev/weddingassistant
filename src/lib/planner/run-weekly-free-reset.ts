import { PlanTier, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { ensureClientProfile } from "@/lib/client-profile/ensure";
import { resetPlannerDataForFreeUser } from "@/lib/planner/reset-free-tier";

/**
 * Dla wszystkich kont CLIENT bez aktywnej płatnej subskrypcji (tier != FREE)
 * czyści dane planera. Konto pozostaje — zgodnie z polityką planu darmowego.
 */
export async function runWeeklyFreePlannerResetAll(): Promise<{ resetCount: number }> {
  const now = new Date();
  const clients = await prisma.user.findMany({
    where: { role: UserRole.CLIENT },
    select: { id: true },
  });
  let resetCount = 0;
  for (const c of clients) {
    const active = await prisma.userSubscription.findFirst({
      where: { userId: c.id, endsAt: { gt: now } },
      include: { package: true },
    });
    const hasPaid = active && active.package.planTier !== PlanTier.FREE;
    if (hasPaid) {
      continue;
    }
    await ensureClientProfile(c.id);
    await resetPlannerDataForFreeUser(c.id);
    resetCount += 1;
  }
  return { resetCount };
}
