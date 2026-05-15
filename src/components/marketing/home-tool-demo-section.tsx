"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const listContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

const listItem = {
  hidden: { opacity: 0, x: -8 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: "spring" as const, stiffness: 280, damping: 28 },
  },
};

/**
 * Sekcja pod „Jak to działa?”: zachęta do założenia konta i poznania darmowych możliwości.
 * Obraz krawędziami do lewej, góry i dołu sekcji (breakpoint lg+).
 */
export function HomeToolDemoSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="narzedzie-testowe"
      className="wa-marketing-section scroll-mt-wa overflow-hidden border-b border-[#e1d2bc]/70 bg-[#fdfbf7]"
      aria-labelledby="sekcja-darmowe-mozliwosci"
    >
      {/* Jeden krótki, stonowany blend — bez jasnego radiala (ten dawał grubą „belkę”) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-[3] h-16 bg-gradient-to-b from-[#231c17]/92 via-[#d9cfc5]/18 to-transparent sm:h-[4.5rem] md:h-20"
      />

      <div className="pointer-events-none absolute inset-x-0 top-[18%] h-[42%] bg-[radial-gradient(ellipse_80%_65%_at_70%_-5%,rgba(200,165,110,0.06),transparent_58%)] max-lg:right-0 max-lg:left-auto max-lg:w-[85%]" aria-hidden />

      <div className="relative grid min-h-0 grid-cols-1 lg:grid-cols-[minmax(0,1.07fr)_minmax(340px,0.93fr)] lg:min-h-[28rem] xl:min-h-[32rem]">
        <motion.div
          className="relative isolate min-h-[14rem] w-full overflow-hidden max-lg:aspect-[21/13] lg:min-h-[28rem] xl:min-h-[32rem]"
          initial={reduce ? undefined : { opacity: 0.92 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true, margin: "-5% 0px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src="/images/flowers1.jpg"
            alt="Stół weselny z kwiatami i świecami — klimat uroczystości."
            fill
            className="object-cover object-[50%_45%] saturate-[1.05] contrast-[0.98]"
            sizes="(min-width: 1024px) 55vw, 100vw"
            quality={92}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_35%,rgba(42,32,24,0.18)_100%)],linear-gradient(165deg,rgba(253,251,247,0.12)_0%,transparent_38%,rgba(28,22,18,0.15)_100%)]"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgba(253,251,247,0.28),transparent)]"
          />
        </motion.div>

        <div className="flex flex-col justify-center px-6 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-14 xl:px-14 xl:py-16 2xl:pr-[max(2.25rem,calc((100vw-1180px)/2))]">
          <div className="mx-auto w-full max-w-xl text-center lg:mx-0 lg:max-w-lg lg:text-left xl:max-w-xl">
            <motion.div
              className="mb-4 flex justify-center gap-3 text-[#b79463] lg:justify-start"
              initial={reduce ? undefined : { opacity: 0, y: 8 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="h-px w-10 self-center bg-gradient-to-r from-transparent to-[#c8a575]/55" aria-hidden />
              <span className="text-[10px] uppercase tracking-[0.22em]">Bezpłatny start</span>
              <span className="h-px w-10 self-center bg-gradient-to-l from-transparent to-[#c8a575]/55" aria-hidden />
            </motion.div>
            <motion.h2
              id="sekcja-darmowe-mozliwosci"
              className="font-wa-display text-balance text-[1.55rem] font-semibold tracking-[0.02em] text-[#2f2720] sm:text-[1.85rem]"
              initial={reduce ? undefined : { opacity: 0, y: 14 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.04 }}
            >
              Odkryjcie możliwości Weddingassistant — w pełni za darmo
            </motion.h2>
            <motion.p
              className="mx-auto mt-4 max-w-prose text-pretty text-sm leading-[1.78] text-[#5f564d] sm:text-base lg:mx-0"
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
            >
              Załóżcie konto i od razu zyskajcie spokojną przestrzeń do planowania. W ramach planu bez opłat
              przeglądacie funkcje przygotowane z myślą o Was — bez karty, bez pośpiechu, we własnym tempie.
            </motion.p>
            <motion.ul
              className="mx-auto mt-6 max-w-prose space-y-2.5 text-left text-sm text-[#4b4540] sm:text-[0.9375rem] lg:mx-0"
              variants={listContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-10% 0px" }}
            >
              <motion.li className="flex gap-3" variants={listItem}>
                <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a575]" aria-hidden />
                <span>podgląd listy gości, RSVP i podsumowań przygotowań zaraz po wejściu do panelu</span>
              </motion.li>
              <motion.li className="flex gap-3" variants={listItem}>
                <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a575]" aria-hidden />
                <span>checklisty, plan dnia i porządek w zadaniach — wszystko w jednym, czytelnym miejscu</span>
              </motion.li>
              <motion.li className="flex gap-3" variants={listItem}>
                <span className="mt-[0.42rem] h-1.5 w-1.5 shrink-0 rounded-full bg-[#c8a575]" aria-hidden />
                <span>gdy będziecie gotowi, możecie bez skoków przejść na pakiet dopasowany do Waszych oczekiwań</span>
              </motion.li>
            </motion.ul>
            <motion.p
              className="mt-8 flex justify-center lg:justify-start"
              initial={reduce ? undefined : { opacity: 0, y: 10 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <Link
                className="inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#d2b27e]/70 bg-[#d7b173] px-7 py-2.5 text-sm font-semibold text-[#2b2117] shadow-[0_14px_42px_-22px_rgba(32,23,14,0.55)] transition-[box-shadow,filter] duration-300 hover:shadow-[0_20px_48px_-18px_rgba(42,32,22,0.38)] hover:brightness-[1.03] active:scale-[0.99]"
                href="/rejestracja"
              >
                <span>Załóż darmowe konto</span>
                <span aria-hidden className="h-4 w-px bg-[#6d5332]/45" />
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </Link>
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
}
