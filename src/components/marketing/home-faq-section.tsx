"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

const FAQ_ITEMS: readonly { q: string; a: string }[] = [
  {
    q: "Czy mogę zacząć od darmowego planu i później przejść wyżej?",
    a: "Tak. Możesz zacząć bez kosztów, a gdy będziesz gotowy, przejść na pakiet płatny bez zakładania nowego konta.",
  },
  {
    q: "Czy wizytówkę weselną można dopasować do naszych danych?",
    a: "Tak. Imiona, zdjęcia, harmonogram, adresy i najważniejsze sekcje są konfigurowane pod Waszą parę.",
  },
  {
    q: "Ile trwa uruchomienie strony weselnej?",
    a: "Dla szablonu zwykle trwa to krótko po zebraniu danych, a projekt personalizowany realizujemy według briefu i ustalonego harmonogramu.",
  },
  {
    q: "Czy mogę liczyć na pomoc po starcie?",
    a: "Tak. W ramach obsługi pomagamy we wdrożeniu, zmianach treści i bieżących pytaniach dotyczących panelu.",
  },
];

export function HomeFaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const reduce = useReducedMotion();

  return (
    <section className="border-b border-[#d8c5a7]/70 bg-[#e9dccb]" aria-labelledby="sekcja-faq">
      <div className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="font-wa-display text-[1.35rem] font-semibold tracking-[0.03em] text-[#2a231c] sm:text-2xl" id="sekcja-faq">
            FAQ
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-[0.9375rem] leading-[1.75] text-[#5c534a] sm:text-base">
            Najczęstsze pytania o działanie pakietów, konfigurację strony weselnej i start współpracy.
          </p>
        </header>

        <div className="mx-auto mt-12 max-w-3xl space-y-3">
          {FAQ_ITEMS.map((item, index) => {
            const open = openIndex === index;
            return (
              <motion.div
                key={item.q}
                layout
                className="overflow-hidden rounded-2xl border border-[rgba(165,128,82,0.22)] bg-[linear-gradient(165deg,#fdfaf5_0%,#f4ebe0_100%)] shadow-[0_18px_44px_-28px_rgba(58,42,26,0.18)] transition-shadow duration-300 hover:shadow-[0_22px_48px_-22px_rgba(58,42,26,0.22)]"
              >
                <button
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenIndex(open ? null : index)}
                  className="flex w-full min-h-[3.25rem] cursor-pointer items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-white/25"
                >
                  <span className="font-wa-display text-[1.02rem] font-semibold leading-snug text-[#2f2923] sm:text-[1.06rem]">
                    {item.q}
                  </span>
                  <motion.span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(175,140,95,0.25)] bg-white/50 text-[#8a6f48] shadow-[inset_0_1px_0_rgba(255,253,250,0.8)]"
                    animate={{ rotate: open ? 45 : 0 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  >
                    +
                  </motion.span>
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={reduce ? undefined : { height: 0, opacity: 0 }}
                      animate={reduce ? undefined : { height: "auto", opacity: 1 }}
                      exit={reduce ? undefined : { height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                      className="border-t border-[rgba(190,160,120,0.2)]"
                    >
                      <motion.p
                        initial={reduce ? undefined : { y: -6, opacity: 0 }}
                        animate={reduce ? undefined : { y: 0, opacity: 1 }}
                        exit={reduce ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 pb-5 pt-4 text-sm leading-[1.78] text-[#554a3f]"
                      >
                        {item.a}
                      </motion.p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          className="mt-12 flex justify-center"
          initial={reduce ? undefined : { opacity: 0, y: 8 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/faq"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[rgba(155,118,74,0.35)] bg-white/75 px-8 py-2.5 text-sm font-semibold text-[#4a3820] shadow-[0_16px_40px_-22px_rgba(58,42,26,0.2)] backdrop-blur-[6px] transition duration-300 hover:border-[rgba(184,149,92,0.45)] hover:bg-[#fffdf9] hover:shadow-[0_22px_48px_-20px_rgba(58,42,26,0.22)]"
          >
            Pełna lista FAQ
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
