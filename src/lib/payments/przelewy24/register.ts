import {
  getPrzelewy24ApiBase,
  getPrzelewy24Credentials,
  przelewy24BasicAuthHeader,
  type Przelewy24Credentials,
} from "@/lib/payments/przelewy24/config";
import { signRegister } from "@/lib/payments/przelewy24/sign";

export type RegisterTransactionResult =
  | { ok: true; token: string }
  | { ok: false; error: string };

/**
 * Rejestracja transakcji — zwraca token do `GET /trnRequest/{token}`.
 */
export async function registerPrzelewy24Transaction(args: {
  sessionId: string;
  amount: number;
  currency: string;
  description: string;
  email: string;
  urlReturn: string;
  urlStatus: string;
  creds?: Przelewy24Credentials;
}): Promise<RegisterTransactionResult> {
  const creds = args.creds ?? getPrzelewy24Credentials();
  if (!creds) {
    return { ok: false, error: "Brak konfiguracji Przelewy24 (env)." };
  }
  const sign = signRegister({
    sessionId: args.sessionId,
    merchantId: creds.merchantId,
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
    description: args.description,
    email: args.email,
    country: "pl",
    language: "pl",
    urlReturn: args.urlReturn,
    urlStatus: args.urlStatus,
    regulationAccept: true,
    sign,
  };
  const url = `${getPrzelewy24ApiBase()}/api/v1/transaction/register`;
  const res = await fetch(url, {
    method: "POST",
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
    return { ok: false, error: `P24 register: nie-JSON (${res.status})` };
  }
  if (!res.ok) {
    const errMsg =
      parsed && typeof parsed === "object" && "error" in parsed
        ? String((parsed as { error?: unknown }).error)
        : text.slice(0, 500);
    return { ok: false, error: `P24 register ${res.status}: ${errMsg}` };
  }
  if (!parsed || typeof parsed !== "object" || !("data" in parsed)) {
    return { ok: false, error: "P24 register: brak pola data." };
  }
  const data = (parsed as { data?: { token?: string } }).data;
  const token = data?.token;
  if (!token) {
    return { ok: false, error: "P24 register: brak token." };
  }
  return { ok: true, token };
}
