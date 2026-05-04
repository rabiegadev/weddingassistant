"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { logoutAdminAction, logoutClientAction } from "@/app/actions/auth";
import { useAuthModal } from "@/components/auth/auth-modal-context";

const nav = [
  { href: "/#funkcje", label: "Funkcje" },
  { href: "/#narzedzie-testowe", label: "Test narzędzia" },
  { href: "/#strona-wesela", label: "Strona wesela" },
  { href: "/#oferta", label: "Oferta" },
  { href: "/cennik", label: "Cennik" },
  { href: "/realizacje", label: "Realizacje" },
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
      className={`group relative font-normal text-[#3a3530] tracking-[0.028em] transition-colors ${
        variant === "desktop" ? "whitespace-nowrap px-3 py-2 text-sm" : "block px-3 py-2.5 text-sm"
      }`}
    >
      <span className="relative z-10">{label}</span>
      <span
        aria-hidden
        className={`pointer-events-none absolute bottom-1 left-1/2 z-[5] h-[2px] ${lineWidth} -translate-x-1/2 rounded-full bg-gradient-to-r from-transparent via-[#f8e4b0] via-[#ecc267] to-transparent shadow-[0_0_10px_rgba(248,228,176,0.55)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] [transform-origin:center] ${
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
  const [visible, setVisible] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const lastY = useRef(0);
  const showAuthButtons = !isClient && !isAdminFull && !isAdmin2faPending;

  useEffect(() => {
    lastY.current = typeof window !== "undefined" ? window.scrollY : 0;
  }, []);

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

  useEffect(() => {
    const hideBar = () => {
      setVisible(false);
      setOpen(false);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;

      if (y <= 6) {
        hideBar();
      } else if (delta > 1.5) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 w-full border-b transition-[opacity,transform,background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out ${
        visible
          ? "pointer-events-auto translate-y-0 border-white/[0.22] bg-[#ebe6df]/34 opacity-100 shadow-[0_12px_40px_-22px_rgba(38,32,26,0.35)] backdrop-blur-xl backdrop-saturate-[1.12]"
          : "pointer-events-none -translate-y-2 border-transparent bg-transparent opacity-0 backdrop-blur-none"
      }`}
      aria-hidden={!visible}
    >
      <div className="flex w-full items-center gap-3 px-4 py-2 sm:gap-4 sm:px-6 sm:py-2.5">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 lg:gap-3">
          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-md sm:h-10 sm:w-10">
            <Image
              src="/images/icon.png"
              alt=""
              fill
              className="object-contain brightness-[0.58] contrast-[1.08] saturate-[0.95]"
              sizes="40px"
              priority
            />
          </span>
          <span className="truncate font-serif text-lg font-light tracking-[0.06em] text-[#2e2926] sm:text-xl">
            Weddingassistant
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-4 lg:gap-5">
          <nav className="hidden items-center lg:flex" aria-label="Nawigacja główna">
            {nav.map((item) => (
              <MarketingNavLink
                key={item.href}
                href={item.href}
                label={item.label}
                active={isNavHrefActive(item.href, pathname, activeSectionId)}
              />
            ))}
          </nav>

          <div className="hidden shrink-0 items-center gap-2 lg:flex">
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
                    className="rounded-md px-3 py-1.5 text-sm font-medium tracking-[0.02em] text-[#5c544c] underline decoration-[#b8955c]/65 underline-offset-2 hover:decoration-[#9a7a45]"
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
                    className="rounded-md px-3 py-1.5 text-sm font-medium tracking-[0.02em] text-[#5c544c] underline decoration-[#b8955c]/65 underline-offset-2 hover:decoration-[#9a7a45]"
                  >
                    Wyloguj
                  </button>
                </form>
              </>
            ) : null}
            {isClient && !isAdminFull ? (
              <>
                <Link
                  className="rounded-md border border-[#b8955c]/65 bg-white/55 px-3 py-1.5 text-sm font-medium tracking-[0.02em] text-[#2e2926] transition hover:bg-white/85"
                  href="/dashboard"
                >
                  Moje konto
                </Link>
                <form action={logoutClientAction}>
                  <button
                    type="submit"
                    className="rounded-md px-3 py-1.5 text-sm font-medium tracking-[0.02em] text-[#5c544c] underline decoration-[#b8955c]/65 underline-offset-2 hover:decoration-[#9a7a45]"
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
                  className="rounded-md border border-[#b8955c]/70 bg-white/55 px-3 py-1.5 text-sm font-medium tracking-[0.02em] text-[#2e2926] transition hover:bg-white/85"
                  onClick={() => openLogin()}
                >
                  Zaloguj się
                </button>
                <button
                  type="button"
                  className="rounded-md bg-[#B8955C] px-3 py-1.5 text-sm font-medium tracking-[0.02em] text-[#1c1612] shadow-sm transition hover:brightness-110"
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
                      className="w-full rounded-md py-2.5 text-center text-sm text-[#5c544c] underline decoration-[#b8955c]/60"
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
                      className="w-full rounded-md py-2.5 text-center text-sm text-[#5c544c] underline decoration-[#b8955c]/60"
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
                    className="mb-2 block w-full rounded-md border border-[#b8955c]/70 bg-white/75 py-2.5 text-center text-sm text-[#2e2926]"
                    href="/dashboard"
                  >
                    Moje konto
                  </Link>
                  <form action={logoutClientAction} className="mb-2">
                    <button
                      type="submit"
                      className="w-full rounded-md py-2.5 text-center text-sm text-[#5c544c] underline decoration-[#b8955c]/60"
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
                    className="mb-2 block w-full rounded-md border border-[#b8955c]/70 bg-white/75 px-4 py-2.5 text-center text-sm font-medium text-[#2e2926]"
                  >
                    Zaloguj się
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOpen(false);
                      openRegister();
                    }}
                    className="block w-full rounded-md bg-[#B8955C] px-4 py-2.5 text-center text-sm font-medium text-[#1c1612]"
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
