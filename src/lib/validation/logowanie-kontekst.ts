/**
 * Pojedynczy, przewidywalny parametr: `?k=client` (domyślny) albo `?k=admin`.
 * Błędne wartości traktujemy jak `client` (najbezpieczniejsze domyślne wejście).
 */
export function parseLogowanieKontekst(sp: { k?: string | string[] }): {
  kontekst: "client" | "admin";
} {
  const k = sp.k;
  if (k === "admin" || (Array.isArray(k) && k[0] === "admin")) {
    return { kontekst: "admin" };
  }
  if (k === "client" || (Array.isArray(k) && k[0] === "client")) {
    return { kontekst: "client" };
  }
  return { kontekst: "client" };
}
