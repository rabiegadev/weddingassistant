import { PayU } from "@ingameltd/payu";
import { getPayuCredentials, isPayuSandbox } from "./config";

let cached: PayU | null | undefined;

/**
 * Singleton klienta PayU (OAuth + weryfikacja podpisu notyfikacji).
 */
export function getPayuClient(): PayU | null {
  if (cached !== undefined) {
    return cached;
  }
  const creds = getPayuCredentials();
  if (!creds) {
    cached = null;
    return null;
  }
  cached = new PayU(
    creds.clientId,
    creds.clientSecret,
    creds.posId,
    creds.secondKey,
    { sandbox: isPayuSandbox() }
  );
  return cached;
}
