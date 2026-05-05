import Image from "next/image";
import Link from "next/link";

/**
 * Sekcja pod „Funkcjami”: wizualny podgląd panelu / narzędzia (placeholder graficzny).
 */
export function HomeToolDemoSection() {
  return (
    <section
      id="narzedzie-testowe"
      className="scroll-mt-wa border-b border-[#e1d2bc]/70 bg-[#fdfbf7]"
      aria-labelledby="sekcja-narzedzie-testowe"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:flex-row lg:items-center lg:gap-12">
        <div className="min-w-0 flex-1">
          <h2
            className="font-wa-display text-balance text-xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-2xl"
            id="sekcja-narzedzie-testowe"
          >
            Sprawdź panel asystenta i przetestuj narzędzia
          </h2>
          <p className="mt-3 max-w-prose text-pretty text-sm leading-relaxed text-[#5a534c] sm:text-base">
            Załóż darmowe konto i zobacz, jak działa Weddingassistant w praktyce. Bez karty płatniczej sprawdzisz
            najważniejsze moduły planowania wesela i zdecydujesz, czy chcesz rozszerzyć pakiet.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[#4b4540] sm:text-[0.9375rem]">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8955C]" aria-hidden />
              <span>podgląd listy gości, RSVP i statusów przygotowań</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8955C]" aria-hidden />
              <span>checklisty, plan dnia i organizacja zadań w jednym miejscu</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8955C]" aria-hidden />
              <span>
                po zalogowaniu możesz płynnie przejść na wyższy plan, gdy będziesz gotowy
              </span>
            </li>
          </ul>
          <p className="mt-6">
            <Link
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#B8955C] px-6 py-2.5 text-sm font-semibold text-white shadow transition hover:brightness-105"
              href="/rejestracja"
            >
              Załóż darmowe konto
            </Link>
          </p>
        </div>
        <div className="relative mx-auto w-full max-w-xl shrink-0 lg:max-w-md">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#e0d6cc] bg-white shadow-[0_20px_50px_-28px_rgba(45,38,30,0.35)]">
            <Image
              src="/images/stats.png"
              alt="Przykładowy widok statystyk w panelu Weddingassistant"
              fill
              className="object-contain p-3 sm:p-4"
              sizes="(min-width: 1024px) 28rem, 100vw"
            />
          </div>
          <p className="mt-2 text-center text-xs text-[#7a726a]">Ilustracja poglądowa — nie jest to interaktywne demo.</p>
        </div>
      </div>
    </section>
  );
}
