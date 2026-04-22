import Link from "next/link";

export const metadata = { title: "Regulamin" };

export default function RegulaminPage() {
  return (
    <div className="min-h-0 border-b border-[#E8DCC4]/50 bg-white">
      <article className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10 text-[#2B2B2B] sm:px-6 sm:py-12">
        <h1 className="font-serif text-2xl font-semibold">Regulamin (szkic)</h1>
        <p className="text-sm leading-relaxed sm:text-base">
          Dalsza treść: warunki świadczenia usług, właściciel serwisu, wymagania wobec danych klienta,
          zasady wypowiedzenia. Na ten etap: placeholder, doprecyzowanie w ramach wsparcia prawnego
          lokalnie.
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
