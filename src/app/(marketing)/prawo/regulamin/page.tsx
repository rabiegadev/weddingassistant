import Link from "next/link";

export const metadata = { title: "Regulamin" };

export default function RegulaminPage() {
  return (
    <main className="border-b border-[#E8DCC4]/50 bg-white">
      <article className="mx-auto w-full max-w-4xl space-y-6 px-4 py-10 text-[#2B2B2B] sm:px-6 sm:py-12">
        <h1 className="font-wa-display text-2xl font-semibold tracking-[0.02em] sm:text-3xl">Regulamin serwisu Weddingassistant</h1>
        <p className="text-sm leading-relaxed sm:text-base">
          Niniejszy Regulamin określa zasady korzystania z serwisu Weddingassistant, warunki świadczenia usług drogą
          elektroniczną oraz zasady zawierania i realizacji umów dotyczących planów i usług dostępnych w serwisie.
        </p>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">§1. Definicje</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Użyte w Regulaminie pojęcia oznaczają: Serwis – platformę Weddingassistant; Użytkownik – osobę korzystającą z
            Serwisu; Klient – Użytkownika posiadającego konto i korzystającego z planów; Usługodawca – podmiot prowadzący
            Serwis; Umowa – umowę o świadczenie usług drogą elektroniczną zawartą zgodnie z Regulaminem.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">§2. Postanowienia ogólne</h2>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- Serwis służy do planowania wesela i organizacji danych związanych z wydarzeniem.</li>
            <li>- Korzystanie z Serwisu wymaga urządzenia z dostępem do Internetu i aktualnej przeglądarki.</li>
            <li>- Użytkownik zobowiązuje się do podawania prawdziwych danych i korzystania z Serwisu zgodnie z prawem.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">§3. Konto użytkownika</h2>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- Założenie konta jest dobrowolne i bezpłatne.</li>
            <li>- Użytkownik odpowiada za poufność danych logowania.</li>
            <li>- Usługodawca może zablokować konto w razie naruszeń Regulaminu lub przepisów prawa.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">§4. Plany i usługi</h2>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- Zakres funkcji zależy od wybranego planu.</li>
            <li>- Opisy planów i ceny prezentowane są w Serwisie oraz w cenniku.</li>
            <li>- Usługi indywidualne (np. personalizowana wizytówka) realizowane są na podstawie briefu i ustaleń z obsługą.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">§5. Płatności i rozliczenia</h2>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- Płatności, jeżeli aktywne, realizowane są przez operatorów płatności wskazanych w Serwisie.</li>
            <li>- Dostęp do części funkcji może być aktywowany po zaksięgowaniu płatności.</li>
            <li>- Dokumenty rozliczeniowe wystawiane są zgodnie z obowiązującymi przepisami.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">§6. Reklamacje i kontakt</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Reklamacje można zgłaszać przez formularz kontaktowy lub e-mail wskazany w Serwisie. Zgłoszenie powinno
            zawierać dane kontaktowe oraz opis problemu. Reklamacje rozpatrywane są bez zbędnej zwłoki.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">§7. Odpowiedzialność</h2>
          <ul className="space-y-1 text-sm leading-relaxed sm:text-base">
            <li>- Usługodawca dokłada należytej staranności w zapewnieniu ciągłości działania Serwisu.</li>
            <li>- Mogą wystąpić przerwy techniczne, konserwacyjne lub związane z działaniem dostawców zewnętrznych.</li>
            <li>- Użytkownik ponosi odpowiedzialność za treści i dane wprowadzane do własnego konta.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">§8. Odstąpienie i wypowiedzenie</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Zasady odstąpienia od umowy i wypowiedzenia usług stosuje się zgodnie z właściwymi przepisami prawa,
            z uwzględnieniem charakteru usług cyfrowych realizowanych na żądanie Użytkownika.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-wa-display text-lg font-semibold">§9. Postanowienia końcowe</h2>
          <p className="text-sm leading-relaxed sm:text-base">
            Regulamin może być aktualizowany. W sprawach nieuregulowanych zastosowanie mają przepisy prawa polskiego,
            w szczególności Kodeksu cywilnego i ustawy o prawach konsumenta.
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
