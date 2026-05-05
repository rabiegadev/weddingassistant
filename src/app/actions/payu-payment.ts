"use server";

import { OrderStatus, PaymentProvider, PaymentStatus, PlanTier } from "@prisma/client";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAppPublicUrl } from "@/lib/env/public";
import { getClientSession } from "@/lib/auth/session";
import { getPayuClient } from "@/lib/payments/payu/client";
import { createPayuRedirectOrder } from "@/lib/payments/payu/create-order";
import { isPayuConfigured } from "@/lib/payments/payu/config";

export type PayuStartState = { error?: string };

function getCustomerIpFromHeaders(h: Headers): string {
  const xf = h.get("x-forwarded-for");
  const first = xf?.split(",")[0]?.trim();
  if (first) {
    return first;
  }
  const real = h.get("x-real-ip")?.trim();
  if (real) {
    return real;
  }
  return "127.0.0.1";
}

/**
 * Rozpoczęcie płatności PayU — przekierowanie na bramkę PayU.
 */
export async function startPayuPaymentAction(_prev: PayuStartState, formData: FormData): Promise<PayuStartState> {
  const session = await getClientSession();
  if (!session) {
    return { error: "Zaloguj się." };
  }
  if (!isPayuConfigured()) {
    return { error: "Płatności PayU nie są skonfigurowane (zmienne środowiskowe)." };
  }
  const payu = getPayuClient();
  if (!payu) {
    return { error: "Płatności PayU nie są skonfigurowane (zmienne środowiskowe)." };
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
      provider: PaymentProvider.PAYU,
      status: PaymentStatus.PENDING,
      amountCents: order.totalCents,
      currency: "PLN",
    },
    update: {
      provider: PaymentProvider.PAYU,
      status: PaymentStatus.PENDING,
      amountCents: order.totalCents,
      currency: "PLN",
    },
  });

  const base = getAppPublicUrl();
  const description = `Weddingassistant — ${order.package.name}`.slice(0, 255);
  const h = await headers();
  const customerIp = getCustomerIpFromHeaders(h);

  const created = await createPayuRedirectOrder(payu, {
    extOrderId: order.id,
    notifyUrl: `${base}/api/webhooks/payu`,
    continueUrl: `${base}/dashboard/zamowienia/${order.id}?paid=1`,
    customerIp,
    description,
    totalAmountCents: order.totalCents,
    buyerEmail: order.user.email,
    productName: order.package.name,
  });

  if (!created.ok) {
    return { error: created.error };
  }

  await prisma.payment.update({
    where: { orderId: order.id },
    data: { externalOrderId: created.payuOrderId },
  });

  redirect(created.redirectUri);
}
