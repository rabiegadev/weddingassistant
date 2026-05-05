"use server";

import { OrderStatus, PaymentProvider, PaymentStatus, PlanTier } from "@prisma/client";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAppPublicUrl } from "@/lib/env/public";
import { getClientSession } from "@/lib/auth/session";
import { getPrzelewy24TrnBase, isPrzelewy24Configured } from "@/lib/payments/przelewy24/config";
import { registerPrzelewy24Transaction } from "@/lib/payments/przelewy24/register";

export type Przelewy24StartState = { error?: string };

/**
 * Rozpoczęcie płatności Przelewy24 — przekierowanie na bramkę P24.
 */
export async function startPrzelewy24PaymentAction(
  _prev: Przelewy24StartState,
  formData: FormData
): Promise<Przelewy24StartState> {
  const session = await getClientSession();
  if (!session) {
    return { error: "Zaloguj się." };
  }
  if (!isPrzelewy24Configured()) {
    return { error: "Płatności Przelewy24 nie są skonfigurowane (zmienne środowiskowe)." };
  }
  const orderId = (formData.get("orderId") as string)?.trim() ?? "";
  if (!orderId) {
    return { error: "Brak identyfikatora zamówienia." };
  }
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId: session.user.id },
    include: {
      package: true,
      payment: true,
      user: { select: { email: true } },
    },
  });
  if (!order) {
    return { error: "Nie znaleziono zamówienia." };
  }
  if (order.package.planTier === PlanTier.FREE || order.totalCents <= 0) {
    return { error: "Ten pakiet nie wymaga płatności online." };
  }
  const payable = order.status === OrderStatus.AWAITING_PAYMENT;
  if (!payable) {
    return { error: "To zamówienie nie oczekuje już na płatność (sprawdź status)." };
  }
  if (order.payment?.status === PaymentStatus.COMPLETED) {
    return { error: "Zamówienie jest już opłacone." };
  }

  await prisma.payment.upsert({
    where: { orderId: order.id },
    create: {
      orderId: order.id,
      provider: PaymentProvider.PRZELEWY24,
      status: PaymentStatus.PENDING,
      amountCents: order.totalCents,
      currency: "PLN",
    },
    update: {
      provider: PaymentProvider.PRZELEWY24,
      status: PaymentStatus.PENDING,
      amountCents: order.totalCents,
      currency: "PLN",
    },
  });

  const base = getAppPublicUrl();
  const description = `Weddingassistant — ${order.package.name}`.slice(0, 1024);
  const reg = await registerPrzelewy24Transaction({
    sessionId: order.id,
    amount: order.totalCents,
    currency: "PLN",
    description,
    email: order.user.email,
    urlReturn: `${base}/dashboard/zamowienia/${order.id}?paid=1`,
    urlStatus: `${base}/api/webhooks/przelewy24`,
  });

  if (!reg.ok) {
    return { error: reg.error };
  }

  redirect(`${getPrzelewy24TrnBase()}/trnRequest/${encodeURIComponent(reg.token)}`);
}
