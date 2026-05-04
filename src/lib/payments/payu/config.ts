/**
 * PayU OpenPayU REST (OAuth + /api/v2_1/orders). Sandbox: PAYU_SANDBOX=1 lub true.
 * Klucze z panelu PayU: OAuth (client id / secret), POS ID, drugi klucz (MD5 notyfikacji).
 */
export function isPayuSandbox(): boolean {
  const v = process.env.PAYU_SANDBOX;
  return v === "1" || v === "true";
}

export function getPayuApiBase(): string {
  return isPayuSandbox() ? "https://secure.snd.payu.com" : "https://secure.payu.com";
}

export type PayUCredentials = {
  clientId: number;
  clientSecret: string;
  posId: number;
  secondKey: string;
};

export function getPayuCredentials(): PayUCredentials | null {
  const clientIdRaw = process.env.PAYU_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYU_CLIENT_SECRET?.trim();
  const posRaw = process.env.PAYU_POS_ID?.trim();
  const secondKey = process.env.PAYU_SECOND_KEY?.trim();
  if (!clientIdRaw || !clientSecret || !posRaw || !secondKey) {
    return null;
  }
  const clientId = Number.parseInt(clientIdRaw, 10);
  const posId = Number.parseInt(posRaw, 10);
  if (!Number.isFinite(clientId) || !Number.isFinite(posId)) {
    return null;
  }
  return { clientId, clientSecret, posId, secondKey };
}

export function isPayuConfigured(): boolean {
  return getPayuCredentials() !== null;
}
