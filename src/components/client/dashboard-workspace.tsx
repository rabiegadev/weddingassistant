import {
  type DashboardCategory,
  type DashboardSubcategory,
  buildSubcategoryPath,
} from "@/lib/client-dashboard-menu";
import type { ModuleGate } from "@/lib/dashboard/module-gate";
import Link from "next/link";

type DashboardWorkspaceProps = {
  category: DashboardCategory;
  subcategory?: DashboardSubcategory;
  /** Płatny moduł zablokowany — komunikat zamiast treści roboczej. */
  gate?: ModuleGate | null;
  /** Informacja o limitach planu (bez pełnej blokady). */
  limitBanner?: string | null;
};

export function DashboardWorkspace({
  category,
  subcategory,
  gate,
  limitBanner,
}: DashboardWorkspaceProps) {
  const title = subcategory ? `${category.label} / ${subcategory.label}` : category.label;
  const pathKey = `${category.slug}/${subcategory?.slug ?? "widok"}`;
  const suggestions: Record<string, { tip: string; actions: string[] }> = {
    "narzedzia/lista-gosci": {
      tip: "Szybki start: dodaj 5 przykładowych gości i oznacz status RSVP.",
      actions: ["Import CSV", "Dodaj ręcznie", "Sortuj po rodzinach"],
    },
    "narzedzia/plan-stolow": {
      tip: "Widok szeroki 21:9 będzie szczególnie wygodny dla planu stołów.",
      actions: ["Nowy układ sali", "Stół VIP", "Podgląd konfliktów"],
    },
    "asystent-budzetu/lista-wydatkow": {
      tip: "Rozbij budżet na 6 głównych kategorii i ustaw limity.",
      actions: ["Dodaj wydatek", "Oznacz opłacone", "Eksport PDF"],
    },
    "kalendarz/widok-osi-czasu": {
      tip: "Przeciągnij wydarzenia po osi czasu, by szybko znaleźć kolizje.",
      actions: ["Dodaj punkt dnia", "Bufor czasowy", "Widok godzinowy"],
    },
    "strona-weselna/konfiguracja": {
      tip: "Tu później podepniemy personalizację motywu i sekcji strony.",
      actions: ["Kolory marki", "Sekcje on/off", "CTA i linki"],
    },
    "moje-konto/powiadomienia": {
      tip: "Ustal priorytety: e-mail, SMS, przypomnienia tygodniowe.",
      actions: ["Kanały powiadomień", "Cisza nocna", "Alerty RSVP"],
    },
  };

  const selectedSuggestion = suggestions[pathKey] ?? {
    tip: "Ten obszar jest gotowy pod podłączenie logiki i danych.",
    actions: ["Przykładowa akcja A", "Przykładowa akcja B", "Przykładowa akcja C"],
  };

  const quickLinks = category.subcategories?.slice(0, 4) ?? [];

  return (
    <div className="space-y-4">
      {limitBanner ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {limitBanner}
        </div>
      ) : null}
      <header className="rounded-xl border border-[var(--wa-dash-border)] bg-[#f7f9ff] p-4">
        <h1 className="text-lg font-semibold text-[var(--wa-dash-navy)] sm:text-xl">{title}</h1>
        <p className="mt-1 text-sm text-[var(--wa-dash-muted)]">
          {gate
            ? "Ten moduł jest niedostępny przy obecnym pakiecie — zaktualizuj plan lub przedłuż dostęp."
            : "To jest wizualny widok roboczy. W kolejnych etapach podłączymy dane i logikę biznesową."}
        </p>
      </header>

      {gate ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center shadow-sm">
          <h2 className="text-base font-semibold text-rose-950">{gate.title}</h2>
          <p className="mt-2 text-sm text-rose-900/90">{gate.body}</p>
          <Link
            href={gate.ctaHref}
            className="mt-4 inline-flex rounded-lg bg-[#B8955C] px-4 py-2 text-sm font-medium text-white hover:brightness-105"
          >
            {gate.ctaLabel}
          </Link>
        </div>
      ) : null}

      <div className={`grid gap-3 lg:grid-cols-3 ${gate ? "pointer-events-none opacity-40" : ""}`}>
        <article className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-4 shadow-[0_8px_20px_rgba(56,72,120,0.08)]">
          <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Status modułu</h2>
          <p className="mt-1 text-sm text-[var(--wa-dash-muted)]">Szkielet UI gotowy. Treści i formularze są placeholderowe.</p>
        </article>
        <article className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-4 shadow-[0_8px_20px_rgba(56,72,120,0.08)]">
          <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Sugestia dla tej podstrony</h2>
          <p className="mt-1 text-sm text-[var(--wa-dash-muted)]">{selectedSuggestion.tip}</p>
        </article>
        <article className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-4 shadow-[0_8px_20px_rgba(56,72,120,0.08)]">
          <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Szybkie akcje</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {selectedSuggestion.actions.map((action) => (
              <span
                key={action}
                className="rounded-md border border-[var(--wa-dash-gold)]/35 bg-[var(--wa-dash-gold-soft)] px-2 py-1 text-xs font-medium text-[#775726]"
              >
                {action}
              </span>
            ))}
          </div>
        </article>
      </div>

      {quickLinks.length > 0 && !gate ? (
        <section className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-4 shadow-[0_8px_20px_rgba(56,72,120,0.08)]">
          <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Szybkie przejścia</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            {quickLinks.map((item) => (
              <Link
                key={item.id}
                href={buildSubcategoryPath(category.slug, item.slug)}
                className="rounded-lg border border-[var(--wa-dash-border)] bg-[#f4f7ff] px-2.5 py-1.5 text-xs font-medium text-[var(--wa-dash-navy)] transition hover:bg-[#eaf0ff]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
