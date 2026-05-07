"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/** Delikatna „rama końcowa” przed stopką — zaproszenie bez krzykliwego CTA */
export function MarketingPreFooterCta() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-[rgba(200,175,140,0.28)] bg-[linear-gradient(180deg,#faf6ef_0%,#f3ebe1_100%)] py-14 sm:py-16"
      aria-label="Zaproszenie do kontaktu"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_100%,rgba(220,190,145,0.12),transparent_62%)]"
      />
      <motion.div
        className="relative mx-auto max-w-3xl px-6 text-center"
        initial={reduce ? undefined : { opacity: 0, y: 12 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-wa-display text-[1.35rem] font-semibold tracking-[0.02em] text-[#2a231c] sm:text-[1.5rem]">
          Zacznijcie od spokojnego planu
        </p>
        <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.9375rem] leading-[1.75] text-[#6b6258]">
          Konto otwieracie w kilka minut — resztę dopasujemy do Waszego tempa i oczekiwań.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/rejestracja"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(175,138,94,0.35)] bg-white/85 px-8 py-2.5 text-sm font-semibold text-[#342a22] shadow-[0_18px_44px_-22px_rgba(58,42,28,0.18)] backdrop-blur-[6px] transition duration-300 hover:border-[rgba(200,165,118,0.45)] hover:bg-[#fffdf9] hover:shadow-[0_22px_52px_-18px_rgba(58,42,28,0.2)]"
          >
            Załóż konto
          </Link>
          <Link
            href="/#kontakt"
            className="text-sm font-medium text-[#7a664e] underline decoration-[rgba(175,145,105,0.45)] underline-offset-[6px] transition hover:text-[#2a231c]"
          >
            Porozmawiajmy
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
