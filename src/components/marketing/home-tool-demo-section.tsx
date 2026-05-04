import Image from "next/image";
import Link from "next/link";

/**
 * Sekcja pod „Funkcjami”: wizualny podgląd panelu / narzędzia (placeholder graficzny).
 */
export function HomeToolDemoSection() {
  return (
    <section
      id="narzedzie-testowe"
      className={`scroll-mt-wa border-b border-[#e8e2dc]/70 bg-[#f9f6f0]`}
      aria-labelledby="sekcja-narzedzie-testowe"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10 sm:px-6 sm:py-14 lg:flex-row lg:items-center lg:gap-12">
        <div className="min-w-0 flex-1">
          <h2
            className="font-wa-display text-balance text-xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-2xl"
            id="sekcja-narzedzie-testowe"
          >
            Przykładowa testowa strona — działanie asystenta
          </h2>
          <p className="mt-3 max-w-prose text-pretty text-sm leading-relaxed text-[#5a534c] sm:text-base">
            Poniżej przykładowy widok z panelu (statystyki / podsumowanie) — taki układ możecie zobaczyć po zalogowaniu.
            Docelowo w tej strefie pojawią się krótkie przewodniki po RSVP, planie dnia i kolejnych modułach.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-[#4b4540] sm:text-[0.9375rem]">
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8955C]" aria-hidden />
              <span>Lista gości, RSVP i przypomnienia w jednym miejscu</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8955C]" aria-hidden />
              <span>Plan ślubu, checklisty i szybki podgląd postępu</span>
            </li>
            <li className="flex gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B8955C]" aria-hidden />
              <span>
                Więcej w sekcji{" "}
                <Link className="font-medium text-[#6B5427] underline underline-offset-2" href="/#funkcje">
                  Funkcje
                </Link>
              </span>
            </li>
          </ul>
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
