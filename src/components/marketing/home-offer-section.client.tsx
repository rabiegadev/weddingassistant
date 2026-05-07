"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { OfferPackageVm } from "@/components/marketing/offer-packages-types";

function formatPln(cents: number): string {
  return (cents / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

function formatMonthlyFromTotalCents(priceCents: number): string {
  const monthly = Math.round(priceCents / 12);
  return `${formatPln(monthly)} / mies.`;
}

type Billing = "monthly" | "one-time";

function WeddingRingsIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 44" aria-hidden className={className} fill="none" strokeWidth="2.15" strokeLinecap="round">
      <ellipse cx="26" cy="22" rx="17.8" ry="17.8" stroke="#caa46a" />
      <ellipse cx="39.5" cy="22" rx="17.8" ry="17.8" stroke="#d4b07a" />
    </svg>
  );
}

/** Miękkie, rozmyte „plenry” bez ostrych konturów — niemal niewidoczne */
function EditorialBloom({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`pointer-events-none ${className ?? ""}`}>
      <div className="h-full w-full scale-110 blur-[72px]" style={{
        borderRadius: "58% 42% 48% 52% / 52% 48% 55% 45%",
        background: "radial-gradient(ellipse 70% 60% at 40% 45%, rgba(196,164,118,0.14), transparent 72%)",
      }} />
    </div>
  );
}

function CheckGold({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className} fill="none" stroke="#caa46a" strokeWidth="2.2">
      <path strokeLinecap="round" strokeLinejoin="round" d="m5.8 10.2 3 2.9 5.9-8" />
    </svg>
  );
}

function IconHeart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.65">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 20s-8-4.76-8-11a5 5 0 0 1 9.19-2.71A5 5 0 0 1 20 9c0 6.24-8 11-8 11z" />
    </svg>
  );
}

function IconLock({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.65">
      <rect x="5" y="11" width="14" height="10" rx="2" ry="2" strokeLinecap="round" />
      <path strokeLinecap="round" d="M8 11V9a4 4 0 1 1 8 0v2" />
    </svg>
  );
}

function IconHeadphones({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.65">
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 15v4a3 3 0 0 0 3 3h2M20 15v4a3 3 0 0 1-3 3h-2M4 13a10 10 0 0 1 16 0" />
      <path strokeLinecap="round" d="M16 17h1a3 3 0 0 1 3 3v4M8 17H7a3 3 0 0 0-3 3v4" />
    </svg>
  );
}

function IconMobile({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.65">
      <rect x="7.5" y="3.5" width="9" height="17" rx="2.2" strokeLinecap="round" />
      <path strokeLinecap="round" d="M11 17.5h2" />
    </svg>
  );
}

/** Bazowy cień premium + opcjonalny lift na hover */
const cardShadow =
  "shadow-[0_28px_68px_rgba(60,40,20,0.095),0_8px_22px_-8px_rgba(48,34,22,0.06),inset_0_1px_0_rgba(255,253,249,0.65)]";
const cardShadowHover =
  "lg:group-hover/card:shadow-[0_36px_84px_rgba(60,40,20,0.12),0_14px_36px_-10px_rgba(62,44,28,0.08)]";
const featuredShadow =
  "shadow-[0_28px_68px_rgba(60,40,20,0.1),0_26px_62px_-14px_rgba(98,72,42,0.14),0_0_0_1px_rgba(212,176,122,0.32),inset_0_1px_0_rgba(255,251,242,0.55)]";
const featuredShadowHover =
  "lg:group-hover/card:shadow-[0_42px_92px_rgba(60,40,20,0.13),0_28px_56px_-12px_rgba(120,88,48,0.16),0_0_0_1px_rgba(212,176,122,0.38)]";

