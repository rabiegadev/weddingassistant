import type { PayU } from "@ingameltd/payu";
import { getPayuApiBase, getPayuCredentials } from "./config";

export async function createPayuRedirectOrder(
  payu: PayU,
  args: {
    extOrderId: string;
    notifyUrl: string;
    continueUrl: string;
    customerIp: string;
    description: string;
    totalAmountCents: number;
    buyerEmail: string;
    productName: string;
  }
): Promise<{ ok: true; redirectUri: string; payuOrderId: string } | { ok: false; error: string }> {
  const creds = getPayuCredentials();
  if (!creds) {
    return { ok: false, error: "PayU nie jest skonfigurowane." };
  }

  const token = await payu.getAccessToken();
  const body: Record<string, unknown> = {
    extOrderId: args.extOrderId,
    notifyUrl: args.notifyUrl,
    continueUrl: args.continueUrl,
    customerIp: args.customerIp,
    merchantPosId: creds.posId,
    description: args.description,
    currencyCode: "PLN",
    totalAmount: args.totalAmountCents,
    products: [
      {
        name: args.productName.slice(0, 255),
        unitPrice: args.totalAmountCents,
        quantity: 1,
      },
    ],
    buyer: {
      email: args.buyerEmail,
    },
  };

  const url = `${getPayuApiBase()}/api/v2_1/orders`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
    redirect: "manual",
  });

  const rawText = await res.text();
  let data: unknown;
  try {
    data = rawText ? (JSON.parse(rawText) as unknown) : null;
  } catch {
    return { ok: false, error: `PayU: nie udało się odczytać odpowiedzi (HTTP ${res.status}).` };
  }

  return parsePayuOrderResponse(res.status, data, res.headers);
}

function parsePayuOrderResponse(
  status: number,
  data: unknown,
  headers: Headers
): { ok: true; redirectUri: string; payuOrderId: string } | { ok: false; error: string } {
  const obj = data && typeof data === "object" ? (data as Record<string, unknown>) : null;
  if (!obj) {
    return { ok: false, error: `PayU: pusta odpowiedź (HTTP ${status}).` };
  }

  const redirectUriRaw =
    typeof obj.redirectUri === "string" ? obj.redirectUri : status === 302 ? headers.get("Location") : null;

  const orderIdRaw = typeof obj.orderId === "string" ? obj.orderId : null;

  const redirectUri = redirectUriRaw?.trim() ?? "";
  const payuOrderId = orderIdRaw?.trim() ?? "";

  if (redirectUri && payuOrderId) {
    return { ok: true, redirectUri, payuOrderId };
  }

  const statusObj = obj.status;
  let code = "";
  let desc = "";
  if (statusObj && typeof statusObj === "object") {
    const s = statusObj as Record<string, unknown>;
    if (typeof s.statusCode === "string" || typeof s.statusCode === "number") {
      code = String(s.statusCode);
    }
    if (typeof s.statusDesc === "string") {
      desc = s.statusDesc;
    }
  }
  const msg = [code, desc].filter(Boolean).join(" — ") || `HTTP ${status}`;
  return { ok: false, error: `PayU: ${msg}` };
}
