import Link from "next/link";

export const metadata = { title: "Polityka prywatności" };

export default function PolitykaPrywatnosciPage() {
  return (
    <div className="min-h-0 border-b border-[#E8DCC4]/50 bg-white">
      <article className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="font-serif text-2xl font-semibold">Polityka prywatności (szkic)</h1>
        <p className="text-sm leading-relaxed sm:text-base">
          Opis: cel przetwarzania danych, podstawy RODO, okresy przechowywania, prawo użytkowników, cookies,
          wykorzystanie prostego zadania antybotowego (suma), hosting, baza danych, newsletter / maile
          transakcyjne.
        </p>
        <p>
          <Link className="text-[#6B5427] underline" href="/">
            Strona główna
          </Link>
        </p>
      </article>
    </div>
  );
}
