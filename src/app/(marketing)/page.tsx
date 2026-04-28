import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { HomeOfferSection } from "@/components/marketing/home-offer-section";
import { PlatformToolTile } from "@/components/marketing/platform-tool-tile";
import { platformTools } from "@/data/platform-tools";

function OfferSectionFallback() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-2xl border border-[#E8DCC4]/50 bg-gradient-to-b from-white to-[#F5E9D3]/40"
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

function SoftBackdrop({ src }: { src: "/images/bg3.jpg" | "/images/bg5.jpg" }) {
  const rich = src.endsWith("bg5.jpg");
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <Image
        src={src}
        alt=""
        fill
        priority={false}
        className={
          rich
            ? "scale-105 object-cover opacity-52 blur-[0.35px]"
            : "scale-105 object-cover opacity-34 blur-[0.6px]"
        }
      />
      <div
        className={
          rich ? "absolute inset-0 bg-[#FDF8F0]/44" : "absolute inset-0 bg-[#FDF8F0]/62"
        }
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      <section
        className="relative isolate flex min-h-wa-section flex-col overflow-x-clip border-b border-[#E8DCC4]/60 bg-gradient-to-b from-[#FDF8F0] via-[#FAF2E4] to-[#F4EBDC]"
        aria-label="Nagłówek"
      >
        <SoftBackdrop src="/images/bg5.jpg" />
        <div className="relative mx-auto flex w-full min-h-0 max-w-6xl flex-1 flex-col justify-center px-4 pb-10 pt-24 sm:px-6 sm:pb-14 sm:pt-32">
          <div className="grid w-full min-h-0 items-stretch gap-10 lg:grid-cols-2">
            <div className="flex h-full min-h-0 max-w-xl flex-col gap-6 lg:justify-between lg:gap-8">
              <header className="shrink-0 space-y-3">
                <p className="max-w-full break-words text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-[#8A765E] sm:text-[0.65rem] sm:tracking-[0.28em]">
                  Weddingassistant //
                </p>
                <h1 className="font-wa-display text-balance text-lg font-bold leading-snug tracking-[0.01em] text-[#2E2A26] sm:text-xl">
                  Twoje wsparcie przedweselne online
                </h1>
              </header>

              <div className="flex min-h-0 flex-col gap-5 text-[0.8125rem] leading-[1.68] text-[#4F4A45] sm:text-sm">
                <p className="text-pretty">
                  Dziękujemy za wizytę na naszej stronie — a skoro już tutaj się widzimy… to najpewniej
                  planujecie wielkimi krokami ten piękny i&nbsp;wyczekiwany dzień!
                </p>
                <p className="text-pretty">
                  Tak się składa, że wraz z&nbsp;moją jeszcze wtedy narzeczoną byliśmy rok temu w&nbsp;tym samym
                  miejscu:
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
                  Było tego tak dużo, że zdarzało się o&nbsp;czymś zapomnieć, spóźnić się, na&nbsp;ostatnią chwilę
                  zamawiać i&nbsp;tracić bardzo dużo czasu. Sprawdzałem różne aplikacje oraz serwisy, żeby wygenerować
                  sobie checklisty, zrobić nieco bardziej rozbudowany spis gości czy rozłożyć gości przy stołach —
                  ale wszystko kończyło się brakiem możliwości dopasowania do&nbsp;naszych wymagań.
                </p>
                <p className="text-pretty">
                  W&nbsp;związku z&nbsp;nieubłaganie pędzącym czasem postanowiłem wykorzystać swoje zainteresowania
                  i&nbsp;doświadczenie, żeby przygotować różnego rodzaju „helpery” weselne na&nbsp;własny użytek.
                  Własny użytek zmienił się w&nbsp;przesyłanie aplikacji znajomym i&nbsp;naturalną siłą rzeczy
                  pojawił się pomysł na&nbsp;udostępnienie tych narzędzi online szerszej grupie odbiorców.
                </p>
              </div>
            </div>

            <div className="relative flex h-full min-h-0 flex-col items-center justify-center pt-8 sm:pt-12">
              <div className="relative mx-auto aspect-[2/3] w-full max-w-[420px] overflow-hidden rounded-3xl border border-[#DCC6A2]/90 bg-white/72 p-2 shadow-[0_22px_60px_-36px_rgba(62,44,18,0.55)]">
                <Image
                  src="/images/header_good.png"
                  alt="Podgląd planowania wesela w Weddingassistant"
                  fill
                  priority
                  className="rounded-[1.25rem] object-cover object-center"
                  sizes="(min-width: 1024px) 420px, 92vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="funkcje"
        className="relative isolate flex min-h-wa-section flex-col border-b border-[#E8DCC4]/60 bg-white scroll-mt-wa"
        aria-labelledby="sekcja-funkcje"
      >
        <SoftBackdrop src="/images/bg3.jpg" />
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
          <h2
            className="font-wa-display text-balance text-xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-2xl"
            id="sekcja-funkcje"
          >
            Jakie dokładnie narzędzia oraz usługi oferujemy?
          </h2>
          <p className="mt-4 max-w-3xl text-[0.8125rem] leading-[1.7] text-[#5A534C] sm:text-sm">
            Na tę chwilę nie wszystkie z przedstawionych poniżej rozwiązań są dostępne w pełni albo w ogóle.
            Część z nich jest naprawdę praktyczna i niesie dużo pomocy, lecz nie wszystkie zostały
            przygotowane do użytkowania przez osoby, które nie miały z nimi wcześniej styczności: brakuje
            opisów „krok po kroku”, brakuje niektórych etapów w działaniu — część kroków pomijałem u siebie, a
            innym ją włączałem.{" "}
            <span className="text-pretty">
              Obserwujcie na bieżąco, aby dowiadywać się o postępach, a jeśli czegoś tu brakuje, zapraszam do
              zgłaszania nowych pomysłów.
            </span>
          </p>
          <ul className="mt-10 grid list-none grid-cols-1 gap-6 md:grid-cols-2 md:gap-7">
            {platformTools.map((tool) => (
              <li key={tool.id}>
                <PlatformToolTile tool={tool} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="oferta"
        className="relative isolate flex min-h-wa-section flex-col border-b border-[#B8955C]/15 bg-gradient-to-b from-[#2D4A32]/[0.04] to-[#F9F0E0]/50 scroll-mt-wa"
        aria-labelledby="sekcja-oferta"
      >
        <SoftBackdrop src="/images/bg5.jpg" />
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
        id="cennik"
        className="relative isolate flex min-h-wa-section flex-col border-b border-[#E8DCC4]/60 bg-white scroll-mt-wa"
        aria-labelledby="sekcja-cennik"
      >
        <SoftBackdrop src="/images/bg3.jpg" />
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
          <h2 className="font-wa-display text-xl font-medium tracking-[0.02em] text-[#2E2A26] sm:text-2xl" id="sekcja-cennik">
            Pełny cennik
          </h2>
          <p className="mt-2 text-sm text-[#4A4A4A] sm:text-base">
            Porównaj pakiety i opisy w jednej tabeli — ceny w zł, bez ukrytych sekcji.
          </p>
          <p className="mt-4">
            <Link
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#B8955C] px-6 text-sm font-semibold text-white transition hover:brightness-105"
              href="/cennik"
            >
              Przejdź do cennika
            </Link>
          </p>
        </div>
      </section>

      <section
        id="demo"
        className="relative isolate flex min-h-wa-section flex-col bg-[#F8F2E8]/30 scroll-mt-wa"
        aria-labelledby="sekcja-demo"
      >
        <SoftBackdrop src="/images/bg5.jpg" />
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-10 sm:px-6 sm:py-14">
          <h2 className="font-wa-display text-xl font-medium tracking-[0.02em] text-[#2E2A26] sm:text-2xl" id="sekcja-demo">
            Strefa demo
          </h2>
          <p className="mt-2 text-sm text-[#4A4A4A] sm:text-base">
            Wkrótce: krótkie przewodniki po RSVP, planie dnia i innych modułach. Na dziś — utrzymujemy
            w menu miejsce na rozwijane demonstracje.
          </p>
        </div>
      </section>

      <section
        id="kontakt"
        className="relative isolate flex min-h-wa-section flex-col border-b border-[#E8DCC4]/40 bg-gradient-to-b from-white to-[#FDF8F0] scroll-mt-wa"
        aria-labelledby="sekcja-kontakt"
      >
        <SoftBackdrop src="/images/bg3.jpg" />
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
        className="relative isolate flex min-h-wa-section flex-col bg-[#E8C99B]/[0.2]"
        aria-label="Zaproszenie do rejestracji"
      >
        <SoftBackdrop src="/images/bg5.jpg" />
        <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-stretch justify-center gap-4 px-4 py-10 text-center sm:px-6 sm:py-14">
          <h2 className="font-wa-display text-xl font-medium tracking-[0.02em] text-[#2E2A26] sm:text-2xl">
            Z Weddingassistant praca nad weselem może być w jednym, przejrzystym miejscu.
          </h2>
          <p className="text-sm text-[#4A4A4A] sm:text-base">Możesz zacząć od darmowego konta — bez karty płatniczej.</p>
          <div className="pt-1">
            <Link
              className="inline-flex h-12 min-w-[16rem] items-center justify-center rounded-md bg-[#B8955C] px-8 text-sm font-semibold text-white shadow transition hover:brightness-105"
              href="/rejestracja"
            >
              Załóż darmowe konto
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
