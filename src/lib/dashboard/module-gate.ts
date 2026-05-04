import type { ClientEntitlements } from "@/lib/entitlements/types";

export type ModuleGate = {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
};

/**
 * Ograniczenia modułów w panelu pary (paywall / freemium).
 */
export function getModuleGateForPath(
  categorySlug: string,
  subcategorySlug: string,
  ent: ClientEntitlements
): ModuleGate | null {
  if (categorySlug === "galeria" && !ent.galleryEnabled) {
    return {
      title: "Galeria wymaga wyższego pakietu",
      body:
        "Twój obecny plan nie obejmuje galerii (lub minął okres subskrypcji). Ulepsz pakiet, aby odblokować ten moduł.",
      ctaLabel: "Zobacz pakiety",
      ctaHref: "/dashboard/moje-konto/wszystkie-pakiety",
    };
  }
  if (categorySlug === "strona-weselna" && !ent.weddingPageEnabled) {
    return {
      title: "Strona weselna niedostępna w tym planie",
      body:
        "Konfigurator strony WWW jest dostępny w pakietach z modułem wizytówki. Wybierz wyższy plan lub przedłuż subskrypcję z odpowiednią ofertą.",
      ctaLabel: "Mój pakiet i zamówienia",
      ctaHref: "/dashboard/moje-konto/moj-pakiet",
    };
  }
  return null;
}

/** Informacja o limitach (lista gości / stoły) — bez blokady całego modułu. */
export function planLimitsBanner(
  categorySlug: string,
  subcategorySlug: string,
  ent: ClientEntitlements
): string | null {
  if (categorySlug === "narzedzia" && subcategorySlug === "lista-gosci") {
    return `Aktywny plan: ${ent.labelPl}. Limit gości: ${ent.maxGuests} (egzekwowanie przy dodawaniu — rozszerzenie w kolejnej iteracji).`;
  }
  if (categorySlug === "narzedzia" && subcategorySlug === "plan-stolow") {
    return `Aktywny plan: ${ent.labelPl}. Limit stołów / miejsc: ${ent.maxTables}.`;
  }
  return null;
}
