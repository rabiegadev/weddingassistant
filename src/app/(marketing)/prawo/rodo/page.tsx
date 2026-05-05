import Link from "next/link";

export const metadata = { title: "RODO" };

export default function RodoInfoPage() {
  return (
    <main className="border-b border-[#E8DCC4]/50 bg-white">
      <article className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="font-wa-display text-2xl font-semibold tracking-[0.02em] sm:text-3xl">RODO – klauzula informacyjna</h1>
        <p className="text-sm leading-relaxed sm:text-base">
          Poniżej znajdziesz skróconą informację o przetwarzaniu danych osobowych zgodnie z Rozporządzeniem Parlamentu
          Europejskiego i Rady (UE) 2016/679 (RODO).
        </p>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">1. Administrator danych</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Administratorem danych osobowych jest podmiot prowadzący serwis Weddingassistant. Dane kontaktowe administratora
            znajdują się w sekcji kontakt na stronie Serwisu.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">2. Cele i podstawy przetwarzania</h2>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- realizacja usług i obsługa konta użytkownika (art. 6 ust. 1 lit. b RODO),</li>
            <li>- obsługa zapytań oraz kontaktu (art. 6 ust. 1 lit. f RODO),</li>
            <li>- wykonanie obowiązków prawnych (art. 6 ust. 1 lit. c RODO),</li>
            <li>- ochrona przed nadużyciami i dochodzenie roszczeń (art. 6 ust. 1 lit. f RODO).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">3. Odbiorcy danych</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Dane mogą być udostępniane podmiotom przetwarzającym je na zlecenie administratora (np. dostawcy hostingu,
            infrastruktury, poczty, płatności), przy zachowaniu odpowiednich zabezpieczeń.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">4. Okres przechowywania danych</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Dane przechowujemy przez okres niezbędny do realizacji usług, a po jego zakończeniu przez czas wynikający z
            przepisów lub okres przedawnienia roszczeń.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">5. Prawa osoby, której dane dotyczą</h2>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- prawo dostępu do danych,</li>
            <li>- prawo sprostowania danych,</li>
            <li>- prawo usunięcia danych (w granicach prawa),</li>
            <li>- prawo ograniczenia przetwarzania,</li>
            <li>- prawo przenoszenia danych,</li>
            <li>- prawo sprzeciwu wobec przetwarzania,</li>
            <li>- prawo wniesienia skargi do Prezesa UODO.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">6. Dobrowolność podania danych</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Podanie danych jest co do zasady dobrowolne, jednak brak podania danych oznaczonych jako wymagane może uniemożliwić
            założenie konta lub korzystanie z określonych funkcji Serwisu.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">7. Zautomatyzowane podejmowanie decyzji</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Dane osobowe nie są wykorzystywane do zautomatyzowanego podejmowania decyzji wywołujących skutki prawne wobec
            użytkowników, w tym do profilowania w rozumieniu RODO.
          </p>
        </section>

        <p className="text-sm text-[#5a5247]">
          Dokument ma charakter wzorcowy i powinien zostać zweryfikowany pod kątem Twojego modelu działalności.
        </p>
        <p>
          <Link className="text-[#6B5427] underline" href="/prawo/polityka-prywatnosci">
            Zobacz też politykę prywatności
          </Link>{" "}
          ·{" "}
          <Link className="text-[#6B5427] underline" href="/">
            strona główna
          </Link>
        </p>
      </article>
    </main>
  );
}
