import Link from "next/link";

export const metadata = { title: "RODO" };

export default function RodoInfoPage() {
  return (
    <div className="min-h-0 border-b border-[#E8DCC4]/50 bg-white">
      <article className="mx-auto w-full max-w-3xl space-y-4 px-4 py-10 sm:px-6 sm:py-12">
        <h1 className="font-serif text-2xl font-semibold">RODO / informacje o przetwarzaniu (szkic)</h1>
        <p className="text-sm leading-relaxed sm:text-base">
          Administrator danych, wykaz praw osób, współpraca z usługodawcami (Vercel, e-mail, hosting bazy danych).
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
    </div>
  );
}
