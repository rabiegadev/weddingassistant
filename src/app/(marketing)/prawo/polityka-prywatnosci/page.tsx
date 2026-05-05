import Link from "next/link";

export const metadata = { title: "Polityka prywatności" };

export default function PolitykaPrywatnosciPage() {
  return (
    <main className="border-b border-[#E8DCC4]/50 bg-white">
      <article className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="font-wa-display text-2xl font-semibold tracking-[0.02em] sm:text-3xl">Polityka prywatności</h1>
        <p className="text-sm leading-relaxed sm:text-base">
          Niniejsza Polityka prywatności określa zasady przetwarzania danych osobowych w serwisie Weddingassistant oraz
          zasady korzystania z plików cookies i podobnych technologii.
        </p>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">1. Administrator danych</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Administratorem danych osobowych jest podmiot prowadzący serwis Weddingassistant. Dane kontaktowe administratora
            są dostępne w sekcji kontakt w Serwisie.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">2. Zakres danych</h2>
          <p className="text-sm leading-relaxed sm:text-base">W zależności od korzystania z Serwisu możemy przetwarzać m.in.:</p>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- dane konta (imię, e-mail, hasło w postaci hash),</li>
            <li>- dane organizacyjne dotyczące wydarzenia (np. lista gości, harmonogram, notatki),</li>
            <li>- dane kontaktowe przekazane przez formularze,</li>
            <li>- dane techniczne (logi systemowe, adres IP, dane sesji).</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">3. Cele i podstawy przetwarzania</h2>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- świadczenie usług i prowadzenie konta – art. 6 ust. 1 lit. b RODO,</li>
            <li>- obsługa zapytań i kontaktu – art. 6 ust. 1 lit. f RODO,</li>
            <li>- realizacja obowiązków prawnych (np. księgowych) – art. 6 ust. 1 lit. c RODO,</li>
            <li>- zabezpieczenie i dochodzenie roszczeń – art. 6 ust. 1 lit. f RODO.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">4. Odbiorcy danych</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Dane mogą być powierzane podmiotom wspierającym działanie Serwisu, w tym dostawcom hostingu, baz danych,
            narzędzi e-mail oraz operatorom płatności, wyłącznie w zakresie niezbędnym do realizacji usług.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">5. Okres przechowywania danych</h2>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- dane konta: przez czas posiadania konta oraz okres niezbędny do rozliczeń i obrony roszczeń,</li>
            <li>- dane z formularzy kontaktowych: do czasu obsługi sprawy i upływu okresów przedawnienia,</li>
            <li>- dane wymagane przepisami prawa: przez okres wskazany w tych przepisach.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">6. Prawa użytkownika</h2>
          <p className="text-sm leading-relaxed sm:text-base">Każdej osobie, której dane dotyczą, przysługuje prawo do:</p>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- dostępu do danych,</li>
            <li>- sprostowania danych,</li>
            <li>- usunięcia danych lub ograniczenia przetwarzania (w przypadkach przewidzianych prawem),</li>
            <li>- przenoszenia danych,</li>
            <li>- wniesienia sprzeciwu,</li>
            <li>- wniesienia skargi do Prezesa UODO.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">7. Cookies i technologie podobne</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Serwis wykorzystuje pliki cookies i podobne technologie m.in. do utrzymania sesji logowania, poprawnego
            działania funkcji i bezpieczeństwa. Ustawienia cookies można zmieniać w przeglądarce.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">8. Bezpieczeństwo danych</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Administrator stosuje środki organizacyjne i techniczne adekwatne do ryzyk, m.in. kontrolę dostępu, szyfrowanie
            połączeń, mechanizmy sesji i ochronę formularzy.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">9. Zmiany polityki</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Polityka prywatności może być aktualizowana wraz ze zmianą funkcji Serwisu lub przepisów prawa.
          </p>
        </section>

        <p className="text-sm text-[#5a5247]">
          Dokument ma charakter wzorcowy i powinien zostać zweryfikowany pod kątem Twojego modelu działalności.
        </p>
        <p>
          <Link className="text-[#6B5427] underline" href="/">
            Strona główna
          </Link>
        </p>
      </article>
    </main>
  );
}
