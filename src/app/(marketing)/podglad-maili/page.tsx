import Link from "next/link";

type MailPreview = {
  key: string;
  title: string;
  preheader: string;
  intro: string;
  status?: string;
  cta: string;
  nextSteps: readonly string[];
};

const previews: readonly MailPreview[] = [
  {
    key: "order-created-client",
    title: "Dziekujemy za zlozenie zamowienia",
    preheader: "Pakiet: Wizytowka weselna z szablonu",
    intro: "Twoje zamowienie zostalo przyjete. Administrator zweryfikuje dane i przekaze dalsze kroki.",
    status: "Oczekuje na decyzje administratora",
    cta: "Przejdz do zamowienia",
    nextSteps: [
      "Sprawdzaj wiadomosci w panelu zamowienia.",
      "Upewnij sie, ze dane kontaktowe sa aktualne.",
      "Po akceptacji dostaniesz kolejne instrukcje mailem.",
    ],
  },
  {
    key: "order-created-admin",
    title: "Nowe zamowienie od pary mlodej",
    preheader: "Wymaga decyzji administratora",
    intro: "Klient przeslal nowe zamowienie. Wejdz do panelu admin i zdecyduj o dalszej obsludze.",
    status: "Nowe",
    cta: "Otworz panel administratora",
    nextSteps: [
      "Zweryfikuj wybrany pakiet i dane klienta.",
      "Wyslij pierwsza wiadomosc z dalszym planem.",
      "Zmien status zamowienia po decyzji.",
    ],
  },
  {
    key: "welcome-google",
    title: "Witamy w Weddingassistant",
    preheader: "Konto utworzone przez Google",
    intro: "Super, ze jestescie z nami. Mozecie od razu uruchomic panel planowania i przetestowac narzedzia.",
    cta: "Przejdz do panelu",
    nextSteps: [
      "Uzupelnij podstawowe informacje o weselu.",
      "Sprawdz sekcje Start i aktywuj pierwszy plan.",
      "Wroc do nas przez panel, gdy bedziesz gotowy na kolejny krok.",
    ],
  },
];

function MailCard({ item }: { item: MailPreview }) {
  return (
    <article className="rounded-2xl border border-[#dccab1] bg-[#fffdf9] p-4 shadow-[0_16px_34px_-24px_rgba(43,31,20,0.55)] sm:p-5">
      <div className="mx-auto w-full max-w-[640px] overflow-hidden rounded-xl border border-[#e8ddce] bg-white">
        <div className="bg-[#1f1813] px-5 py-4 text-[#f4e7d2]">
          <p className="text-xs uppercase tracking-[0.14em] text-[#d8bc8b]">Weddingassistant</p>
          <h2 className="mt-1 font-wa-display text-xl font-semibold leading-tight">{item.title}</h2>
          <p className="mt-1 text-sm text-[#ecdbc1]">{item.preheader}</p>
        </div>

        <div className="px-5 py-5 text-[#2f2923]">
          <p className="text-sm leading-relaxed">{item.intro}</p>
          {item.status ? (
            <p className="mt-3 rounded-lg border border-[#e5d8c3] bg-[#fbf6ee] px-3 py-2 text-sm text-[#5b4a36]">
              Status: <span className="font-semibold">{item.status}</span>
            </p>
          ) : null}

          <div className="mt-4">
            <span className="inline-flex min-h-10 items-center justify-center rounded-md bg-[#b8955c] px-4 py-2 text-sm font-semibold text-[#231a12]">
              {item.cta}
            </span>
          </div>

          <div className="mt-5 border-t border-[#efe5d7] pt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8d7453]">Co dalej</p>
            <ul className="mt-2 space-y-1.5 text-sm text-[#4d4237]">
              {item.nextSteps.map((step) => (
                <li key={step}>- {step}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-[#ece2d4] bg-[#f9f4ec] px-5 py-3 text-xs text-[#73614c]">
          Masz pytania? Odpisz na tego maila lub skontaktuj sie przez panel.
        </div>
      </div>
      <p className="mt-3 text-xs text-[#7c6d5a]">Szablon: {item.key}</p>
    </article>
  );
}

export default function PodgladMailiPage() {
  return (
    <main className="border-b border-[#dcc9ab]/70 bg-[#f3e9db]">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 pb-20 sm:px-6 sm:py-14 sm:pb-24" aria-labelledby="sekcja-podglad-maili">
        <h1 className="font-wa-display text-2xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-3xl" id="sekcja-podglad-maili">
          Podglad szablonow maili
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5a4d40] sm:text-base">
          Wstepne podglady kluczowych wiadomosci transakcyjnych w kolorystyce bialy, ciemny braz i zloto. Uklad jest responsywny
          i gotowy do dalszego dopracowania pod produkcyjna wysylke.
        </p>
        <div className="mt-7 grid grid-cols-1 gap-5 lg:grid-cols-2">
          {previews.map((item) => (
            <MailCard key={item.key} item={item} />
          ))}
        </div>
        <div className="mt-8">
          <Link
            href="/#kontakt"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#B8955C] bg-white px-7 py-2.5 text-sm font-semibold text-[#4a3820] shadow-sm transition hover:bg-[#faf6ef]"
          >
            Przejdz do kontaktu
          </Link>
        </div>
      </section>
    </main>
  );
}
