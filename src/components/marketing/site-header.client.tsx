"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAdminAction, logoutClientAction } from "@/app/actions/auth";
import { useAuthModal } from "@/components/auth/auth-modal-context";

const nav = [
  { href: "/#funkcje", label: "Funkcje" },
  { href: "/#strona-wesela", label: "Strona wesela" },
  { href: "/#oferta", label: "Oferta" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;

const HOME_SECTION_IDS = ["funkcje", "narzedzie-testowe", "strona-wesela", "oferta", "kontakt"] as const;

function sectionIdFromHref(href: string): string | null {
  const hash = href.split("#")[1];
  return hash ? hash : null;
}

function isNavHrefActive(href: string, pathname: string, activeSectionId: string | null): boolean {
  if (href === "/cennik" || href.startsWith("/cennik")) {
    return pathname === "/cennik" || pathname.startsWith("/cennik");
  }
  if (href === "/realizacje" || href.startsWith("/realizacje")) {
    return pathname === "/realizacje" || pathname.startsWith("/realizacje");
  }
  const id = sectionIdFromHref(href);
  if (id && pathname === "/") {
    return activeSectionId === id;
  }
  return false;
}

function MarketingNavLink({
  href,
  label,
  active,
  onNavigate,
  variant = "desktop",
}: {
  href: string;
  label: string;
  active: boolean;
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const lineWidth =
    variant === "desktop" ? "w-[calc(100%-0.75rem)] max-w-[15rem]" : "w-[calc(100%-1.5rem)] max-w-none";

  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`group relative font-wa-display text-[#f4e6d2] tracking-[0.012em] transition-colors hover:text-[#fff7eb] ${
        variant === "desktop" ? "whitespace-nowrap px-4 py-2 text-[1.03rem]" : "block px-3 py-2.5 text-sm"
      }`}
    >
      <span className="relative z-10">{label}</span>
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-1 left-1/2 z-[5] h-[2px] ${lineWidth} -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#f0dfc4] to-transparent shadow-[0_0_14px_rgba(236,217,180,0.55),0_0_28px_rgba(212,175,130,0.18)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-origin:center] ${
          active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-95 group-hover:scale-x-100 group-hover:opacity-100 group-focus-visible:scale-x-100"
        }`}
      />
    </Link>
  );
}

export type SiteHeaderClientProps = {
  /** Zalogowana para (sesja kliencka) */
  isClient: boolean;
  /** Pełna sesja admina (po 2FA) */
  isAdminFull: boolean;
  /** Sesja admina, ale 2FA jeszcze nie dokończone */
  isAdmin2faPending: boolean;
  twoFaHref: string | null;
};

export function SiteHeaderClient({
  isClient,
  isAdminFull,
  isAdmin2faPending,
  twoFaHref,
}: SiteHeaderClientProps) {
  const pathname = usePathname();
  const { openLogin, openRegister } = useAuthModal();
  const [open, setOpen] = useState(false);
  const [visible] = useState(true);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const showAuthButtons = !isClient && !isAdminFull && !isAdmin2faPending;

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const updateActiveSection = () => {
      const probeY = window.scrollY + window.innerHeight * 0.26;
      let current: string | null = null;
      for (const id of HOME_SECTION_IDS) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= probeY + 12) {
          current = id;
        }
      }
      setActiveSectionId(current);
    };

    updateActiveSection();
    window.addEventListener("scroll", updateActiveSection, { passive: true });
    window.addEventListener("resize", updateActiveSection, { passive: true });
    return () => {
      window.removeEventListener("scroll", updateActiveSection);
      window.removeEventListener("resize", updateActiveSection);
    };
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full border-b transition-[opacity,transform,background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${
        visible
          ? "pointer-events-auto translate-y-0 border-b border-[#cfb48a]/38 bg-[linear-gradient(180deg,rgba(34,22,13,0.82)_0%,rgba(28,18,11,0.78)_48%,rgba(22,14,9,0.84)_100%)] opacity-100 shadow-[0_22px_56px_-28px_rgba(12,8,6,0.72)] backdrop-blur-[14px] backdrop-saturate-[1.08]"
          : "pointer-events-none -translate-y-2 border-transparent bg-transparent opacity-0 backdrop-blur-none"
      }`}
      aria-hidden={false}
    >
      <div className="flex w-full items-center gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2 lg:gap-2.5">
          <span className="relative h-8 w-8 shrink-0 overflow-hidden rounded-sm sm:h-9 sm:w-9">
            <Image
              src="/images/icon.png"
              alt=""
              fill
              className="object-contain brightness-[0.82] contrast-[1.04] saturate-[0.9]"
              sizes="40px"
              priority
            />
          </span>
          <span className="truncate font-wa-display text-[1.45rem] font-medium tracking-[0.02em] text-[#f1e4d1] sm:text-[1.6rem]">
            Weddingassistant
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4 lg:gap-6">
          <nav className="hidden items-center gap-1.5 lg:flex" aria-label="Nawigacja główna">
            {nav.map((item) => (
              <MarketingNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isNavHrefActive(item.href, pathname, activeSectionId)}
              />
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
            {isAdmin2faPending && twoFaHref ? (
              <>
                <Link
                  className="rounded-md border border-amber-400/50 bg-amber-950/35 px-3 py-1.5 text-sm font-medium tracking-[0.02em] text-amber-100 backdrop-blur-sm"
                  href={twoFaHref}
                >
                  Dokończ logowanie
                </Link>
                <form action={logoutAdminAction}>
                  <button
                    type="submit"
                    className="rounded-md px-3 py-1.5 text-sm font-semibold tracking-[0.02em] text-[#f6e9d6] underline decoration-[#d5b47a]/80 underline-offset-2 hover:text-[#fff8ec] hover:decoration-[#e6c88f]"
                  >
                    Wyloguj
                  </button>
                </form>
              </>
            ) : null}
            {isAdminFull ? (
              <>
                <Link
                  className="rounded-md border border-[#b8955c]/55 bg-white/65 px-3 py-1.5 text-sm font-medium tracking-[0.02em] text-[#2e2926] transition hover:bg-white/90"
                  href="/admin"
                >
                  Panel admina
                </Link>
                <form action={logoutAdminAction}>
                  <button
                    type="submit"
                    className="rounded-md px-3 py-1.5 text-sm font-semibold tracking-[0.02em] text-[#f6e9d6] underline decoration-[#d5b47a]/80 underline-offset-2 hover:text-[#fff8ec] hover:decoration-[#e6c88f]"
                  >
                    Wyloguj
                  </button>
                </form>
              </>
            ) : null}
            {isClient && !isAdminFull ? (
              <>
                <Link
                  className="rounded-md border border-[#e5c48c]/70 bg-[#fff4e2] px-3 py-1.5 text-sm font-semibold tracking-[0.02em] text-[#2e2926] shadow-sm transition hover:bg-[#fff9f0]"
                  href="/dashboard"
                >
                  Moje konto
                </Link>
                <form action={logoutClientAction}>
                  <button
                    type="submit"
                    className="rounded-md px-3 py-1.5 text-sm font-semibold tracking-[0.02em] text-[#f6e9d6] underline decoration-[#d5b47a]/80 underline-offset-2 hover:text-[#fff8ec] hover:decoration-[#e6c88f]"
                  >
                    Wyloguj
                  </button>
                </form>
              </>
            ) : null}
            {showAuthButtons ? (
              <>
                <span
                  aria-hidden
                  className="mx-1 h-8 w-px bg-gradient-to-b from-transparent via-[#e4cda7]/65 to-transparent shadow-[0_0_8px_rgba(228,205,167,0.35)]"
                />
                <button
                  type="button"
                  className="rounded-full border border-[#dbc299]/55 bg-transparent px-4 py-2 text-sm font-medium tracking-[0.02em] text-[#f4e8d7] transition hover:border-[#ebd4af]/75 hover:bg-white/[0.06]"
                  onClick={() => openLogin()}
                >
                  Zaloguj się
                </button>
                <button
                  type="button"
                  className="rounded-full border border-[#e2c18d]/75 bg-[#d0ab72] px-4 py-2 text-sm font-semibold tracking-[0.02em] text-[#261a10] shadow-[0_12px_32px_-16px_rgba(45,31,16,0.85),inset_0_1px_0_rgba(255,246,228,0.35)] transition duration-300 hover:brightness-[1.07] hover:shadow-[0_16px_38px_-14px_rgba(45,31,16,0.88)]"
                  onClick={() => openRegister()}
                  aria-label="Załóż darmowe konto"
                >
                  Załóż konto
                </button>
              </>
            ) : null}
          </div>

          <div className="shrink-0 lg:hidden">
            <button
              type="button"
              className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-[#c9bfb0] bg-white/70 text-[#2e2926] shadow-sm backdrop-blur-sm hover:bg-white/95"
              aria-controls="wa-mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="sr-only">Menu</span>
              <span className="text-base font-semibold">{open ? "✕" : "☰"}</span>
            </button>
          </div>
        </div>
      </div>
      <div
        aria-hidden
        className="pointer-events-none h-px w-full bg-gradient-to-r from-transparent via-[#e9d7b8]/60 to-transparent shadow-[0_0_12px_rgba(233,215,184,0.3)]"
      />

      {open ? (
        <div
          className="border-t border-white/[0.25] bg-[#ebe6df]/88 backdrop-blur-xl lg:hidden"
          id="wa-mobile-menu"
        >
          <div className="w-full space-y-0.5 px-4 py-3">
            {nav.map((item) => (
              <MarketingNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                variant="mobile"
                active={isNavHrefActive(item.href, pathname, activeSectionId)}
                onNavigate={() => setOpen(false)}
              />
            ))}
            <div className="pt-3">
              {isAdmin2faPending && twoFaHref ? (
                <>
                  <Link
                    onClick={() => setOpen(false)}
                    className="mb-2 block w-full rounded-md border border-amber-800/30 bg-amber-50 py-2.5 text-center text-sm font-medium text-amber-950"
                    href={twoFaHref}
                  >
                    Dokończ logowanie
                  </Link>
                  <form action={logoutAdminAction} className="mb-2">
                    <button
                      type="submit"
                      className="w-full rounded-md py-2.5 text-center text-sm font-semibold text-[#f6e9d6] underline decoration-[#d5b47a]/75"
                    >
                      Wyloguj
                    </button>
                  </form>
                </>
              ) : null}
              {isAdminFull ? (
                <>
                  <Link
                    onClick={() => setOpen(false)}
                    className="mb-2 block w-full rounded-md border border-[#b8955c]/70 bg-white/75 py-2.5 text-center text-sm font-medium text-[#2e2926]"
                    href="/admin"
                  >
                    Panel admina
                  </Link>
                  <form action={logoutAdminAction} className="mb-2">
                    <button
                      type="submit"
                      className="w-full rounded-md py-2.5 text-center text-sm font-semibold text-[#f6e9d6] underline decoration-[#d5b47a]/75"
                    >
                      Wyloguj
                    </button>
                  </form>
                </>
              ) : null}
              {isClient && !isAdminFull ? (
                <>
                  <Link
                    onClick={() => setOpen(false)}
                    className="mb-2 block w-full rounded-md border border-[#e5c48c]/70 bg-[#fff4e2] py-2.5 text-center text-sm font-semibold text-[#2e2926]"
                    href="/dashboard"
                  >
                    Moje konto
                  </Link>
                  <form action={logoutClientAction} className="mb-2">
                    <button
                      type="submit"
                      className="w-full rounded-md py-2.5 text-center text-sm font-semibold text-[#f6e9d6] underline decoration-[#d5b47a]/75"
                    >
                      Wyloguj
                    </button>
                  </form>
                </>
              ) : null}
              {showAuthButtons ? (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openLogin();
                    }}
                    className="mb-2 block w-full rounded-md border border-[#e5c48c]/70 bg-[#fff4e2] px-4 py-2.5 text-center text-sm font-semibold text-[#2e2926]"
                  >
                    Zaloguj się
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openRegister();
                    }}
                    className="block w-full rounded-md border border-[#d9b57a]/70 bg-[#c69a58] px-4 py-2.5 text-center text-sm font-semibold text-[#1c1612]"
                  >
                    Załóż konto
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
