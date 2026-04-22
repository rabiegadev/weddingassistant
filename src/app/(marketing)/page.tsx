import Link from "next/link";

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

export default function HomePage() {
  return (
    <main>
      <section
        className="relative border-b border-[#E8DCC4]/60 bg-gradient-to-b from-[#FDF8F0] to-[#F4EBDC]"
        aria-label="Nagłówek"
      >
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium uppercase tracking-wide text-[#7A6343]">
                Nowa strona marki, jeden produkt, jeden styl
              </p>
              <h1 className="mt-3 max-w-2xl font-serif text-3xl font-semibold leading-tight text-[#2B2B2B] sm:text-4xl md:text-5xl">
                Wszystko, czego potrzebujesz do lepszego, spokojniejszego wesela
              </h1>
              <p className="mt-5 max-w-prose text-base text-[#4A4A4A] sm:text-lg">
                Zbieramy narzędzia i wspomnienia: od planu i listy gości, przez RSVP i harmonogram,
                po wspomnienia, które wrócisz w przyszłości. Startujemy od spójnej platformy, nad
                którą będziemy budować kolejne moduły.
              </p>
              <div className="mt-8 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  className="inline-flex h-12 min-w-[200px] flex-1 items-center justify-center rounded-md bg-[#B8955C] px-6 text-sm font-semibold text-white shadow-sm transition hover:brightness-105"
                  href="/rejestracja"
                >
                  Załóż darmowe konto
                </Link>
                <a
                  className="inline-flex h-12 min-w-[200px] flex-1 items-center justify-center rounded-md border border-[#B8955C] bg-white/70 px-6 text-sm font-semibold text-[#2B2B2B] transition hover:bg-white"
                  href="#funkcje"
                >
                  Zobacz, co będziemy rozbudowywać
                </a>
              </div>
            </div>

            <div
              className="relative min-h-56 self-stretch rounded-2xl border border-white/50 bg-gradient-to-tr from-white to-[#EEE2CD] p-4 shadow-sm ring-1 ring-[#E0D0B0]/50"
              role="img"
              aria-label="Dekoracyjny blat z symbolami: checklist, RSVP, obrączki"
            >
              <div className="h-full w-full rounded-xl bg-gradient-to-b from-white/50 to-white/0 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="w-full max-w-sm rounded-md border border-[#D9C6A0] bg-white/90 p-3 text-xs text-[#3A3A3A] shadow-sm">
                    <p className="text-[0.6rem] font-bold uppercase text-[#8A6A3A]">Checklista</p>
                    <ul className="mt-2 space-y-1.5 text-[#2B2B2B]">
                      {["Fotograf", "Catering", "Muzyka"].map((x) => (
                        <li className="flex items-center justify-between" key={x}>
                          <span className="flex items-center gap-1">
                            <span className="text-[#B8955C]">✓</span> {x}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="hidden w-20 shrink-0 sm:block" aria-hidden />
                </div>
                <p className="mt-4 text-right text-sm font-serif text-[#2B2B2B]">
                  RSVP
                  <span className="block text-xs text-[#6A6A6A]">Spójny, powtarzalny, spokój w głowie</span>
                </p>
                <div
                  className="pointer-events-none absolute bottom-0 right-4 h-20 w-20 opacity-20"
                  aria-hidden
                >
                  <div className="h-full w-full rounded-full border-2 border-dashed border-[#B8955C]" />
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
            Czym ma być platforma? — orientacyjne filary
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-[#4A4A4A] sm:text-base">
            Te sekcje ewoluują w kierunku w pełni działających modułów. Poniżej: orientacja, nie pełne
            wdrożenie w tej wersji szkieletu.
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

      <section id="cennik" className="bg-[#F9F0E0]/40" aria-labelledby="sekcja-cennik">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-serif text-2xl font-semibold text-[#2B2B2B]" id="sekcja-cennik">
            Cennik i pakiety
          </h2>
          <p className="mt-2 text-sm text-[#4A4A4A] sm:text-base">
            Konfiguracja pakietów w panelu administratora, jeden źródłowy katalog, widoczny w cenniku i
            u klienta — w kolejnych krokach ten blok połączymy z bazą i płatnościami.
          </p>
        </div>
      </section>

      <section id="demo" className="bg-white" aria-labelledby="sekcja-demo">
        <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <h2 className="font-serif text-2xl font-semibold text-[#2B2B2B]" id="sekcja-demo">
            Strefa demo
          </h2>
          <p className="mt-2 text-sm text-[#4A4A4A] sm:text-base">
            Tutaj trafią krok po kroku demonstracje: RSVP, kody QR, galeria gościnna, checklisty, itd.
            Na tym etapie — placeholder, żeby utrzymać ścieżkę w menu i layout.
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
          <p className="mt-2 text-sm text-[#4A4A4A] sm:text-base">
            Formularz, numer telefonu i godziny odbioru dołożymy, gdy zdecydujemy, przez które kanały
            wolisz odbiór (mail / telefon / ticket w panelu).
          </p>
        </div>
      </section>

      <section className="bg-[#F2E1C4]/20" aria-label="Sekcja kołowa">
        <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch gap-4 px-4 py-12 text-center sm:px-6 sm:py-16">
          <h2 className="font-serif text-2xl font-semibold text-[#2B2B2B] sm:text-3xl">
            Z Weddingassistant praca nad weselem ma być przejrzysta i w jednym miejscu.
          </h2>
          <p className="text-sm text-[#4A4A4A] sm:text-base">Nie potrzebujesz jeszcze karty. Start od szkieletu.</p>
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
