/**
 * Kanoniczna baza URL aplikacji (maile, linki absolutne). Na Vercel: zmienna w Production.
 */
export function getAppPublicUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "https://weddingassistant.pl"
  );
}
