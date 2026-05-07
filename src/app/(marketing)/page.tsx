import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { HomeFeaturesSection } from "@/components/marketing/home-features-section";
import { HomeOfferSection } from "@/components/marketing/home-offer-section";
import { HomeToolDemoSection } from "@/components/marketing/home-tool-demo-section";
import { HomeWeddingSitesSection } from "@/components/marketing/home-wedding-sites-section";
import { HomeContactForm } from "@/components/marketing/home-contact-form";

function OfferSectionFallback() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="h-[560px] animate-pulse rounded-2xl border border-[#d9c5a5]/60 bg-[#f3eadf]"
        />
      ))}
    </div>
  );
}

function HeroBackground() {
  const blurMask =
    "linear-gradient(to right, black 0%, black 16%, rgba(0,0,0,0.62) 38%, rgba(0,0,0,0.28) 62%, rgba(0,0,0,0.08) 82%, transparent 100%)";

  return (
    <div className="pointer-events-none absolute inset-0">
      <Image
        src="/images/bazkgr.png"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(52,38,25,0.72)_0%,rgba(76,56,36,0.62)_16%,rgba(104,77,49,0.44)_38%,rgba(140,106,70,0.28)_62%,rgba(186,146,100,0.14)_82%,rgba(255,255,255,0)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 backdrop-blur-[min(22px,3.2vw)] backdrop-saturate-[1.06]"
        style={{ WebkitMaskImage: blurMask, maskImage: blurMask }}
        aria-hidden
      />
    </div>
  );
}

const SECTION_A = "bg-[#f7f1e7]"; // lekko beżowy
const SECTION_B = "bg-[#fdfbf7]"; // brudna biel
const SECTION_C = "bg-[#e9dccb]"; // średnio jasny brązowy

