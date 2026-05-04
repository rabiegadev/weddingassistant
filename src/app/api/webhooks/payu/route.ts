import { PaymentProvider } from "@prisma/client";
import { prisma } from "@/lib/db";
import { completeOrderAfterVerifiedPayment } from "@/lib/payments/complete-paid-order";
import { getPayuClient } from "@/lib/payments/payu/client";

export const dynamic = "force-dynamic";

function parsePayuNotificationPayload(parsed: unknown): {
  extOrderId: string | undefined;
  status: string | undefined;
  totalAmountCents: number | undefined;
} {
  if (!parsed || typeof parsed !== "object") {
    return { extOrderId: undefined, status: undefined, totalAmountCents: undefined };
  }
  const root = parsed as Record<string, unknown>;
  const orderRaw = root.order;
  const order =
    orderRaw && typeof orderRaw === "object" ? (orderRaw as Record<string, unknown>) : root;

  const extOrderId = typeof order.extOrderId === "string" ? order.extOrderId : undefined;
  const status = typeof order.status === "string" ? order.status : undefined;

  let totalAmountCents: number | undefined;
  const ta = order.totalAmount;
  if (typeof ta === "number" && Number.isFinite(ta)) {
    totalAmountCents = ta;
  } else if (typeof ta === "string") {
    const n = Number.parseInt(ta, 10);
    if (Number.isFinite(n)) {
      totalAmountCents = n;
    }
  }

  return { extOrderId, status, totalAmountCents };
}

/**
 * Notyfikacja PayU → weryfikacja OpenPayU-Signature (MD5) → opłacenie zamówienia.
 * @see https://developers.payu.com/
 */
export async function POST(request: Request) {
  const payu = getPayuClient();
  if (!payu) {
    console.error("[payu webhook] brak konfiguracji PayU");
    return new Response("NOT CONFIGURED", { status: 503 });
  }

  const rawBody = await request.text();
  const sigHeader =
    request.headers.get("OpenPayu-Signature") ??
    request.headers.get("OpenPayU-Signature") ??
    request.headers.get("openpayu-signature") ??
    "";

  if (!sigHeader) {
    console.error("[payu webhook] brak nagłówka OpenPayu-Signature");
    return new Response("BAD REQUEST", { status: 400 });
  }

  const signatureOk = payu.verifyNotification(sigHeader, rawBody);
  if (!signatureOk) {
    console.error("[payu webhook] niepoprawny podpis");
    return new Response("INVALID SIGNATURE", { status: 400 });
  }

  let parsed: unknown;
  try {
    parsed = rawBody ? (JSON.parse(rawBody) as unknown) : null;
  } catch {
    console.error("[payu webhook] JSON parse error", rawBody.slice(0, 500));
    return new Response("BAD REQUEST", { status: 400 });
  }

  const { extOrderId, status, totalAmountCents } = parsePayuNotificationPayload(parsed);
  if (!extOrderId) {
    console.error("[payu webhook] brak extOrderId:", rawBody.slice(0, 500));
    return new Response("BAD REQUEST", { status: 400 });
  }
  if (totalAmountCents == null) {
    console.error("[payu webhook] brak totalAmount:", rawBody.slice(0, 500));
    return new Response("BAD REQUEST", { status: 400 });
  }

  const upper = status?.toUpperCase() ?? "";
  if (upper !== "COMPLETED") {
    console.warn("[payu webhook] status nie COMPLETED:", status, extOrderId);
    return new Response("OK", { status: 200 });
  }

  const order = await prisma.order.findUnique({
    where: { id: extOrderId },
    select: { id: true },
  });
  if (!order) {
    console.warn("[payu webhook] nieznane zamówienie:", extOrderId);
    return new Response("NOT FOUND", { status: 404 });
  }

  try {
    await completeOrderAfterVerifiedPayment({
      orderId: extOrderId,
      provider: PaymentProvider.PAYU,
      rawNotifyJson: rawBody,
      amountCents: totalAmountCents,
    });
  } catch (e) {
    console.error("[payu webhook] complete order", e);
    return new Response("INTERNAL", { status: 500 });
  }

  return new Response("OK", { status: 200 });
}
