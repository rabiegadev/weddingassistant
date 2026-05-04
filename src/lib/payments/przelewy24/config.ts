/**
 * Konfiguracja Przelewy24 (REST). Sandbox: zmienna PRZELEWY24_SANDBOX=1/true.
 * Klucze z panelu P24 → Moje konto → Dane API i konfiguracja.
 */
export function isPrzelewy24Sandbox(): boolean {
  const v = process.env.PRZELEWY24_SANDBOX;
  return v === "1" || v === "true";
}

export function getPrzelewy24ApiBase(): string {
  return isPrzelewy24Sandbox()
    ? "https://sandbox.przelewy24.pl"
    : "https://secure.przelewy24.pl";
}

export function getPrzelewy24TrnBase(): string {
  return getPrzelewy24ApiBase();
}

export type Przelewy24Credentials = {
  merchantId: number;
  posId: number;
  crc: string;
  apiKey: string;
};

export function getPrzelewy24Credentials(): Przelewy24Credentials | null {
  const mid = process.env.PRZELEWY24_MERCHANT_ID?.trim();
  const crc = process.env.PRZELEWY24_CRC?.trim();
  const apiKey = process.env.PRZELEWY24_API_KEY?.trim();
  const posRaw = process.env.PRZELEWY24_POS_ID?.trim();
  if (!mid || !crc || !apiKey) {
    return null;
  }
  const merchantId = Number.parseInt(mid, 10);
  const posId = posRaw ? Number.parseInt(posRaw, 10) : merchantId;
  if (!Number.isFinite(merchantId) || !Number.isFinite(posId)) {
    return null;
  }
  return { merchantId, posId, crc, apiKey };
}

export function isPrzelewy24Configured(): boolean {
  return getPrzelewy24Credentials() !== null;
}

/** Authorization: Basic base64(posId:apiKey) — zgodnie z przykładami integracji P24. */
export function przelewy24BasicAuthHeader(creds: Przelewy24Credentials): string {
  const raw = `${creds.posId}:${creds.apiKey}`;
  const b64 = Buffer.from(raw, "utf8").toString("base64");
  return `Basic ${b64}`;
}
