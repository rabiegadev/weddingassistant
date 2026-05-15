"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

function HeroBackground() {
  /** Miękki blend tekstu ze zdjęciem — mniej „ciemnego brązu”, więcej ciepłego światła po lewej */
  const blurMask =
    "linear-gradient(to right, black 0%, black 18%, rgba(0,0,0,0.38) 30%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0) 48%, rgba(0,0,0,0) 100%)";

  return (
    <div className="pointer-events-none absolute inset-0">
      <Image
        src="/images/bgnew3.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center saturate-[1.12] sepia-[0.1] contrast-[1.02]"
        sizes="100vw"
      />
      {/* Główny read overlay — jaśniejszy, bardziej filmowy */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(32,22,14,0.72)_0%,rgba(48,32,22,0.48)_16%,rgba(88,62,42,0.22)_34%,rgba(140,108,72,0.08)_52%,rgba(255,248,238,0.03)_72%,rgba(255,252,246,0.06)_100%)]"
        aria-hidden
      />
      {/* Bardzo delikatna vignette — bez „pudełka” */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_95%_85%_at_70%_35%,rgba(255,245,230,0.08)_0%,transparent_55%),radial-gradient(ellipse_120%_90%_at_50%_100%,rgba(18,12,8,0.35)_0%,transparent_45%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(72%_68%_at_28%_42%,rgba(232,200,155,0.14)_0%,transparent_58%)]"
        aria-hidden
      />
      <div
        className="absolute inset-0 backdrop-blur-[min(8px,1.2vw)] backdrop-saturate-[1.02]"
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

      {/* Naturalny glow za copy — nie konkuruje z kadrem */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[6%] top-[20%] z-[5] h-[min(48vh,380px)] w-[min(88vw,520px)] max-w-[560px] rounded-[50%] bg-[radial-gradient(ellipse_70%_62%_at_38%_44%,rgba(248,232,208,0.11),rgba(210,175,130,0.05)_50%,transparent_74%)] blur-[4px]"
      />

      <div className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-8 pt-12 sm:px-10 lg:flex-row lg:items-center lg:gap-14 lg:px-16 lg:pb-14 lg:pt-16">
        <motion.div
          className="max-w-[26rem] lg:max-w-[28rem] lg:flex-[1.05]"
          initial={intro}
          animate={introDone}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            className="font-wa-display text-balance text-3xl font-semibold leading-[1.14] tracking-[0.02em] text-[#f6ebe0] drop-shadow-[0_2px_28px_rgba(12,8,6,0.45)] sm:text-4xl lg:text-[2.65rem] lg:leading-[1.18]"
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            animate={reduce ? undefined : { opacity: 1, y: 0 }}
            transition={{ delay: 0.06, duration: 0.58, ease: [0.22, 1, 0.36, 1] }}
          >
            Zaplanujcie ten wyjątkowy dzień z maksymalną starannością dzięki naszemu wsparciu
          </motion.h1>
          <motion.p
            className="mt-7 max-w-[22rem] text-pretty text-[0.9375rem] leading-[1.78] text-[#ebe0d2] sm:max-w-none sm:text-base sm:leading-[1.82]"
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
              className="group inline-flex min-h-11 items-center justify-center gap-3 rounded-full border border-[#d4b588]/65 bg-[linear-gradient(180deg,#dfc593,#cfa76e)] px-7 py-2.5 text-sm font-semibold text-[#221810] shadow-[0_12px_36px_-16px_rgba(28,18,10,0.42),0_0_0_1px_rgba(255,248,236,0.12)_inset,inset_0_1px_0_rgba(255,248,236,0.42)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-14px_rgba(42,28,16,0.38),0_0_32px_-8px_rgba(212,176,120,0.35)] active:translate-y-0"
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

        {/* Lekkie „UI” — tylko dolna prawa ćwiartka, bez nachodzenia na twarz */}
        {!reduce ? (
          <div
            className="relative hidden min-h-[min(40vh,320px)] flex-1 lg:block lg:max-w-[min(260px,22vw)] lg:self-end lg:pb-6 xl:max-w-[280px]"
            aria-hidden
          >
            <motion.div
              className="absolute bottom-[46%] right-0 w-[180px] rounded-xl border border-white/10 bg-white/[0.055] p-3 shadow-[0_20px_48px_-28px_rgba(0,0,0,0.45)] backdrop-blur-[10px] xl:w-[188px]"
              initial={{ opacity: 0, y: 14, rotate: -2 }}
              animate={{ opacity: 0.92, y: 0, rotate: -1.5 }}
              transition={{ delay: 0.38, duration: 0.65, type: "spring", stiffness: 95, damping: 24 }}
            >
              <div className="h-1.5 w-10 rounded-full bg-[#e8d4b4]/35" />
              <div className="mt-2.5 space-y-1.5">
                <div className="h-1.5 w-full rounded-full bg-white/12" />
                <div className="h-1.5 w-[68%] rounded-full bg-white/10" />
              </div>
            </motion.div>
            <motion.div
              className="absolute bottom-[6%] right-0 w-[196px] rounded-xl border border-white/08 bg-[rgba(28,20,14,0.32)] p-3 shadow-[0_24px_52px_-26px_rgba(0,0,0,0.55)] backdrop-blur-[12px] xl:w-[208px]"
              initial={{ opacity: 0, y: 18, rotate: 2 }}
              animate={{ opacity: 0.9, y: 0, rotate: 1.2 }}
              transition={{ delay: 0.5, duration: 0.68, type: "spring", stiffness: 88, damping: 22 }}
            >
              <div className="flex gap-2">
                <div className="h-8 w-8 shrink-0 rounded-lg bg-gradient-to-br from-[#d4b896]/35 to-[#6a5240]/25" />
                <div className="flex-1 space-y-1.5 pt-0.5">
                  <div className="h-1.5 w-full rounded-full bg-white/14" />
                  <div className="h-1.5 w-[52%] rounded-full bg-white/09" />
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
