import Link from "next/link";
import { Suspense } from "react";
import { HomeOfferSection } from "@/components/marketing/home-offer-section";

const features = [
  {
    id: "guests",
    title: "Lista gości",
    desc: "Baza, statusy, zaproszenia, podgląd w jednym miejscu.",
  },
  {
    id: "rsvp",
    title: "RSVP online",
    desc: "Potwierdzenia, terminy, link do wydarzenia w jednej perspektywie.",
  },
  {
    id: "check",
    title: "Checklisty",
    desc: "Od formalności po catering, bez zapomnienia o szczegółach.",
  },
  {
    id: "qr",
    title: "Kody QR",
    desc: "Dostęp szybki, powtarzalny, wygodny dla gości.",
  },
  {
    id: "budget",
    title: "Budżet",
    desc: "Kontrola wydatków, plan, porównanie wariantów (w dalszych wersjach).",
  },
] as const;

function FeatureIcon({ k }: { k: string }) {
  if (k === "guests") {
    return (
      <div className="text-[#B8955C]" aria-hidden>
        <span className="text-2xl">▪</span>
        <span className="pl-0.5 text-2xl">▪</span>
      </div>
    );
  }
  if (k === "rsvp") {
    return (
      <div className="font-serif text-xs font-semibold tracking-wide text-[#B8955C]" aria-hidden>
        R·S·V·P
      </div>
    );
  }
  if (k === "check") {
    return <div className="text-2xl text-[#B8955C]">▣</div>;
  }
  if (k === "qr") {
    return <div className="text-2xl text-[#B8955C]">⬛</div>;
  }
  return <div className="text-2xl text-[#B8955C]">◎</div>;
}

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

export default function HomePage() {
  return (
    <main>
      <section
        className="relative overflow-hidden border-b border-[#E8DCC4]/60 bg-gradient-to-b from-[#FDF8F0] via-[#FAF2E4] to-[#F4EBDC]"
        aria-label="Nagłówek"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-20 h-72 w-72 rounded-full bg-[#B8955C]/[0.08]" />
          <div className="absolute -right-16 bottom-0 h-96 w-96 rounded-full bg-[#6B8F71]/[0.07]" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <h1 className="mt-0 max-w-2xl font-serif text-3xl font-semibold leading-tight text-[#2B2B2B] sm:text-4xl md:text-5xl">
                Wszystko, co pozwoli Ci mieć kontrolę nad przygotowaniami weselnymi
              </h1>
              <p className="mt-5 max-w-prose text-base text-[#4A4A4A] sm:text-lg">
                W jednym miejscu: plan, lista gości, RSVP, harmonogram i wspomnienia, do których wrócisz. Zaczynamy
                od przejrzystych narzędzi, które będziemy rozbudowywać razem z Tobą.
              </p>
              <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  className="inline-flex h-12 min-w-[200px] flex-1 items-center justify-center rounded-md bg-[#B8955C] px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                  href="/rejestracja"
                >
                  Załóż darmowe konto
                </Link>
                <Link
                  className="inline-flex h-12 min-w-[200px] flex-1 items-center justify-center rounded-md border-2 border-[#B8955C] bg-white/80 px-6 text-sm font-semibold text-[#2B2B2B] shadow-sm transition hover:bg-white"
                  href="/#oferta"
                >
                  Sprawdź, co możesz otrzymać
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/80 bg-gradient-to-br from-white to-[#EEF4E8]/80 p-5 shadow-lg shadow-[#B8955C]/5 ring-1 ring-[#B8955C]/10 sm:col-span-1">
                  <p className="text-xs font-bold uppercase tracking-widest text-[#5A7A5F]">W jednym miejscu</p>
                  <h2 className="mt-2 font-serif text-lg text-[#2B2B2B]">Plan i lista zadań</h2>
                  <ul className="mt-3 space-y-2.5 text-sm text-[#3A3A3A]">
                    {["Miejsce i data", "Goście i stoliki", "Muzyka i fotograf"].map((x) => (
                      <li className="flex items-center gap-2" key={x}>
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#6B8F71]/20 text-xs text-[#2D4A32]">✓</span>
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-col gap-4 sm:col-span-1 sm:pt-8">
                  <div className="rounded-2xl border border-[#B8955C]/25 bg-gradient-to-br from-[#FFF9F0] to-[#F0E3D0] p-4 shadow-md">
                    <p className="text-xs font-semibold uppercase text-[#8A6A3A]">RSVP</p>
                    <p className="mt-1 font-serif text-base text-[#2B2B2B]">Odpowiedzi gości bez chaosu w wiadomościach</p>
                    <p className="mt-2 text-xs leading-relaxed text-[#5A5A5A]">
                      Link do wydarzenia, potwierdzenia w jednej tabeli.
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/60 bg-white/90 p-4 ring-1 ring-inset ring-[#E0D0B0]/30">
                    <p className="text-xs text-[#6A6A6A]">Spójny kalendarz dnia</p>
                    <p className="mt-1 text-sm font-medium text-[#2B2B2B]">Od ślubu po oczepiny — w przyszłych wersjach szczegółowy plan godzinowy.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="funkcje"
        className="border-b border-[#E8DCC4]/60 bg-white"
        aria-labelledby="sekcja-funkcje"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2
            className="font-serif text-2xl font-semibold text-[#2B2B2B] sm:text-3xl"
            id="sekcja-funkcje"
          >
            Czym ma być platforma? — filary
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#4A4A4A] sm:text-base">
            Te moduły stopniowo uruchomimy. Poniżej: kierunek i korzyści dla pary, nie tylko lista techniczna.
          </p>
          <ul className="mt-8 grid list-none grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <li
                key={f.id}
                className="min-h-28 rounded-2xl border border-[#E6D4B0]/50 bg-gradient-to-b from-white to-[#FDF8F0] p-4 shadow-sm"
              >
                <div className="mb-1 flex h-8 items-center justify-center rounded-lg bg-gradient-to-b from-white to-[#F5E9D3] text-[#2B2B2B] ring-1 ring-inset ring-[#E0D0B0]/30">
                  <FeatureIcon k={f.id} />
                </div>
                <h3 className="mt-2 text-base font-semibold text-[#2B2B2B]">{f.title}</h3>
                <p className="mt-1.5 text-sm text-[#4A4A4A]">{f.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="oferta"
        className="border-b border-[#B8955C]/15 bg-gradient-to-b from-[#2D4A32]/[0.04] to-[#F9F0E0]/50"
        aria-labelledby="sekcja-oferta"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2
            className="font-serif text-2xl font-semibold text-[#2B2B2B] sm:text-3xl"
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
        className="scroll-mt-20 border-b border-[#E8DCC4]/60 bg-white"
        aria-labelledby="sekcja-cennik"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-serif text-2xl font-semibold text-[#2B2B2B]" id="sekcja-cennik">
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

      <section id="demo" className="bg-[#F8F2E8]/30" aria-labelledby="sekcja-demo">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-serif text-2xl font-semibold text-[#2B2B2B]" id="sekcja-demo">
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
        className="border-b border-[#E8DCC4]/40 bg-gradient-to-b from-white to-[#FDF8F0]"
        aria-labelledby="sekcja-kontakt"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-serif text-2xl font-semibold text-[#2B2B2B]" id="sekcja-kontakt">
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

      <section className="bg-[#E8C99B]/[0.2]" aria-label="Zaproszenie do rejestracji">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch gap-4 px-4 py-12 text-center sm:px-6 sm:py-16">
          <h2 className="font-serif text-2xl font-semibold text-[#2B2B2B] sm:text-3xl">
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
