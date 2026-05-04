import { headers } from "next/headers";

/**
 * Kanoniczny publiczny URL **bez kontekstu żądania** (cron, webhooks, fallback maile).
 *
 * - **`next dev`**: zawsze `http://localhost:$PORT` — **ignoruje** `NEXT_PUBLIC_APP_URL` z pliku
 *   skopiowanego z produkcji, żeby przekierowania / linki w mailach z lokalnej rejestracji
 *   nie szły na domenę produkcyjną.
 * - **produkcja (Vercel)**: `NEXT_PUBLIC_APP_URL` → `VERCEL_URL` → domyślna domena.
 */
export function getAppPublicUrl(): string {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT ?? "3000";
    return `http://localhost:${port}`;
  }
  const explicit = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  const v = process.env.VERCEL_URL?.trim();
  if (v) {
    const base = v.startsWith("http") ? v : `https://${v}`;
    return base.replace(/\/$/, "");
  }
  return "https://weddingassistant.pl";
}

/**
 * Bazowy URL **bieżącego żądania** (Host / X-Forwarded-*). Używaj w akcjach wywoływanych z
 * przeglądarki (link w mailu po rejestracji, reset hasła), żeby działało także przy innym porcie
 * lub adresie LAN (`192.168.x.x`).
 */
export async function getSiteUrlFromHeaders(): Promise<string> {
  const h = await headers();
  const hostRaw =
    h.get("x-forwarded-host")?.split(",")[0]?.trim() ?? h.get("host")?.trim() ?? "";
  if (hostRaw) {
    const local =
      hostRaw.startsWith("localhost") ||
      hostRaw.startsWith("127.") ||
      /^192\.168\./u.test(hostRaw) ||
      /^10\./u.test(hostRaw);
    const protoHeader = h.get("x-forwarded-proto")?.split(",")[0]?.trim();
    const proto =
      local ? "http" : protoHeader && protoHeader !== "" ? protoHeader : "https";
    return `${proto}://${hostRaw}`;
  }
  return getAppPublicUrl();
}
