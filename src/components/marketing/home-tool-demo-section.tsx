import Image from "next/image";
import Link from "next/link";

/**
 * Sekcja pod „Jak to działa?”: zachęta do założenia konta i poznania darmowych możliwości.
 * Obraz krawędziami do lewej, góry i dołu sekcji (breakpoint lg+).
 */
export function HomeToolDemoSection() {
  return (
    <section
      id="narzedzie-testowe"
      className="scroll-mt-wa overflow-hidden border-b border-[#e1d2bc]/70 bg-[#fdfbf7]"
      aria-labelledby="sekcja-darmowe-mozliwosci"
    >
      <div className="grid min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1.07fr)_minmax(340px,0.93fr)] lg:min-h-[28rem] xl:min-h-[32rem]">
        {/* Obraz: pełna szerokość kolumny, przylega do lewej, góry i dołu sekcji */}
        <div className="relative isolate min-h-[14rem] w-full overflow-hidden max-lg:aspect-[21/13] lg:min-h-[28rem] xl:min-h-[32rem]">
          <Image
            src="/images/flowers1.jpg"
            alt="Stół weselny z kwiatami i świecami — klimat uroczystości."
            fill
            className="object-cover object-[50%_45%]"
            sizes="(min-width: 1024px) 55vw, 100vw"
            quality={92}
          />
        </div>

        {/* Treść: odstępy tylko wewnątrz prawej kolumny */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-14 xl:py-16 2xl:pr-[max(2.25rem,calc((100vw-1180px)/2))]">
          <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:max-w-lg lg:text-left xl:max-w-xl">
            <div className="mb-4 flex justify-center gap-3 text-[#b79463] lg:justify-start">
              <span className="h-px w-10 self-center bg-gradient-to-r from-transparent to-[#c8a575]/55" aria-hidden />
              <span className="text-[10px] uppercase tracking-[0.22em]">Bezpłatny start</span>
              <span className="h-px w-10 self-center bg-gradient-to-l from-transparent to-[#c8a575]/55" aria-hidden />
            </div>
            <h2
              id="sekcja-darmowe-mozliwosci"
              className="font-wa-display text-balance text-[1.55rem] font-semibold tracking-[0.02em] text-[#2f2720] sm:text-[1.85rem]"
            >
              Odkryjcie możliwości Weddingassistant — w pełni za darmo
            </h2>
            <p className="mx-auto mt-4 max-w-prose text-pretty text-sm leading-[1.78] text-[#5f564d] sm:text-base lg:mx-0">
              Załóżcie konto i od razu zyskajcie spokojną przestrzeń do planowania. W ramach planu bez opłat
              przeglądacie funkcje przygotowane z myślą o Was — bez karty, bez pośpiechu, we własnym tempie.
            </p>
            <ul className="mx-auto mt-6 max-w-prose space-y-2.5 text-left text-sm text-[#4b4540] sm:text-[0.9375rem] lg:mx-0">
              <li className="flex gap-3">
                <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a575]" aria-hidden />
                <span>podgląd listy gości, RSVP i podsumowań przygotowań zaraz po wejściu do panelu</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a575]" aria-hidden />
                <span>checklisty, plan dnia i porządek w zadaniach — wszystko w jednym, czytelnym miejscu</span>
              </li>
              <li className="flex gap-3">
                <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a575]" aria-hidden />
                <span>gdy będziecie gotowi, możecie bez skoków przejść na pakiet dopasowany do Waszych oczekiwań</span>
              </li>
            </ul>
            <p className="mt-8 flex justify-center lg:justify-start">
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#d2b27e]/70 bg-[#d7b173] px-7 py-2.5 text-sm font-semibold text-[#2b2117] shadow-[0_12px_36px_-18px_rgba(32,23,14,0.58)] transition hover:brightness-105"
                href="/rejestracja"
              >
                <span>Załóż darmowe konto</span>
                <span aria-hidden className="h-4 w-px bg-[#6d5332]/45" />
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
