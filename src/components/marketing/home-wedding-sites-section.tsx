"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { IconSoonPlaceholder } from "@/components/marketing/wedding-demo-icons";

type Example = {
  href: string;
  title: string;
  caption: string;
  imageSrc: string;
  imageAlt: string;
};

const cardReveal = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 220, damping: 26 },
  },
};

const examplesGrid = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export function HomeWeddingSitesSection() {
  const reduce = useReducedMotion();

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
      className="wa-marketing-section scroll-mt-wa border-b border-[#d8c5a7]/70 bg-[#e9dccb]"
      aria-labelledby="sekcja-strona-wesela"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[50%] bg-[radial-gradient(ellipse_75%_55%_at_50%_-8%,rgba(255,252,246,0.45),transparent_60%)]" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 sm:py-12">
        <motion.div
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-wa-display text-balance text-xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-2xl"
            id="sekcja-strona-wesela"
          >
            Strona internetowa wesela
          </h2>
          <p className="mt-4 max-w-3xl text-pretty text-sm leading-relaxed text-[#5a534c] sm:text-base">
            Poniżej znajdziesz trzy gotowe przykłady stron ślubnych, które możesz otworzyć i sprawdzić na żywo.
            Każdy wariant można później dopasować pod Wasze imiona, zdjęcia, harmonogram, lokalizację i styl wesela.
          </p>
        </motion.div>

        <motion.ul
          className="mt-10 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 sm:mt-12 lg:grid-cols-3"
          variants={examplesGrid}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8% 0px" }}
        >
          {examples.map((item) => (
            <motion.li key={item.href} variants={cardReveal}>
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e4dcd2] bg-[linear-gradient(180deg,#fffdfb_0%,#faf4eb_100%)] shadow-[0_22px_48px_-28px_rgba(58,42,28,0.12)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[#d4c4a8] hover:shadow-[0_32px_56px_-24px_rgba(58,42,28,0.18)]"
              >
                <div className="relative h-44 overflow-hidden border-b border-[#efe8df] bg-[#f8f3ec] sm:h-48">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    className="object-cover object-top transition duration-500 group-hover:scale-[1.02]"
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
            </motion.li>
          ))}
        </motion.ul>

        <ul className="mt-6 grid list-none grid-cols-1 gap-4 sm:grid-cols-3 sm:mt-8">
          {soonTitles.map((title, i) => (
            <motion.li
              key={title}
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-5% 0px" }}
              transition={{ delay: reduce ? 0 : 0.05 + i * 0.05, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center rounded-2xl border border-dashed border-[#d8cfc4] bg-[#faf8f5]/95 px-4 py-6 text-center shadow-[0_16px_40px_-34px_rgba(42,32,22,0.2)]"
            >
              <IconSoonPlaceholder className="h-20 w-20 opacity-90" />
              <p className="mt-3 font-wa-display text-sm font-semibold text-[#6a625a]">{title}</p>
              <p className="mt-2 text-xs leading-snug text-[#8a8075]">Już wkrótce — kolejne przykładowe wizytówki pojawią się tutaj.</p>
            </motion.li>
          ))}
        </ul>

        <motion.div
          className="mt-10 flex justify-center sm:mt-12"
          initial={reduce ? undefined : { opacity: 0, y: 8 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.45 }}
        >
          <Link
            href="/realizacje"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#B8955C] bg-white px-8 py-2.5 text-sm font-semibold text-[#4a3820] shadow-[0_14px_36px_-26px_rgba(42,32,22,0.35)] transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 hover:bg-[#faf6ef] hover:shadow-[0_20px_44px_-22px_rgba(42,32,22,0.28)] active:scale-[0.99]"
          >
            Więcej realizacji
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
