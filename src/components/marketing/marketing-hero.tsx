"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

function HeroBackground() {
  const blurMask =
    "linear-gradient(to right, black 0%, black 14%, rgba(0,0,0,0.4) 26%, rgba(0,0,0,0.12) 34%, rgba(0,0,0,0) 42%, rgba(0,0,0,0) 100%)";

  return (
    <div className="pointer-events-none absolute inset-0">
      <Image
        src="/images/bgnew3.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center saturate-[1.18] sepia-[0.14]"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(22,12,6,0.92)_0%,rgba(34,20,10,0.86)_18%,rgba(62,38,20,0.66)_36%,rgba(106,70,40,0.38)_58%,rgba(162,114,67,0.16)_80%,rgba(255,255,255,0)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(18,10,6,0.88)_0%,rgba(26,15,9,0.7)_10%,rgba(0,0,0,0)_24%,rgba(0,0,0,0)_76%,rgba(26,15,9,0.7)_90%,rgba(18,10,6,0.88)_100%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(78%_72%_at_25%_38%,rgba(181,132,74,0.26)_0%,rgba(0,0,0,0)_68%)] mix-blend-screen"
        aria-hidden
      />
      <div
        className="absolute inset-0 backdrop-blur-[min(9px,1.4vw)] backdrop-saturate-[1.03]"
        style={{ WebkitMaskImage: blurMask, maskImage: blurMask }}
        aria-hidden
      />
    </div>
  );
}

export function MarketingHero() {
  const reduce = useReducedMotion();
  const intro = reduce ? undefined : { opacity: 0, y: 22 };
  const introDone = reduce ? undefined : { opacity: 1, y: 0 };

  return (
    <section
      className="relative -mt-[var(--wa-sticky-offset)] isolate flex min-h-[max(100svh,100dvh)] flex-col overflow-hidden border-b border-[#E8DCC4]/45 pt-[var(--wa-sticky-offset)]"
      aria-label="Weddingassistant — strona główna"
    >
      <HeroBackground />

      {/* Miękki „reflektor” za treścią — głębia editorial */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-[22%] z-[5] h-[min(52vh,420px)] w-[min(92vw,640px)] max-w-[720px] rounded-[50%] bg-[radial-gradient(ellipse_68%_58%_at_35%_42%,rgba(245,228,200,0.14),rgba(210,175,130,0.06)_48%,transparent_72%)] blur-[3px]"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-8 pt-10 sm:px-10 lg:flex-row lg:items-center lg:gap-12 lg:px-16 lg:pb-12 lg:pt-14">
        <motion.div
          className="max-w-xl lg:max-w-2xl lg:flex-[1.15]"
          initial={intro}
          animate={introDone}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            className="font-wa-display text-balance text-3xl font-semibold leading-[1.08] tracking-[0.02em] text-[#f1e4d3] drop-shadow-[0_2px_24px_rgba(12,8,6,0.55)] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.06]"
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            Zaplanujcie ten wyjątkowy dzień z maksymalną starannością dzięki naszemu wsparciu
          </motion.h1>
          <motion.p
            className="mt-5 max-w-xl text-pretty text-[0.9375rem] leading-relaxed text-[#eadbca] sm:text-base"
            initial={reduce ? undefined : { opacity: 0, y: 10 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.14, duration: 0.52, ease: "easeOut" }}
          >
            Nasza platforma powstała aby ułatwić proces planowania wesela oraz zebrać wszystkie niezbędne informacje w
            jednym miejscu, które jest dla Was dostępne w każdej chwili.
          </motion.p>
          <motion.p
            className="mt-8"
            initial={reduce ? undefined : { opacity: 0, y: 8 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.22, duration: 0.45, ease: "easeOut" }}
          >
            <Link
              className="group inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#d2b27e]/75 bg-[#d7b173] px-7 py-2.5 text-sm font-semibold text-[#2b2117] shadow-[0_14px_40px_-14px_rgba(28,18,10,0.55),inset_0_1px_0_rgba(255,248,236,0.35)] transition duration-300 ease-out hover:brightness-[1.06] hover:shadow-[0_18px_44px_-12px_rgba(40,26,14,0.5)]"
              href="/#oferta"
            >
              <span>Sprawdź możliwości</span>
              <span aria-hidden className="h-4 w-px bg-[#6d5332]/45 transition group-hover:bg-[#6d5332]/65" />
              <span aria-hidden className="text-base leading-none transition group-hover:translate-x-0.5">
                →
              </span>
            </Link>
          </motion.p>
        </motion.div>

        {/* Dekoracyjne „karty” — warstwa editorial, tylko lg+ */}
        {!reduce ? (
          <div className="relative hidden min-h-[280px] flex-1 lg:block lg:max-w-md" aria-hidden>
            <motion.div
              className="absolute right-[8%] top-[6%] w-[min(42%,200px)] rounded-2xl border border-white/12 bg-white/[0.07] p-4 shadow-[0_28px_60px_-28px_rgba(0,0,0,0.55)] backdrop-blur-[12px]"
              initial={{ opacity: 0, y: 18, rotate: -3 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{ delay: 0.35, duration: 0.65, type: "spring", stiffness: 90, damping: 22 }}
            >
              <div className="h-2 w-12 rounded-full bg-[#e8d4b4]/40" />
              <div className="mt-3 space-y-2">
                <div className="h-2 w-full rounded-full bg-white/15" />
                <div className="h-2 w-[72%] rounded-full bg-white/10" />
              </div>
            </motion.div>
            <motion.div
              className="absolute bottom-[12%] right-0 w-[min(48%,220px)] rounded-2xl border border-white/10 bg-[rgba(32,22,14,0.35)] p-4 shadow-[0_32px_64px_-24px_rgba(0,0,0,0.6)] backdrop-blur-[14px]"
              initial={{ opacity: 0, y: 24, rotate: 4 }}
              animate={{ opacity: 1, y: 0, rotate: 2 }}
              transition={{ delay: 0.48, duration: 0.7, type: "spring", stiffness: 85, damping: 20 }}
            >
              <div className="flex gap-2">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#d4b896]/50 to-[#8a6a4a]/40" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-2 w-full rounded-full bg-white/18" />
                  <div className="h-2 w-[55%] rounded-full bg-white/12" />
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </div>

      <motion.div
        className="relative z-10 mt-auto flex justify-center pb-7"
        initial={reduce ? undefined : { opacity: 0 }}
        animate={reduce ? undefined : { opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.4 }}
      >
        <a
          href="#funkcje"
          className="flex flex-col items-center gap-1 text-[#d8c8b4] transition hover:text-[#f2e6d4]"
          aria-label="Przewiń do sekcji Funkcje"
        >
          <span className="text-[0.65rem] font-medium uppercase tracking-[0.22em] opacity-85">Dalej</span>
          <svg
            className="animate-wa-scroll-arrow h-8 w-8"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            aria-hidden
          >
            <path d="M12 5v14M6 13l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
}
