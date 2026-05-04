import { PaymentProvider } from "@prisma/client";
import { prisma } from "@/lib/db";
import { completeOrderAfterVerifiedPayment } from "@/lib/payments/complete-paid-order";
import { verifyPrzelewy24Transaction } from "@/lib/payments/przelewy24/verify";

export const dynamic = "force-dynamic";

type P24Body = {
  merchantId?: number;
  posId?: number;
  sessionId?: string;
  amount?: number;
  originAmount?: number;
  currency?: string;
  orderId?: number;
  methodId?: number;
  statement?: string;
  sign?: string;
};

function parseBody(raw: unknown): P24Body | null {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  return raw as P24Body;
}

/**
 * Notyfikacja Przelewy24 → weryfikacja transakcji PUT /transaction/verify → opłacenie zamówienia.
 * @see https://developers.przelewy24.pl/
 */
export async function POST(request: Request) {
  let rawJson: unknown;
  const ct = request.headers.get("content-type") ?? "";
  try {
    if (ct.includes("application/json")) {
      rawJson = await request.json();
    } else if (ct.includes("application/x-www-form-urlencoded")) {
      const fd = await request.formData();
      rawJson = Object.fromEntries(fd.entries());
    } else {
      const text = await request.text();
      try {
        rawJson = JSON.parse(text) as unknown;
      } catch {
        console.error("[p24 webhook] nieobsługiwany format:", text.slice(0, 300));
        return new Response("BAD REQUEST", { status: 400 });
      }
    }
  } catch (e) {
    console.error("[p24 webhook] read error", e);
    return new Response("BAD REQUEST", { status: 400 });
  }

  const body = parseBody(rawJson);
  if (!body?.sessionId || body.amount == null || body.currency == null || body.orderId == null) {
    console.error("[p24 webhook] brak pól:", JSON.stringify(body));
    return new Response("BAD REQUEST", { status: 400 });
  }

  const sessionId = String(body.sessionId);
  const order = await prisma.order.findUnique({
    where: { id: sessionId },
    select: { id: true },
  });
  if (!order) {
    console.warn("[p24 webhook] nieznane sessionId/order:", sessionId);
    return new Response("NOT FOUND", { status: 404 });
  }

  const verify = await verifyPrzelewy24Transaction({
    sessionId,
    orderId: Number(body.orderId),
    amount: Number(body.amount),
    currency: String(body.currency),
  });

  if (!verify.ok) {
    console.error("[p24 webhook] verify failed:", verify.error);
    return new Response("VERIFY FAILED", { status: 500 });
  }

  try {
    await completeOrderAfterVerifiedPayment({
      orderId: sessionId,
      provider: PaymentProvider.PRZELEWY24,
      rawNotifyJson: JSON.stringify(body),
      amountCents: Number(body.amount),
    });
  } catch (e) {
    console.error("[p24 webhook] complete order", e);
    return new Response("INTERNAL", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
