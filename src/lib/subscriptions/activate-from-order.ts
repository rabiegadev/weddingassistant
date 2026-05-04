import { OrderStatus, PlanTier } from "@prisma/client";
import { prisma } from "@/lib/db";
import { computeSubscriptionEndsAt } from "@/lib/subscriptions/compute-ends-at";

/**
 * Po opłaceniu zamówienia: tworzy aktywną subskrypcję i przypina do zamówienia.
 * Idempotentne przy powtórnym wywołaniu (sprawdza istniejący rekord subskrypcji dla zamówienia).
 */
export async function activateSubscriptionFromPaidOrder(orderId: string): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      package: true,
      user: { include: { clientProfile: true } },
      subscription: true,
    },
  });
  if (!order) {
    return;
  }
  if (order.package.planTier === PlanTier.FREE) {
    return;
  }
  if (order.subscription) {
    return;
  }
  if (order.status !== OrderStatus.APPROVED) {
    return;
  }
  const weddingDate = order.user.clientProfile?.weddingDate ?? null;
  const endsAt = computeSubscriptionEndsAt({
    weddingDate,
    purchaseDate: order.createdAt,
    postWeddingAccessMonths: order.package.postWeddingAccessMonths,
  });
  await prisma.userSubscription.create({
    data: {
      userId: order.userId,
      packageId: order.packageId,
      sourceOrderId: order.id,
      endsAt,
    },
  });
}