export function HomeOfferSectionClient({ packages }: { packages: readonly OfferPackageVm[] }) {
  const [billing, setBilling] = useState<Billing>("one-time");
  const reduceMotion = useReducedMotion();
  const prefersReducedMotion = !!reduceMotion;

  const stagger = prefersReducedMotion ? 0 : 0.06;
  const springHover = prefersReducedMotion
    ? undefined
    : { y: -5, transition: { type: "spring" as const, stiffness: 320, damping: 24 } };

  const benefits = useMemo(
    () => [
      { icon: IconHeart, title: "Bez ukrytych opłat", subtitle: "Przejrzyste zasady" },
      { icon: IconLock, title: "Bezpieczne dane", subtitle: "Twoich gości" },
      { icon: IconHeadphones, title: "Wsparcie", subtitle: "Gdy tego potrzebujesz" },
      { icon: IconMobile, title: "Dostęp zawsze", subtitle: "I wszędzie" },
    ],
    []
  );

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(180deg,#f9f5ee_0%,#f6f1ea_38%,#f4ece2_100%)]">
      {/* Miękkie światło + złoto-beż */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[45%] max-h-[520px] bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(228,200,150,0.16),transparent_68%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_45%_at_50%_55%,rgba(255,252,246,0.45),transparent_58%)]"
      />

      {/* Subtelne „botanical” — tylko rozmyte plamy */}
      <EditorialBloom className="absolute -left-[20%] top-[8%] h-[min(52vw,28rem)] w-[min(52vw,28rem)] opacity-[0.55]" />
      <EditorialBloom className="absolute -right-[18%] top-[22%] h-[min(48vw,26rem)] w-[min(48vw,26rem)] opacity-40" />
      <EditorialBloom className="absolute bottom-[-8%] left-[32%] h-[min(44vw,22rem)] w-[min(44vw,22rem)] opacity-35" />

      {/* Delikatne particles */}
      {!prefersReducedMotion ? (
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {[
            { l: "18%", t: "24%", blur: "16px", s: "5px" },
            { l: "71%", t: "18%", blur: "20px", s: "4px" },
            { l: "48%", t: "42%", blur: "12px", s: "3px" },
            { l: "88%", t: "58%", blur: "18px", s: "4px" },
          ].map((d, idx) => (
            <motion.span
              key={idx}
              className="absolute rounded-full bg-[#d9c097]"
              style={{
                left: d.l,
                top: d.t,
                width: d.s,
                height: d.s,
                filter: `blur(${d.blur})`,
                opacity: 0.18,
              }}
              animate={{ opacity: [0.09, 0.2, 0.11] }}
              transition={{ duration: 10 + idx, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
            />
          ))}
        </div>
      ) : null}

      <motion.div
        className="relative z-[1] mx-auto max-w-[1500px] px-4 pb-14 pt-14 sm:px-6 md:pb-16 md:pt-16 lg:px-10 lg:pb-[4.75rem] lg:pt-[3.75rem]"
        initial={prefersReducedMotion ? undefined : { opacity: 0, y: 14 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-8% 0px" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <header className="mx-auto max-w-4xl text-center">
          <div className="mx-auto flex max-w-xl items-center justify-center gap-4 text-[#caa46a] sm:gap-5">
            <span className="h-px flex-1 bg-gradient-to-r from-transparent via-[#caa46a]/40 to-transparent" aria-hidden />
            <WeddingRingsIcon className="h-9 w-auto shrink-0 sm:h-10" />
            <span className="h-px flex-1 bg-gradient-to-l from-transparent via-[#caa46a]/40 to-transparent" aria-hidden />
          </div>

          <h2
            className="mt-6 font-wa-display text-balance text-[clamp(2.125rem,4.9vw,3.35rem)] font-semibold leading-[1.08] tracking-[0.015em] text-[#251c15] sm:mt-5"
            id="sekcja-oferta"
          >
            Pakiety stworzone dla różnych potrzeb
          </h2>
          <p className="mx-auto mt-3 max-w-[600px] text-pretty text-[0.9375rem] leading-[1.75] tracking-[0.01em] text-[#71685f] sm:text-[0.9625rem]">
            Rozwiązanie dopasowane do skali przyjęcia — od spokojnego startu po pełną wizytówkę weselną pod Wasz adres.
          </p>
        </header>

        <div className="mt-7 flex flex-col items-center gap-1.5 sm:mt-6">
          <div className="inline-flex rounded-full border border-[rgba(185,146,94,0.2)] bg-[rgba(254,251,246,0.92)] p-1 shadow-[0_6px_20px_-8px_rgba(60,42,28,0.12)] backdrop-blur-[10px]">
            <button
              type="button"
              aria-pressed={billing === "monthly"}
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-[1.125rem] py-2 text-[13px] font-medium tracking-[0.04em] transition ${
                billing === "monthly"
                  ? "bg-[rgba(218,182,126,0.48)] text-[#251c15] shadow-[inset_0_1px_0_rgba(255,252,246,0.65)]"
                  : "bg-transparent text-[#7d746d] hover:text-[#2b2118]"
              }`}
            >
              Miesięcznie
            </button>
            <button
              type="button"
              aria-pressed={billing === "one-time"}
              onClick={() => setBilling("one-time")}
              className={`rounded-full px-[1.125rem] py-2 text-[13px] font-medium tracking-[0.04em] transition ${
                billing === "one-time"
                  ? "bg-[rgba(218,182,126,0.48)] text-[#251c15] shadow-[inset_0_1px_0_rgba(255,252,246,0.65)]"
                  : "bg-transparent text-[#7d746d] hover:text-[#2b2118]"
              }`}
            >
              Jednorazowo
            </button>
          </div>
          <p className="max-w-md text-center text-[10.5px] leading-snug text-[#9a928a]">
            {billing === "monthly"
              ? "Orientacyjnie: cała kwota podzielona na 12 miesięcy."
              : "Cena zakupu wybranego pakietu z aktualnego cennika."}
          </p>
        </div>

        {/* Siatka: zwarta kompozycja, nie full-bleed kolumn */}
        <div className="mx-auto mt-9 max-w-[1280px] lg:mt-10 lg:pt-4">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] lg:auto-rows-fr lg:snap-none lg:grid lg:grid-cols-5 lg:gap-[0.875rem] lg:overflow-visible lg:pb-2 lg:pt-2 xl:gap-[1.05rem] [&::-webkit-scrollbar]:hidden">
            {packages.map((pkg, idx) => {
              const featured = pkg.featured;
              const monthlyLine = billing === "monthly" ? formatMonthlyFromTotalCents(pkg.priceCents) : null;
              const oneTimeLine = billing === "one-time" ? formatPln(pkg.priceCents) : null;

              return (
                <motion.article
                  key={pkg.id}
                  layout
                  initial={prefersReducedMotion ? undefined : { opacity: 0, y: 16 }}
                  whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: prefersReducedMotion ? 0 : idx * stagger + 0.04, duration: 0.38, ease: "easeOut" }}
                  whileHover={prefersReducedMotion ? undefined : springHover}
                  className={[
                    "group/card relative flex snap-center shrink-0 flex-col overflow-visible rounded-[1.875rem]",
                    "border border-[rgba(155,118,74,0.14)] bg-[linear-gradient(165deg,#fffdfa_0%,#faf4e9_52%,#f3e8da_106%)]",
                    featured ? featuredShadow : cardShadow,
                    featured ? featuredShadowHover : cardShadowHover,
                    featured
                      ? "z-[3] lg:-translate-y-2 lg:scale-[1.038]"
                      : "z-[1] lg:z-[1]",
                    "w-[min(88vw,17.5rem)] p-6 transition-[box-shadow] duration-300 ease-out lg:w-auto lg:min-h-0 lg:max-w-none lg:p-[1.35rem]",
                    featured ? "ring-2 ring-[rgba(212,176,122,0.22)]" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {featured ? (
                    <span className="pointer-events-none absolute left-1/2 top-0 z-[4] inline-flex max-w-[95%] -translate-x-1/2 -translate-y-[52%] rounded-full bg-[linear-gradient(180deg,#cfa76a,#b99056)] px-3.5 py-1 text-[9.5px] font-semibold uppercase tracking-[0.22em] text-[#fefcf9] shadow-[0_14px_28px_-10px_rgba(90,64,38,0.45)]">
                      Najczęściej wybierany
                    </span>
                  ) : null}

                  <div className="relative">
                    <h3 className="font-wa-display text-[1.18rem] font-semibold leading-tight tracking-[0.01em] text-[#251c15] sm:text-[1.22rem]">
                      {pkg.name}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-[12.5px] leading-snug text-[#6f665d]">{pkg.subtitle}</p>
                  </div>

                  <div className="relative mt-4 aspect-[8/5] overflow-hidden rounded-2xl border border-[rgba(175,138,92,0.12)] shadow-[inset_0_1px_0_rgba(255,253,249,0.8),0_8px_20px_-10px_rgba(45,34,22,0.2)]">
                    <Image
                      src={pkg.previewSrc}
                      alt={`Podgląd — ${pkg.name}`}
                      fill
                      sizes="(min-width: 1024px) 238px, 88vw"
                      className="object-cover object-[50%_45%] transition duration-[450ms] ease-out group-hover/card:scale-[1.02]"
                      quality={85}
                    />
                  </div>

                  <ul
                    className="mt-4 flex flex-1 flex-col gap-[0.45rem]"
                    aria-label={`Najważniejsze elementy pakietu ${pkg.name}`}
                  >
                    {pkg.highlights.slice(0, 5).map((line) => (
                      <li key={line} className="flex gap-2 text-[12.5px] leading-[1.5] tracking-[0.01em] text-[#544a42]">
                        <CheckGold className="mt-0.5 h-4 w-4 shrink-0 opacity-95" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-5 border-t border-[rgba(187,154,112,0.16)] pt-5">
                    <p className="font-wa-display text-[clamp(1.55rem,2.55vw,1.875rem)] font-semibold leading-none tracking-[0.01em] text-[#251c15]">
                      {billing === "monthly" ? monthlyLine : oneTimeLine}
                    </p>
                    {billing === "one-time" ? (
                      <span className="mt-1 block text-[11px] font-medium uppercase tracking-[0.14em] text-[#8e857b]">
                        jednorazowo
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-5">
                    <Link
                      href="/cennik"
                      className={
                        featured
                          ? "inline-flex w-full min-h-10 items-center justify-center rounded-2xl border border-transparent bg-[linear-gradient(180deg,rgba(230,194,138,0.75),rgba(206,167,118,0.85))] px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.17em] text-[#251c15] shadow-[inset_0_1px_0_rgba(255,251,243,0.55),0_14px_32px_-18px_rgba(90,62,38,0.28)] transition hover:brightness-[1.06]"
                          : "inline-flex w-full min-h-10 items-center justify-center rounded-2xl border border-[rgba(175,138,94,0.28)] bg-[rgba(255,253,249,0.88)] px-3 py-2.5 text-center text-[11px] font-semibold uppercase tracking-[0.17em] text-[#3a342c] transition hover:border-[rgba(206,173,118,0.45)] hover:bg-[rgba(245,229,206,0.55)] hover:shadow-[0_16px_36px_-20px_rgba(70,48,28,0.15)]"
                      }
                    >
                      {pkg.ctaLabel}
                    </Link>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>

        {/* Pływający panel benefitów */}
        <motion.div
          className="relative z-[2] mx-auto mt-11 max-w-[1280px] rounded-[2.25rem] border border-[rgba(192,154,106,0.26)] bg-[linear-gradient(180deg,#fffdf9_0%,#faf4e8_48%,#f4e9da_100%)] px-7 py-10 shadow-[0_32px_72px_rgba(60,40,20,0.11),0_18px_44px_-18px_rgba(52,38,24,0.09),inset_0_1px_0_rgba(255,253,249,0.92)] backdrop-blur-[8px] sm:px-10 sm:py-11 lg:mt-12"
          initial={prefersReducedMotion ? undefined : { opacity: 0, y: 8 }}
          whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08, duration: 0.35 }}
        >
          <div className="mx-auto grid max-w-[1120px] grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 lg:divide-x lg:divide-[rgba(190,154,108,0.2)] lg:gap-y-0">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="flex items-start gap-5 sm:justify-center lg:justify-start lg:gap-6 lg:px-8 xl:px-10"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.125rem] bg-[rgba(226,192,138,0.22)] text-[#8f7048] shadow-[inset_0_1px_0_rgba(255,251,238,0.75),0_12px_24px_-16px_rgba(70,52,32,0.12)]">
                  <b.icon className="h-7 w-7" aria-hidden />
                </span>
                <div className="min-w-0 text-left">
                  <p className="font-wa-display text-[1.05rem] font-semibold tracking-[0.02em] text-[#271f18]">{b.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#766d63]">{b.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <p className="mx-auto mt-8 max-w-2xl text-center text-[13px] text-[#8f8780] lg:mt-9">
          Pełny porównanie w tabeli:{" "}
          <Link
            href="/cennik"
            className="font-semibold text-[#836542] underline decoration-[rgba(192,154,106,0.45)] underline-offset-[5px] transition hover:text-[#251c15]"
          >
            cennik
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
