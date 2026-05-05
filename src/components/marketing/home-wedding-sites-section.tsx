import Link from "next/link";
import Image from "next/image";
import { IconSoonPlaceholder } from "@/components/marketing/wedding-demo-icons";

type Example = {
  href: string;
  title: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
};

export function HomeWeddingSitesSection() {
  const examples: Example[] = [
    {
      href: "https://example1.weddinfo.pl",
      title: "Przykład 1 — klasyczna strona ślubna",
      caption: "Elegancki układ z harmonogramem dnia, sekcją dla gości i jasnym CTA do potwierdzenia obecności.",
      imageSrc: "/images/example1-weddinfo.png",
      imageAlt: "Podgląd przykładu 1 strony ślubnej",
    },
    {
      href: "https://example2.weddinfo.pl",
      title: "Przykład 2 — nowoczesny styl premium",
      caption: "Większe zdjęcia, sekcje opowieści o parze i wyeksponowane informacje organizacyjne dla gości.",
      imageSrc: "/images/example2-weddinfo.png",
      imageAlt: "Podgląd przykładu 2 strony ślubnej",
    },
    {
      href: "https://example3.weddinfo.pl",
      title: "Przykład 3 — lekki motyw romantyczny",
      caption: "Delikatna estetyka, czytelna mapa dojazdu i przyjazny układ na telefonie i komputerze.",
      imageSrc: "/images/example3-weddinfo.png",
      imageAlt: "Podgląd przykładu 3 strony ślubnej",
    },
  ];

  const soonTitles = ["Szablon klasyczny", "Szablon minimalistyczny", "Motyw premium"];

  return (
    <section
      id="strona-wesela"
      className="scroll-mt-wa border-b border-[#d8c5a7]/70 bg-[#e9dccb]"
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
          Poniżej znajdziesz trzy gotowe przykłady stron ślubnych, które możesz otworzyć i sprawdzić na żywo.
          Każdy wariant można później dopasować pod Wasze imiona, zdjęcia, harmonogram, lokalizację i styl wesela.
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
                <div className="relative h-44 overflow-hidden border-b border-[#efe8df] bg-[#f8f3ec] sm:h-48">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
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

        <div className="mt-8 flex justify-center">
          <Link
            href="/realizacje"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#B8955C] bg-white px-8 py-2.5 text-sm font-semibold text-[#4a3820] shadow-sm transition hover:bg-[#faf6ef]"
          >
            Więcej realizacji
          </Link>
        </div>
      </div>
    </section>
  );
}
