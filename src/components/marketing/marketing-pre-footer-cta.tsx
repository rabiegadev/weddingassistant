"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

/** Zamknięcie editorial — bez kolejnego CTA; spokojny most do stopki */
export function MarketingPreFooterCta() {
  const reduce = useReducedMotion();

  return (
    <section
      className="relative overflow-hidden border-b border-[rgba(190,165,130,0.22)] bg-[linear-gradient(185deg,#faf7f2_0%,#f2ebe3_48%,#ebe3d8_100%)] py-16 sm:py-[4.5rem]"
      aria-label="Zakończenie strony"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_55%_at_50%_-10%,rgba(220,190,145,0.14),transparent_58%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%] bg-[radial-gradient(ellipse_80%_70%_at_50%_100%,rgba(22,18,14,0.06),transparent_65%)]"
      />

      <motion.div
        className="relative mx-auto max-w-2xl px-6 text-center"
        initial={reduce ? undefined : { opacity: 0, y: 10 }}
        whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-12% 0px" }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="font-wa-display text-[clamp(1.25rem,3.2vw,1.5rem)] font-medium leading-[1.55] tracking-[0.015em] text-[#3a332c]">
          WeddingAssistant powstał po to, aby organizacja wesela była spokojniejsza, piękniejsza i bardziej uporządkowana.
        </p>
        <p className="mx-auto mt-5 max-w-lg text-pretty text-sm leading-[1.75] text-[#6d655c] sm:text-[0.9375rem]">
          Spokojne przygotowania zaczynają się od dobrze uporządkowanej przestrzeni.
        </p>
        <p className="mt-8 text-[13px] text-[#8a8075]">
          <Link
            href="/#kontakt"
            className="border-b border-[rgba(150,120,80,0.25)] pb-0.5 text-[#6b5a45] transition hover:border-[rgba(150,120,80,0.45)] hover:text-[#3a332c]"
          >
            Napiszcie do nas
          </Link>
          <span className="mx-2 opacity-40" aria-hidden>
            ·
          </span>
          <Link
            href="/nasza-historia"
            className="border-b border-[rgba(150,120,80,0.25)] pb-0.5 text-[#6b5a45] transition hover:border-[rgba(150,120,80,0.45)] hover:text-[#3a332c]"
          >
            Nasza historia
          </Link>
        </p>
      </motion.div>
    </section>
  );
}
