"use client";

import { motion, useReducedMotion } from "framer-motion";

type StepItem = {
  id: number;
  title: string;
  description: string;
};

/** Zapobiega "wiszącym" jednoliterowym spójnikom na końcu linii. */
function keepPolishOrphans(text: string): string {
  return text.replace(/\b([aiouwzAIUOWZ])\s+/gu, "$1\u00A0");
}

const steps: readonly StepItem[] = [
  {
    id: 1,
    title: "Załóż konto",
    description:
      "Zarejestruj nowe konto i sprawdź ofertę korzystając z dostępnych w darmowym pakiecie narzędzi.",
  },
  {
    id: 2,
    title: "Wybierz plan",
    description:
      "Wprowadź podstawowe informacje na temat wesela, wybierz plan, który najbardziej Cię interesuje i złóż zamówienie.",
  },
  {
    id: 3,
    title: "Realizacja",
    description:
      "Gdy tylko zaakceptujemy zlecenie damy Ci znać wiadomością e-mail wraz z przekierowaniem do płatności i szczegółami.",
  },
  {
    id: 4,
    title: "Planowanie",
    description:
      "Zaplanujcie każdy aspekt waszego wesela z naszą pomocą oraz udostępnijcie gościom najważniejsze informacje!",
  },
];

const listContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 260, damping: 26 },
  },
};

export function HomeHowItWorksSection() {
  const reduce = useReducedMotion();

  return (
    <section
      className="wa-marketing-section scroll-mt-wa border-b border-[#4d3925]/70 bg-[#2a1d13] bg-[image:repeating-linear-gradient(115deg,rgba(219,190,151,0.04)_0px,rgba(219,190,151,0.04)_1px,transparent_1px,transparent_16px)]"
      aria-labelledby="sekcja-jak-to-dziala"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[45%] bg-[radial-gradient(ellipse_70%_80%_at_50%_-10%,rgba(200,165,110,0.08),transparent_58%)]" aria-hidden />

      <div className="relative mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.header
          className="mx-auto max-w-3xl text-center"
          initial={reduce ? undefined : { opacity: 0, y: 12 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-12% 0px" }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            id="sekcja-jak-to-dziala"
            className="font-wa-display text-2xl font-semibold tracking-[0.02em] text-[#f0e4d2] sm:text-3xl"
          >
            Jak to działa?
          </h2>
          <p className="mt-3 text-sm text-[#d7c5ad] sm:text-base">To bardzo proste, tylko spójrz!</p>
        </motion.header>

        <motion.ol
          className="mt-10 grid grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 xl:grid-cols-4"
          variants={listContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-8% 0px" }}
        >
          {steps.map((step, index) => (
            <motion.li
              key={step.id}
              variants={listItem}
              className="relative flex min-h-[15.5rem] flex-col items-center p-1 text-center sm:min-h-[17rem] sm:p-2"
            >
              {index < steps.length - 1 ? (
                <span
                  aria-hidden
                  className="pointer-events-none absolute right-[-0.35rem] top-1/2 hidden h-24 w-px -translate-y-1/2 bg-gradient-to-b from-transparent via-[#d8bb8b]/70 to-transparent shadow-[0_0_8px_rgba(216,187,139,0.28)] xl:block"
                />
              ) : null}
              <div className="mb-4 flex w-full flex-col items-center gap-4">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#d7bb90]/60 bg-[#f6e7cc] text-base font-semibold text-[#4a321b] shadow-[inset_0_1px_0_rgba(255,252,246,0.65)]">
                  {step.id}
                </span>
              </div>
              <h3 className="font-wa-display text-xl font-semibold text-[#f2e6d5] sm:text-[1.35rem]">
                {keepPolishOrphans(step.title)}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#d8c6ad]">{keepPolishOrphans(step.description)}</p>
            </motion.li>
          ))}
        </motion.ol>
        <motion.p
          className="mx-auto mt-8 max-w-5xl text-center text-xs leading-relaxed text-[#bca88f] sm:mt-10 sm:text-sm"
          initial={reduce ? undefined : { opacity: 0 }}
          whileInView={reduce ? undefined : { opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          {keepPolishOrphans(
            "W przypadku planów zawierających stronę internetową (z szablonu lub indywidualną) zostaną przesłane dodatkowe informacje wraz z prośbą o odpowiedź na niezbędne pytania. W wiadomości podamy również szacowany czas realizacji waszej wizytówki weselnej."
          )}
        </motion.p>
      </div>
    </section>
  );
}
