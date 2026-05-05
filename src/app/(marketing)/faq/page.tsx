import Link from "next/link";

const faqItems = [
  {
    q: "Jak zacząć pracę z Weddingassistant?",
    a: "Załóż konto, uzupełnij podstawowe informacje i wybierz pakiet dopasowany do etapu przygotowań.",
  },
  {
    q: "Czy mogę przejść z planu darmowego na płatny?",
    a: "Tak. Przejście odbywa się z poziomu konta i nie wymaga zakładania nowego profilu.",
  },
  {
    q: "Co zawiera pakiet asystent?",
    a: "Narzędzia do organizacji przygotowań, list, harmonogramu i współpracy z obsługą w jednym miejscu.",
  },
  {
    q: "Co zawiera pakiet wizytówka weselna z szablonu?",
    a: "Gotową stronę weselną opartą o szablon, z konfiguracją danych pary i sekcjami dla gości.",
  },
  {
    q: "Czym różni się wizytówka personalizowana od szablonowej?",
    a: "W wersji personalizowanej przygotowujemy indywidualny projekt na podstawie briefu, inspiracji i preferencji.",
  },
  {
    q: "Czy mogę później edytować treści na stronie weselnej?",
    a: "Tak, po uruchomieniu możesz zgłaszać zmiany i aktualizować dane zgodnie z zakresem pakietu.",
  },
  {
    q: "Czy strona weselna działa na telefonach?",
    a: "Tak. Szablony i realizacje przygotowujemy w wersji responsywnej na mobile i desktop.",
  },
  {
    q: "Jak skontaktować się z obsługą?",
    a: "Przez formularz kontaktowy na stronie głównej lub bezpośrednio mailowo i telefonicznie.",
  },
] as const;

export default function FaqPage() {
  return (
    <main className="border-b border-[#dcc9ab]/70 bg-[#f4eadc]">
      <section className="mx-auto w-full max-w-5xl px-4 py-10 pb-20 sm:px-6 sm:py-14 sm:pb-24" aria-labelledby="sekcja-faq-full">
        <h1 className="font-wa-display text-2xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-3xl" id="sekcja-faq-full">
          FAQ — najczęstsze pytania
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[#564a3f] sm:text-base">
          Zebraliśmy odpowiedzi na pytania, które najczęściej pojawiają się przed startem i podczas realizacji usługi.
        </p>
        <div className="mt-7 space-y-4">
          {faqItems.map((item, idx) => (
            <article key={item.q} className="rounded-xl border border-[#d9c5a5]/80 bg-[#fcf7ef] p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8a7658]">Pytanie {idx + 1}</p>
              <h2 className="mt-1 font-wa-display text-lg font-semibold text-[#2f2923]">{item.q}</h2>
              <p className="mt-2 text-sm leading-relaxed text-[#4f453a]">{item.a}</p>
            </article>
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/#kontakt"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#B8955C] bg-white px-7 py-2.5 text-sm font-semibold text-[#4a3820] shadow-sm transition hover:bg-[#faf6ef]"
          >
            Przejdź do kontaktu
          </Link>
        </div>
      </section>
    </main>
  );
}
