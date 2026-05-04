import Image from "next/image";
import Link from "next/link";

const EXAMPLES = [
  {
    href: "https://example1.weddinfo.pl/",
    title: "Przykład 1",
    caption: "example1.weddinfo.pl",
    imageSrc: "/images/weddingweb.png",
  },
  {
    href: "https://example2.weddinfo.pl/",
    title: "Przykład 2",
    caption: "example2.weddinfo.pl",
    imageSrc: "/images/rsvp.png",
  },
  {
    href: "https://example3.weddinfo.pl/",
    title: "Przykład 3",
    caption: "example3.weddinfo.pl",
    imageSrc: "/images/dziennik.png",
  },
] as const;

/**
 * Strony weselne (Weddiinfo) — trzy realizacje na stronie głównej + link do listy.
 */
export function HomeWeddingSitesSection() {
  return (
    <section
      id="strona-wesela"
      className="scroll-mt-wa border-b border-[#e8e2dc]/70 bg-white"
      aria-labelledby="sekcja-strona-wesela"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <h2
          className="font-wa-display text-balance text-xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-2xl"
          id="sekcja-strona-wesela"
        >
          Strona internetowa wesela
        </h2>
        <p className="mt-2 max-w-3xl text-pretty text-sm leading-relaxed text-[#5a534c] sm:text-base">
          Każda para może mieć dedykowaną stronę dla gości: harmonogram, RSVP, mapa, kontakt. Poniżej trzy przykładowe
          realizacje na domenach Weddiinfo — otwierają się w nowej karcie.
        </p>

        <ul className="mt-8 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#e8e2dc] bg-[#fdfcfa] shadow-sm transition hover:border-[#d4c4a8] hover:shadow-md"
              >
                <div className="relative aspect-[16/10] border-b border-[#efe8df] bg-[#f6f2eb]">
                  <Image
                    src={item.imageSrc}
                    alt=""
                    fill
                    className="object-contain p-3 transition duration-300 group-hover:scale-[1.02]"
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                  />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="font-wa-display text-base font-semibold text-[#2E2A26]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#6B5427]">{item.caption}</p>
                  <span className="mt-3 text-xs font-medium uppercase tracking-wider text-[#8a7a68]">
                    Otwórz stronę →
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/realizacje"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#B8955C] bg-white px-8 py-2.5 text-sm font-semibold text-[#4a3820] shadow-sm transition hover:bg-[#faf6ef]"
          >
            Więcej realizacji
          </Link>
          <a
            href="https://weddinfo.pl/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#6B5427] underline underline-offset-2"
          >
            weddinfo.pl — hosting stron weselnych
          </a>
        </div>
      </div>
    </section>
  );
}
