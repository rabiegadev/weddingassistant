/**
 * Czytelny, stabilny identyfikator w URL; nie gwarantujemy 100% unikatu — waliduj przed `create`.
 */
export function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/[ąĄ]/g, "a")
    .replace(/[ćĆ]/g, "c")
    .replace(/[ęĘ]/g, "e")
    .replace(/[łŁ]/g, "l")
    .replace(/[ńŃ]/g, "n")
    .replace(/[óÓ]/g, "o")
    .replace(/[śŚ]/g, "s")
    .replace(/[żŹ]/g, "z")
    .replace(/[źŹĄĆĘŁŃÓŚŻŹĆ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "pakiet";
}