export default function HomePage() {
  return (
    <main>
      <section
        className="relative -mt-[var(--wa-sticky-offset)] isolate flex min-h-[max(100svh,100dvh)] flex-col overflow-hidden border-b border-[#E8DCC4]/45 pt-[var(--wa-sticky-offset)]"
        aria-label="Weddingassistant — strona główna"
      >
        <HeroBackground />
        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 pb-8 pt-10 sm:px-8 lg:px-14 lg:pb-12 lg:pt-14">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="font-wa-display text-balance text-3xl font-semibold tracking-[0.02em] text-[#f6efe6] drop-shadow-[0_1px_8px_rgba(15,11,7,0.45)] sm:text-4xl lg:text-5xl">
              Weddingassistant
            </h1>
            <p className="mt-4 font-wa-display text-balance text-lg font-medium leading-snug text-[#f0e3d2] sm:text-xl lg:text-2xl">
              Zaplanujcie ten wyjątkowy dzień z maksymalną starannością dzięki naszemu wsparciu
            </p>
            <p className="mt-5 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-[#eadbca] sm:text-base">
              Nasza platforma powstała aby ułatwić proces planowania wesela oraz zebrać wszystkie niezbędne informacje w
              jednym miejscu, które jest dla Was dostępne w każdej chwili.
            </p>
            <p className="mt-8">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#d2b27e]/70 bg-[#d7b173] px-7 py-2.5 text-sm font-semibold text-[#2b2117] shadow-[0_12px_36px_-18px_rgba(32,23,14,0.65)] transition hover:brightness-105"
                href="/#oferta"
              >
                Sprawdź możliwości, które oferuje Weddingassistant
              </Link>
            </p>
          </div>
        </div>
        <div className="relative z-10 mt-auto flex justify-center pb-7">
          <a
            href="#funkcje"
            className="flex flex-col items-center gap-1 text-[#6b5d4d] transition hover:text-[#4a4036]"
            aria-label="Przewiń do sekcji Funkcje"
          >
            <span className="text-[0.65rem] font-medium uppercase tracking-[0.22em] opacity-80">Dalej</span>
            <svg
              className="animate-wa-scroll-arrow h-8 w-8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              aria-hidden
            >
              <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </section>

      <section
        id="funkcje"
        className={`scroll-mt-wa border-b border-[#e1d2bc]/70 ${SECTION_A}`}
        aria-labelledby="sekcja-funkcje"
      >
        <div className="mx-auto w-[min(100%,96vw)] max-w-[1800px] px-4 pb-4 pt-6 text-center sm:px-6 sm:pb-5 sm:pt-7 lg:text-left">
          <h2
            className="font-wa-display text-balance text-xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-2xl"
            id="sekcja-funkcje"
          >
            Funkcje
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-pretty text-xs leading-snug text-[#5a534c] sm:text-sm lg:mx-0">
            Jedna platforma dla Was i gości — przejrzysty przegląd narzędzi bez zbędnego „szumu” wizualnego.
          </p>
        </div>
        <HomeFeaturesSection />
      </section>

      <HomeToolDemoSection />

      <HomeWeddingSitesSection />

      <section
        id="oferta"
        className={`scroll-mt-wa border-b border-[#dcc9ab]/70 ${SECTION_A}`}
        aria-labelledby="sekcja-oferta"
      >
        <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
          <h2
            className="font-wa-display text-xl font-medium tracking-[0.02em] text-[#2E2A26] sm:text-2xl"
            id="sekcja-oferta"
          >
            Oferowane funkcjonalności i cennik
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#4A4A4A] sm:text-base">
            Poniżej pakiety takie same jak w{" "}
            <Link className="font-medium text-[#6B5427] underline underline-offset-2" href="/cennik">
              cenniku
            </Link>{" "}
            — wybierzesz, co odpowiada Twojemu weselu, a potem w panelu dopracujesz szczegóły z obsługą.
          </p>
          <Suspense fallback={<OfferSectionFallback />}>
            <HomeOfferSection />
          </Suspense>
        </div>
      </section>

      <section
        id="kontakt"
        className={`scroll-mt-wa border-b border-[#e1d2bc]/70 ${SECTION_B}`}
        aria-labelledby="sekcja-kontakt"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
          <h2 className="font-wa-display text-xl font-medium tracking-[0.02em] text-[#2E2A26] sm:text-2xl" id="sekcja-kontakt">
            Kontakt
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#4A4A4A] sm:text-base">
            Masz pytania o pakiety lub współpracę? Napisz przez formularz lub bezpośrednio — odpowiadamy możliwie szybko.
          </p>
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-8">
            <div className="rounded-xl border border-[#ece6dc] bg-[#fcfaf6] p-4 sm:p-5">
              <ul className="space-y-4 text-sm text-[#2B2B2B] sm:text-base">
                <li>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#75695d]">E-mail</p>
                  <a className="mt-1 inline-block font-medium text-[#6B5427] underline break-all" href="mailto:kontakt@weddingassistant.pl">
                    kontakt@weddingassistant.pl
                  </a>
                </li>
                <li>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#75695d]">Telefon</p>
                  <a className="mt-1 inline-block font-medium text-[#2B2B2B] underline" href="tel:+48793745717">
                    +48 793 745 717
                  </a>
                </li>
                <li>
                  <p className="text-xs font-medium uppercase tracking-wide text-[#75695d]">Studio</p>
                  <a
                    className="mt-1 inline-block font-medium text-[#6B5427] underline"
                    href="https://rabiegadevelopment.pl"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    rabiegadevelopment.pl
                  </a>
                </li>
              </ul>
            </div>
            <HomeContactForm
              sourcePage="/#kontakt"
              compact
              className="h-full rounded-xl border border-[#ece6dc] bg-[#fdfcfa] p-4 sm:p-5"
            />
          </div>
        </div>
      </section>

      <section className={`border-b border-[#d8c5a7]/70 ${SECTION_C}`} aria-labelledby="sekcja-faq">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
          <h2 className="font-wa-display text-xl font-medium tracking-[0.02em] text-[#2E2A26] sm:text-2xl" id="sekcja-faq">
            FAQ
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#4f463d] sm:text-base">
            Najczęstsze pytania o działanie pakietów, konfigurację strony weselnej i start współpracy.
          </p>
          <div className="mt-6 grid grid-cols-1 gap-4">
            {[
              {
                q: "Czy mogę zacząć od darmowego planu i później przejść wyżej?",
                a: "Tak. Możesz zacząć bez kosztów, a gdy będziesz gotowy, przejść na pakiet płatny bez zakładania nowego konta.",
              },
              {
                q: "Czy wizytówkę weselną można dopasować do naszych danych?",
                a: "Tak. Imiona, zdjęcia, harmonogram, adresy i najważniejsze sekcje są konfigurowane pod Waszą parę.",
              },
              {
                q: "Ile trwa uruchomienie strony weselnej?",
                a: "Dla szablonu zwykle trwa to krótko po zebraniu danych, a projekt personalizowany realizujemy według briefu i ustalonego harmonogramu.",
              },
              {
                q: "Czy mogę liczyć na pomoc po starcie?",
                a: "Tak. W ramach obsługi pomagamy we wdrożeniu, zmianach treści i bieżących pytaniach dotyczących panelu.",
              },
            ].map((item) => (
              <details key={item.q} className="group rounded-xl border border-[#d0b693]/75 bg-[#f8f2e9] p-0 shadow-sm">
                <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left">
                  <span className="font-wa-display text-base font-semibold text-[#2f2923]">{item.q}</span>
                  <span className="shrink-0 text-lg leading-none text-[#8a6f48] transition group-open:rotate-45">+</span>
                </summary>
                <div className="border-t border-[#e2d1b8] px-4 py-3">
                  <p className="text-sm leading-relaxed text-[#554a3f]">{item.a}</p>
                </div>
              </details>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <Link
              href="/faq"
              className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#B8955C] bg-white px-7 py-2.5 text-sm font-semibold text-[#4a3820] shadow-sm transition hover:bg-[#faf6ef]"
            >
              Pełna lista FAQ
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
