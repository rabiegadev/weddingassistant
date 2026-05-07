"use client";

import { motion, useReducedMotion } from "framer-motion";
import { HomeContactForm } from "@/components/marketing/home-contact-form";

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HomeContactSection() {
  const reduce = useReducedMotion();

  return (
    <section
      id="kontakt"
      className="wa-marketing-section scroll-mt-wa border-b border-[#e1d2bc]/70 bg-[#fdfbf7]"
      aria-labelledby="sekcja-kontakt"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[38%] bg-[radial-gradient(ellipse_75%_70%_at_50%_-12%,rgba(200,165,110,0.06),transparent_60%)]" aria-hidden />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <motion.div initial={reduce ? undefined : "hidden"} whileInView={reduce ? undefined : "visible"} viewport={{ once: true, margin: "-10% 0px" }} variants={fadeUp}>
          <h2
            className="font-wa-display text-[1.35rem] font-semibold tracking-[0.025em] text-[#2E2A26] sm:text-2xl"
            id="sekcja-kontakt"
          >
            Kontakt
          </h2>
          <p className="mt-6 max-w-2xl text-[0.9375rem] leading-[1.75] text-[#5a534c] sm:text-base">
            Masz pytania o pakiety lub współpracę? Napisz przez formularz lub bezpośrednio — odpowiadamy możliwie szybko.
          </p>
        </motion.div>

        <motion.div
          className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:items-stretch lg:gap-8"
          initial={reduce ? undefined : { opacity: 0, y: 18 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-8% 0px" }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.06 }}
        >
          <div className="rounded-xl border border-[#ece6dc] bg-[#fcfaf6] p-4 shadow-[0_20px_48px_-38px_rgba(42,32,22,0.18)] sm:p-5">
            <ul className="space-y-4 text-sm text-[#2B2B2B] sm:text-base">
              <li>
                <p className="text-xs font-medium uppercase tracking-wide text-[#75695d]">E-mail</p>
                <a
                  className="mt-1 inline-block font-medium text-[#6B5427] underline break-all transition hover:text-[#4a3a1f]"
                  href="mailto:kontakt@weddingassistant.pl"
                >
                  kontakt@weddingassistant.pl
                </a>
              </li>
              <li>
                <p className="text-xs font-medium uppercase tracking-wide text-[#75695d]">Telefon</p>
                <a className="mt-1 inline-block font-medium text-[#2B2B2B] underline transition hover:text-[#1a1a1a]" href="tel:+48793745717">
                  +48 793 745 717
                </a>
              </li>
              <li>
                <p className="text-xs font-medium uppercase tracking-wide text-[#75695d]">Studio</p>
                <a
                  className="mt-1 inline-block font-medium text-[#6B5427] underline transition hover:text-[#4a3a1f]"
                  href="https://rabiegadevelopment.pl"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  rabiegadevelopment.pl
                </a>
              </li>
            </ul>
          </div>
          <HomeContactForm sourcePage="/#kontakt" compact className="h-full rounded-xl border border-[#ece6dc] bg-[#fdfcfa] p-4 shadow-[0_22px_52px_-40px_rgba(42,32,22,0.2)] sm:p-5" />
        </motion.div>
      </div>
    </section>
  );
}
