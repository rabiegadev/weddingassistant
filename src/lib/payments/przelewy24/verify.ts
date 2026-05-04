import {
  getPrzelewy24ApiBase,
  getPrzelewy24Credentials,
  przelewy24BasicAuthHeader,
  type Przelewy24Credentials,
} from "@/lib/payments/przelewy24/config";
import { signVerify } from "@/lib/payments/przelewy24/sign";

export type VerifyTransactionResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Potwierdzenie transakcji u P24 (wymagane do zaksięgowania środków).
 */
export async function verifyPrzelewy24Transaction(args: {
  sessionId: string;
  orderId: number;
  amount: number;
  currency: string;
  creds?: Przelewy24Credentials;
}): Promise<VerifyTransactionResult> {
  const creds = args.creds ?? getPrzelewy24Credentials();
  if (!creds) {
    return { ok: false, error: "Brak konfiguracji Przelewy24." };
  }
  const sign = signVerify({
    sessionId: args.sessionId,
    orderId: args.orderId,
    amount: args.amount,
    currency: args.currency,
    crc: creds.crc,
  });
  const body = {
    merchantId: creds.merchantId,
    posId: creds.posId,
    sessionId: args.sessionId,
    amount: args.amount,
    currency: args.currency,
    orderId: args.orderId,
    sign,
  };
  const url = `${getPrzelewy24ApiBase()}/api/v1/transaction/verify`;
  const res = await fetch(url, {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: przelewy24BasicAuthHeader(creds),
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text) as unknown;
  } catch {
    return { ok: false, error: `P24 verify: nie-JSON (${res.status})` };
  }
  if (!res.ok) {
    const errMsg =
      parsed && typeof parsed === "object" && "error" in parsed
        ? String((parsed as { error?: unknown }).error)
        : text.slice(0, 500);
    return { ok: false, error: `P24 verify ${res.status}: ${errMsg}` };
  }
  const data =
    parsed && typeof parsed === "object" && "data" in parsed
      ? (parsed as { data?: { status?: string } }).data
      : undefined;
  if (data?.status === "success") {
    return { ok: true };
  }
  return { ok: false, error: `P24 verify: niepowodzenie statusu (${data?.status ?? "?"})` };
}
