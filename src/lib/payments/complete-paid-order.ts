import { OrderStatus, PaymentStatus, PaymentProvider } from "@prisma/client";
import { prisma } from "@/lib/db";
import { notifyClientOnOrderUpdate, orderStatusPl } from "@/lib/mail/order-notify";
import { activateSubscriptionFromPaidOrder } from "@/lib/subscriptions/activate-from-order";

/**
 * Po potwierdzeniu płatności u operatora: zamówienie opłacone, subskrypcja, e-mail.
 * Idempotentne — jeśli płatność już COMPLETED, nic nie robi.
 */
export async function completeOrderAfterVerifiedPayment(args: {
  orderId: string;
  provider: PaymentProvider;
  rawNotifyJson: string;
  /** Kwota z notyfikacji operatora (grosze) — musi się zgadzać z zamówieniem. */
  amountCents: number;
}): Promise<{ alreadyDone: boolean }> {
  const order = await prisma.order.findUnique({
    where: { id: args.orderId },
    include: { package: true, payment: true },
  });
  if (!order) {
    throw new Error("Brak zamówienia.");
  }
  if (args.amountCents !== order.totalCents) {
    throw new Error("Kwota płatności nie zgadza się z zamówieniem.");
  }
  if (order.payment?.status === PaymentStatus.COMPLETED) {
    return { alreadyDone: true };
  }

  const fromStatus = order.status;
  const becameApproved = order.status !== OrderStatus.APPROVED;
  await prisma.$transaction(async (tx) => {
    await tx.payment.upsert({
      where: { orderId: args.orderId },
      create: {
        orderId: args.orderId,
        provider: args.provider,
        status: PaymentStatus.COMPLETED,
        amountCents: order.totalCents,
        currency: "PLN",
        rawNotifyJson: args.rawNotifyJson,
      },
      update: {
        status: PaymentStatus.COMPLETED,
        provider: args.provider,
        rawNotifyJson: args.rawNotifyJson,
      },
    });
    if (becameApproved) {
      await tx.order.update({
        where: { id: args.orderId },
        data: { status: OrderStatus.APPROVED },
      });
      await tx.orderEvent.create({
        data: {
          orderId: args.orderId,
          fromStatus,
          toStatus: OrderStatus.APPROVED,
          message: "Płatność potwierdzona przez operatora.",
        },
      });
    }
  });

  await activateSubscriptionFromPaidOrder(args.orderId);

  const statusNote = becameApproved
    ? `Status: ${orderStatusPl(fromStatus)} → ${orderStatusPl(OrderStatus.APPROVED)}`
    : "Płatność zaksięgowana (zamówienie było już zatwierdzone ręcznie).";
  await notifyClientOnOrderUpdate(
    order.userId,
    args.orderId,
    order.package.name,
    `Płatność zaksięgowana — ${order.package.name}`,
    statusNote
  );

  return { alreadyDone: false };
}
