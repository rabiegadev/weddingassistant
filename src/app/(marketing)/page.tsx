import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { HomeFeaturesSection } from "@/components/marketing/home-features-section";
import { HomeOfferSection } from "@/components/marketing/home-offer-section";
import { HomeRegisterCta } from "@/components/marketing/home-register-cta";
import { HomeToolDemoSection } from "@/components/marketing/home-tool-demo-section";
import { HomeWeddingSitesSection } from "@/components/marketing/home-wedding-sites-section";

function OfferSectionFallback() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-2xl border border-[#e8e2dc]/60 bg-[#f3f1eb]"
        />
      ))}
    </div>
  );
}

const heroPrepItems = [
  "wypisywanie zaproszeń",
  "rozdawanie zaproszeń",
  "rozmieszczanie gości przy stolikach",
  "dopinanie umów z usługodawcami",
  "wybieranie dekoracji",
  "spotkania z wykonawcami i tak dalej",
] as const;

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
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.93)_0%,rgba(255,255,255,0.78)_14%,rgba(255,255,255,0.48)_36%,rgba(255,255,255,0.18)_62%,rgba(255,255,255,0.05)_82%,rgba(255,255,255,0)_100%)]"
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

/** Lekki beż naprzemiennie z białym — bez grafik tła. */
const SECTION_BEIGE = "bg-[#f9f6f0]";

export default function HomePage() {
  return (
    <main>
      <section
        className="relative isolate flex min-h-[max(100svh,100dvh)] flex-col overflow-hidden border-b border-[#E8DCC4]/45"
        aria-label="Weddingassistant — strona główna"
      >
        <HeroBackground />
        <div className="relative z-10 flex flex-1 flex-col justify-center px-4 pb-8 pt-10 sm:px-8 lg:px-14 lg:pb-12 lg:pt-14">
          <div className="max-w-xl lg:max-w-2xl">
            <h1 className="font-wa-display text-balance text-3xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-4xl lg:text-5xl">
              Weddingassistant
            </h1>
            <p className="mt-4 font-wa-display text-balance text-lg font-medium leading-snug text-[#3d3834] sm:text-xl lg:text-2xl">
              Zaplanujcie ten wyjątkowy dzień z maksymalną starannością dzięki naszemu wsparciu
            </p>
            <p className="mt-5 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-[#4b4540] sm:text-base">
              Nasza platforma powstała aby ułatwić proces planowania wesela oraz zebrać wszystkie niezbędne informacje w
              jednym miejscu, które jest dla Was dostępne w każdej chwili.
            </p>
            <p className="mt-8">
              <Link
                className="inline-flex min-h-11 items-center justify-center rounded-full bg-[#B8955C] px-7 py-2.5 text-sm font-semibold text-white shadow-[0_12px_36px_-18px_rgba(62,44,18,0.55)] transition hover:brightness-105"
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
        className="scroll-mt-wa border-b border-[#e8e2dc]/70 bg-white"
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
        className={`flex min-h-wa-section flex-col scroll-mt-wa border-b border-[#e8e2dc]/70 ${SECTION_BEIGE}`}
        aria-labelledby="sekcja-oferta"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
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
        className="flex min-h-wa-section flex-col scroll-mt-wa border-b border-[#e8e2dc]/70 bg-white"
        aria-labelledby="sekcja-kontakt"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
          <h2 className="font-wa-display text-xl font-medium tracking-[0.02em] text-[#2E2A26] sm:text-2xl" id="sekcja-kontakt">
            Kontakt
          </h2>
          <p className="mt-2 text-sm text-[#4A4A4A] sm:text-base">Masz pytania o pakiety lub współpracę? Napisz lub zadzwoń.</p>
          <ul className="mt-4 space-y-2 text-sm text-[#2B2B2B]">
            <li>
              <span className="text-[#5A5A5A]">E-mail: </span>
              <a className="font-medium text-[#6B5427] underline" href="mailto:kontakt@weddingassistant.pl">
                kontakt@weddingassistant.pl
              </a>
            </li>
            <li>
              <span className="text-[#5A5A5A]">Telefon: </span>
              <a className="font-medium text-[#2B2B2B] underline" href="tel:+48793745717">
                +48 793 745 717
              </a>
            </li>
            <li>
              <span className="text-[#5A5A5A]">Studio: </span>
              <a
                className="font-medium text-[#6B5427] underline"
                href="https://rabiegadevelopment.pl"
                rel="noopener noreferrer"
                target="_blank"
              >
                rabiegadevelopment.pl
              </a>
            </li>
          </ul>
        </div>
      </section>

      <section
        className={`flex min-h-wa-section flex-col border-b border-[#e8e2dc]/70 ${SECTION_BEIGE}`}
        aria-label="Zaproszenie do rejestracji"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-stretch justify-center gap-3 px-4 py-10 text-center sm:px-6 sm:py-12">
          <p className="text-sm text-[#4A4A4A] sm:text-base">Możesz zacząć od darmowego konta — bez karty płatniczej.</p>
          <div className="pt-1">
            <HomeRegisterCta />
          </div>
        </div>
      </section>

      <section
        id="historia"
        className={`scroll-mt-wa border-t border-[#e8e2dc]/70 ${SECTION_BEIGE}`}
        aria-labelledby="sekcja-historia"
      >
        <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <h2
            className="font-wa-display text-balance text-xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-2xl"
            id="sekcja-historia"
          >
            Nasza historia
          </h2>
          <div className="mt-6 space-y-5 text-[0.8125rem] leading-[1.68] text-[#4F4A45] sm:text-sm">
            <p className="text-pretty font-medium text-[#3d3834]">
              Weddingassistant — Twoje wsparcie przedweselne online
            </p>
            <p className="text-pretty">
              Dziękujemy za wizytę na naszej stronie — a skoro już tutaj się widzimy… to najpewniej planujecie
              wielkimi krokami ten piękny i&nbsp;wyczekiwany dzień!
            </p>
            <p className="text-pretty">
              Tak się składa, że wraz z&nbsp;moją jeszcze wtedy narzeczoną byliśmy rok temu w&nbsp;tym samym miejscu:
            </p>
            <ul
              className="list-none space-y-1.5 border-l-2 border-[#B8955C]/30 py-0.5 pl-4 text-[0.8rem] text-[#5A534C] sm:text-[0.8125rem]"
              aria-label="Przykładowe zadania przed ślubem"
            >
              {heroPrepItems.map((line) => (
                <li key={line} className="flex gap-2.5 text-pretty">
                  <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#B8955C]/55" aria-hidden />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <p className="text-pretty">
              Było tego tak dużo, że zdarzało się o&nbsp;czymś zapomnieć, spóźnić się, na&nbsp;ostatnią chwilę zamawiać
              i&nbsp;tracić bardzo dużo czasu. Sprawdzałem różne aplikacje oraz serwisy, żeby wygenerować sobie
              checklisty, zrobić nieco bardziej rozbudowany spis gości czy rozłożyć gości przy stołach — ale wszystko
              kończyło się brakiem możliwości dopasowania do&nbsp;naszych wymagań.
            </p>
            <p className="text-pretty">
              W&nbsp;związku z&nbsp;nieubłaganie pędzącym czasem postanowiłem wykorzystać swoje zainteresowania
              i&nbsp;doświadczenie, żeby przygotować różnego rodzaju „helpery” weselne na&nbsp;własny użytek. Własny
              użytek zmienił się w&nbsp;przesyłanie aplikacji znajomym i&nbsp;naturalną siłą rzeczy pojawił się pomysł
              na&nbsp;udostępnienie tych narzędzi online szerszej grupie odbiorców.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
