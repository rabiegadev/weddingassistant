import Link from "next/link";
import { getAppPublicUrl } from "@/lib/env/public";
import {
  IconGlobeDemo,
  IconGalleryDemo,
  IconRsvpDemo,
  IconSoonPlaceholder,
} from "@/components/marketing/wedding-demo-icons";

type Example = {
  href: string;
  title: string;
  caption: string;
  Icon: typeof IconGlobeDemo;
};

/**
 * Strony weselne — trzy działające podglądy (localhost w dev / domena w prod) + zapowiedzi.
 */
export function HomeWeddingSitesSection() {
  const base = getAppPublicUrl();
  const examples: Example[] = [
    {
      href: `${base}/`,
      title: "Przykład 1 — witryna startowa",
      caption: "Podgląd strony głównej Weddingassistant",
      Icon: IconGlobeDemo,
    },
    {
      href: `${base}/cennik`,
      title: "Przykład 2 — oferta i pakiety",
      caption: "Układ sekcji cennika (jak u gości)",
      Icon: IconRsvpDemo,
    },
    {
      href: `${base}/realizacje`,
      title: "Przykład 3 — realizacje",
      caption: "Galeria motywów i inspiracji",
      Icon: IconGalleryDemo,
    },
  ];

  const soonTitles = ["Szablon klasyczny", "Szablon minimalistyczny", "Motyw premium"];

  return (
    <section
      id="strona-wesela"
      className="scroll-mt-wa border-b border-[#e8e2dc]/70 bg-white"
      aria-labelledby="sekcja-strona-wesela"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <h2
          className="font-wa-display text-balance text-xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-2xl"
          id="sekcja-strona-wesela"
        >
          Strona internetowa wesela
        </h2>
        <p className="mt-2 max-w-3xl text-pretty text-sm leading-relaxed text-[#5a534c] sm:text-base">
          Każda para może mieć dedykowaną stronę dla gości: harmonogram, RSVP, mapa, kontakt. Poniżej działające
          podglądy w tej samej aplikacji — w środowisku developerskim otwierają się na{" "}
          <span className="font-medium text-[#4a4036]">localhost:3000</span>, na produkcji pod adresem serwisu.
        </p>

        <ul className="mt-8 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {examples.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e2dc] bg-[#fdfcfa] shadow-sm transition hover:border-[#d4c4a8] hover:shadow-md"
              >
                <div className="flex items-center justify-center border-b border-[#efe8df] bg-gradient-to-b from-[#faf7f2] to-[#f3ece4] px-4 py-8">
                  <item.Icon className="h-24 w-24 transition duration-300 group-hover:scale-105" />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="font-wa-display text-base font-semibold text-[#2E2A26]">{item.title}</p>
                  <p className="mt-1 text-sm text-[#6B5427]">{item.caption}</p>
                  <span className="mt-3 text-xs font-medium uppercase tracking-wider text-[#8a7a68]">
                    Otwórz podgląd →
                  </span>
                </div>
              </a>
            </li>
          ))}
        </ul>

        <ul className="mt-5 grid list-none grid-cols-1 gap-4 sm:grid-cols-3">
          {soonTitles.map((title) => (
            <li
              key={title}
              className="flex flex-col items-center rounded-2xl border border-dashed border-[#d8cfc4] bg-[#faf8f5] px-4 py-6 text-center"
            >
              <IconSoonPlaceholder className="h-20 w-20 opacity-90" />
              <p className="mt-3 font-wa-display text-sm font-semibold text-[#6a625a]">{title}</p>
              <p className="mt-2 text-xs leading-snug text-[#8a8075]">
                Już wkrótce — kolejne przykładowe wizytówki pojawią się tutaj.
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
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
