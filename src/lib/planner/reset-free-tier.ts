import { prisma } from "@/lib/db";

/**
 * Usuwa dane planera przypisane do konta (goście, budżet) i ustawia znacznik resetu.
 * Wywoływane dla kont na planie darmowym (cron tygodniowy).
 */
export async function resetPlannerDataForFreeUser(userId: string): Promise<void> {
  const now = new Date();
  await prisma.$transaction([
    prisma.plannerGuest.deleteMany({ where: { userId } }),
    prisma.plannerBudgetLine.deleteMany({ where: { userId } }),
    prisma.clientProfile.update({
      where: { userId },
      data: { lastFreePlannerResetAt: now },
    }),
  ]);
}
