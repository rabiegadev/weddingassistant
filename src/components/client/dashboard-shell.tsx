"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildCategoryPath,
  buildSubcategoryPath,
  dashboardCategories,
  findCategoryBySlug,
} from "@/lib/client-dashboard-menu";
import { DashboardIcon } from "@/components/client/dashboard-icon";

type PlanStrip = {
  label: string;
  hasPaid: boolean;
  endsLabel: string | null;
  freePlannerNote: boolean;
};

type DashboardShellProps = {
  userDisplayName: string;
  children: React.ReactNode;
  logoutAction: () => Promise<void>;
  planStrip?: PlanStrip;
};

const STORAGE_COLLAPSED = "wa.dashboard.submenu.collapsed";
const STORAGE_LAST_SUBS = "wa.dashboard.last-subs";

type LastSubByCategory = Record<string, string>;

function readStoredLastSubcategories(): LastSubByCategory {
  if (typeof window === "undefined") {
    return {};
  }
  const raw = window.localStorage.getItem(STORAGE_LAST_SUBS);
  if (!raw) {
    return {};
  }
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as LastSubByCategory;
    }
    return {};
  } catch {
    return {};
  }
}

export function DashboardShell({ userDisplayName, children, logoutAction, planStrip }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [submenuCollapsed, setSubmenuCollapsed] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }
    return window.localStorage.getItem(STORAGE_COLLAPSED) === "1";
  });
  const lastSubByCategoryRef = useRef<LastSubByCategory>(readStoredLastSubcategories());

  const segments = useMemo(() => pathname.split("/").filter(Boolean), [pathname]);
  const categorySlug = segments[1];
  const subcategorySlug = segments[2];
  const activeCategory = findCategoryBySlug(categorySlug);

  useEffect(() => {
    if (!activeCategory?.subcategories || !subcategorySlug) {
      return;
    }
    const nextMap = { ...lastSubByCategoryRef.current, [activeCategory.slug]: subcategorySlug };
    lastSubByCategoryRef.current = nextMap;
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_LAST_SUBS, JSON.stringify(nextMap));
    }
  }, [activeCategory, subcategorySlug]);

  useEffect(() => {
    for (const category of dashboardCategories) {
      if (!category.subcategories || category.subcategories.length === 0) {
        router.prefetch(buildCategoryPath(category));
        continue;
      }
      for (const subcategory of category.subcategories) {
        router.prefetch(buildSubcategoryPath(category.slug, subcategory.slug));
      }
    }
  }, [router]);

  const navigateMainCategory = (slug: string) => {
    const category = findCategoryBySlug(slug);
    if (!category) {
      return;
    }
    if (!category.subcategories || category.subcategories.length === 0) {
      router.push(buildCategoryPath(category));
      setMobileMenuOpen(false);
      return;
    }
    const remembered = lastSubByCategoryRef.current[slug];
    const hasRemembered = category.subcategories.some((subcategory) => subcategory.slug === remembered);
    const targetSub = hasRemembered ? remembered : category.subcategories[0].slug;
    router.push(buildSubcategoryPath(category.slug, targetSub));
    setMobileMenuOpen(false);
  };

  const toggleSubmenu = () => {
    const next = !submenuCollapsed;
    setSubmenuCollapsed(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_COLLAPSED, next ? "1" : "0");
    }
  };

  return (
    <div className="min-h-screen bg-dashboard-pattern text-[var(--wa-dash-text)]">
      <header className="sticky top-3 z-40 px-2 sm:px-3">
        <div className="mx-auto w-[96vw] max-w-[3200px] rounded-2xl border border-[var(--wa-dash-border)]/80 bg-white/70 px-3 py-3 shadow-[0_8px_30px_var(--wa-dash-shadow)] backdrop-blur-lg sm:px-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--wa-dash-gold)] to-[#8d6f3f] text-sm font-semibold text-white shadow">
                WA
              </div>
              <div className="min-w-0">
                <div className="flex min-w-0 items-end gap-1">
                  <span className="truncate font-wa-display text-lg font-medium italic text-[var(--wa-dash-navy)] sm:text-xl">
                    Wedding Assistant
                  </span>
                  <span className="truncate text-base font-bold text-[var(--wa-dash-navy)] sm:text-lg">Klient</span>
                </div>
                <p className="truncate text-[11px] text-[var(--wa-dash-muted)] sm:text-xs">
                  Zalogowany jako {userDisplayName}.
                </p>
              </div>
            </div>

            <div className="hidden items-center gap-2 lg:flex">
              <Link
                href="/dashboard/asystent-budzetu/widok-glowny"
                className="rounded-xl border border-[var(--wa-dash-border)] bg-white/80 px-3 py-1.5 text-sm font-medium text-[var(--wa-dash-navy)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Koszyk
              </Link>
              <Link
                href="/dashboard/strona-weselna/widok-glowny"
                className="rounded-xl border border-[var(--wa-dash-border)] bg-white/80 px-3 py-1.5 text-sm font-medium text-[var(--wa-dash-navy)] transition hover:-translate-y-0.5 hover:bg-white"
              >
                Strona weselna
              </Link>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-xl border border-[var(--wa-dash-gold)]/45 bg-[var(--wa-dash-gold-soft)] px-3 py-1.5 text-sm font-semibold text-[#7a5a2a] transition hover:-translate-y-0.5 hover:bg-[#ebdcc6]"
                >
                  Wyloguj
                </button>
              </form>
            </div>
            <button
              type="button"
              className="rounded-xl border border-[var(--wa-dash-border)] bg-white/80 p-2 text-[var(--wa-dash-navy)] lg:hidden"
              onClick={() => setMobileMenuOpen((value) => !value)}
              aria-label="Przełącz menu mobilne"
            >
              <span className="block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
              <span className="mt-1 block h-0.5 w-5 bg-current" />
            </button>
          </div>

          <nav className="mt-3 hidden gap-1 overflow-x-auto pb-1 lg:flex">
            {dashboardCategories.map((category) => {
              const isActive = activeCategory?.slug === category.slug;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => navigateMainCategory(category.slug)}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "border-[var(--wa-dash-gold)]/50 bg-[var(--wa-dash-gold-soft)] text-[var(--wa-dash-navy)]"
                      : "border-transparent bg-transparent text-[#44527f] hover:border-[var(--wa-dash-border)] hover:bg-[#f3f7ff]"
                  }`}
                >
                  <DashboardIcon icon={category.icon} />
                  <span>{category.label}</span>
                </button>
              );
            })}
          </nav>

          {mobileMenuOpen ? (
            <nav className="mt-3 grid gap-1 lg:hidden">
              {dashboardCategories.map((category) => {
                const isActive = activeCategory?.slug === category.slug;
                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => navigateMainCategory(category.slug)}
                    className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${
                      isActive
                        ? "border-[var(--wa-dash-gold)]/50 bg-[var(--wa-dash-gold-soft)] text-[var(--wa-dash-navy)]"
                        : "border-[var(--wa-dash-border)] bg-white/70 text-[#44527f]"
                    }`}
                  >
                    <DashboardIcon icon={category.icon} />
                    <span>{category.label}</span>
                  </button>
                );
              })}
              <div className="mt-2 flex gap-2">
                <Link
                  href="/dashboard/asystent-budzetu/widok-glowny"
                  className="rounded-xl border border-[var(--wa-dash-border)] bg-white/80 px-3 py-1.5 text-sm font-medium text-[var(--wa-dash-navy)]"
                >
                  Koszyk
                </Link>
                <Link
                  href="/dashboard/strona-weselna/widok-glowny"
                  className="rounded-xl border border-[var(--wa-dash-border)] bg-white/80 px-3 py-1.5 text-sm font-medium text-[var(--wa-dash-navy)]"
                >
                  Strona weselna
                </Link>
                <form action={logoutAction}>
                  <button
                    type="submit"
                    className="rounded-xl border border-[var(--wa-dash-gold)]/45 bg-[var(--wa-dash-gold-soft)] px-3 py-1.5 text-sm font-semibold text-[#7a5a2a]"
                  >
                    Wyloguj
                  </button>
                </form>
              </div>
            </nav>
          ) : null}
        </div>
      </header>

      <main className="mx-auto mt-4 w-[96vw] max-w-[3200px] pb-10">
        {planStrip ? (
          <div className="mb-3 rounded-2xl border border-[var(--wa-dash-border)] bg-[#f4f7ff] px-4 py-3 text-sm text-[var(--wa-dash-navy)] shadow-sm sm:px-5">
            <p>
              <span className="font-semibold">Twój plan:</span> {planStrip.label}
              {planStrip.hasPaid && planStrip.endsLabel ? (
                <span className="text-[var(--wa-dash-muted)]">
                  {" "}
                  · dostęp do {planStrip.endsLabel}
                </span>
              ) : null}
            </p>
            {planStrip.freePlannerNote ? (
              <p className="mt-1 text-xs text-[var(--wa-dash-muted)]">
                Plan darmowy: lista gości, budżet i dane planera są zerowane co tydzień (konto pozostaje).
              </p>
            ) : null}
          </div>
        ) : null}
        <div className="flex items-start gap-3">
          {activeCategory?.subcategories?.length ? (
            <aside
              className={`hidden shrink-0 rounded-2xl border border-[var(--wa-dash-border)] bg-[var(--wa-dash-surface)] p-2 shadow-[0_8px_24px_rgba(60,78,126,0.1)] lg:block ${
                submenuCollapsed ? "w-[78px]" : "w-[280px]"
              }`}
            >
              <button
                type="button"
                onClick={toggleSubmenu}
                className="mb-2 inline-flex w-full items-center justify-center rounded-lg border border-[var(--wa-dash-border)] bg-[#f7f9ff] px-2 py-1.5 text-xs font-semibold text-[var(--wa-dash-navy)] hover:bg-[#edf3ff]"
              >
                {submenuCollapsed ? "Rozwiń" : "Zwiń"}
              </button>
              <div className="space-y-1">
                {activeCategory.subcategories.map((subcategory) => {
                  const isActive = subcategory.slug === subcategorySlug;
                  return (
                    <Link
                      key={subcategory.id}
                      href={buildSubcategoryPath(activeCategory.slug, subcategory.slug)}
                      className={`group inline-flex w-full items-center gap-2 rounded-lg border px-2.5 py-2 text-sm transition ${
                        isActive
                          ? "border-[var(--wa-dash-gold)]/50 bg-[var(--wa-dash-gold-soft)] text-[var(--wa-dash-navy)]"
                          : "border-transparent text-[#465680] hover:border-[var(--wa-dash-border)] hover:bg-[#f4f8ff]"
                      }`}
                      title={subcategory.label}
                    >
                      <DashboardIcon icon={subcategory.icon} />
                      {submenuCollapsed ? null : <span className="truncate">{subcategory.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </aside>
          ) : null}

          <section className="min-h-[65vh] flex-1 rounded-2xl border border-[var(--wa-dash-border)] bg-[var(--wa-dash-surface)] p-4 shadow-[0_10px_28px_rgba(60,78,126,0.1)] sm:p-5">
            {children}
          </section>
        </div>
      </main>

      <footer className="mx-auto w-[96vw] max-w-[3200px] pb-3 text-center text-[11px] text-[var(--wa-dash-muted)]">
        Wedding Assistant - panel klienta
      </footer>
    </div>
  );
}
