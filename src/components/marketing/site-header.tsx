"use client";

import Link from "next/link";
import { useState } from "react";

const nav = [
  { href: "/#funkcje", label: "Funkcje" },
  { href: "/cennik", label: "Cennik" },
  { href: "/#demo", label: "Demo" },
  { href: "/#kontakt", label: "Kontakt" },
] as const;

function WaMark() {
  return (
    <span
      className="inline-flex h-9 w-9 select-none items-center justify-center rounded-full border border-[#B8955C] bg-gradient-to-b from-white to-[#F5E9D3] text-[0.6rem] font-serif font-bold tracking-tight text-[#8A6A3A] ring-1 ring-inset ring-[#E3CDA3]"
      aria-hidden
    >
      WA
    </span>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E8DCC4]/60 bg-[#FDF8F0]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center gap-2">
          <span className="shrink-0" aria-hidden>
            <WaMark />
          </span>
          <span className="truncate font-serif text-base font-semibold tracking-tight text-[#2B2B2B] sm:text-lg">
            Weddingassistant.pl
          </span>
        </Link>

        <nav
          className="hidden items-center gap-1 text-sm text-[#3A3A3A] md:flex"
          aria-label="Nawigacja główna"
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              className="rounded-md px-3 py-2 transition hover:bg-white/60"
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Link
            className="rounded-md border border-[#B8955C] px-4 py-2 text-sm font-medium text-[#2B2B2B] transition hover:bg-white/70"
            href="/logowanie?k=client"
          >
            Zaloguj się
          </Link>
          <Link
            className="rounded-md bg-[#B8955C] px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-105"
            href="/rejestracja"
            aria-label="Załóż darmowe konto"
          >
            Załóż konto
          </Link>
        </div>

        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border border-[#D9C6A0] bg-white/60 text-[#2B2B2B] shadow-sm"
            aria-controls="wa-mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="sr-only">Menu</span>
            <span className="text-base font-semibold">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {open ? (
        <div
          className="border-t border-[#E8DCC4]/60 bg-[#FDF8F0] md:hidden"
          id="wa-mobile-menu"
        >
          <div className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            {nav.map((item) => (
              <Link
                key={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-md px-3 py-2 text-sm text-[#2B2B2B] hover:bg-white/70"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-2">
              <Link
                onClick={() => setOpen(false)}
                className="mb-2 block w-full rounded-md border border-[#B8955C] px-4 py-2.5 text-center text-sm font-medium"
                href="/logowanie?k=client"
              >
                Zaloguj się
              </Link>
              <Link
                onClick={() => setOpen(false)}
                className="block w-full rounded-md bg-[#B8955C] px-4 py-2.5 text-center text-sm font-medium text-white"
                href="/rejestracja"
              >
                Załóż konto
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
