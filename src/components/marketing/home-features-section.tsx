"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";

type CardSpec = {
  id: string;
  imageSrc: string;
  replaceHint: string;
  x: string;
  y: string;
  w: string;
  ratio: string;
  rotate: number;
  z: number;
};

type FeatureSpec = {
  id: string;
  title: string;
  marketingHeading: string;
  marketingDescription: string;
  cards: readonly CardSpec[];
};

const featureSpecs: readonly FeatureSpec[] = [
  {
    id: "wedding-web",
    title: "Strona wesela",
    marketingHeading: "Wasza własna strona weselna",
    marketingDescription:
      "Udostępnij gościom wszystkie najważniejsze informacje w eleganckiej formie — harmonogram dnia, lokalizację, RSVP, noclegi i wyjątkowe chwile zapisane we wspomnieniach.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/func1_1.jpg", replaceHint: "Hero strony wesela", x: "12%", y: "6%", w: "56%", ratio: "aspect-[16/10]", rotate: -2, z: 20 },
      { id: "b", imageSrc: "/images/funcimg/func1_2.jpg", replaceHint: "Harmonogram wesela", x: "64%", y: "8%", w: "24%", ratio: "aspect-[4/5]", rotate: 2, z: 30 },
      { id: "c", imageSrc: "/images/funcimg/func1_3.jpg", replaceHint: "Kontakt", x: "56%", y: "54%", w: "30%", ratio: "aspect-[5/3]", rotate: -1, z: 25 },
    ],
  },
  {
    id: "domain",
    title: "Twoja własna domena",
    marketingHeading: "Adres, który od razu zapada w pamięć",
    marketingDescription:
      "Wasza wizytówka weselna pod własną domeną wygląda spójnie z zaproszeniami i podkreśla charakter całej uroczystości.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/func2_1.jpg", replaceHint: "Twoja domena", x: "23%", y: "9%", w: "54%", ratio: "aspect-[16/9]", rotate: -1, z: 30 },
    ],
  },
  {
    id: "planner",
    title: "Planer weselny",
    marketingHeading: "Planowanie z wyjątkową lekkością",
    marketingDescription:
      "W jednym miejscu zbieracie terminy, checklisty i notatki, dzięki czemu przygotowania przebiegają spokojnie i bez chaosu.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg6.jpg", replaceHint: "Podmień: func3_1.jpg (kalendarz/zadania)", x: "21%", y: "8%", w: "48%", ratio: "aspect-[16/10]", rotate: -2, z: 25 },
      { id: "b", imageSrc: "/images/funcimg/bg2.jpg", replaceHint: "Podmień: func3_2.jpg (harmonogram)", x: "66%", y: "8%", w: "21%", ratio: "aspect-[4/5]", rotate: 2, z: 30 },
      { id: "c", imageSrc: "/images/funcimg/bg4.jpg", replaceHint: "Podmień: func3_3.jpg (notatki)", x: "10%", y: "51%", w: "28%", ratio: "aspect-[5/3]", rotate: 1, z: 24 },
      { id: "d", imageSrc: "/images/funcimg/bg3.jpg", replaceHint: "Podmień: func3_4.jpg (lista zadań)", x: "54%", y: "54%", w: "31%", ratio: "aspect-[5/3]", rotate: -2, z: 26 },
    ],
  },
  {
    id: "guests",
    title: "Lista gości",
    marketingHeading: "Goście pod pełną kontrolą",
    marketingDescription:
      "W kilka chwil sprawdzicie statusy zaproszeń, potwierdzenia obecności i najważniejsze informacje organizacyjne.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg4.jpg", replaceHint: "Podmień: func4_1.jpg (lista gości)", x: "18%", y: "8%", w: "58%", ratio: "aspect-[16/10]", rotate: -1, z: 25 },
      { id: "b", imageSrc: "/images/funcimg/bg2.jpg", replaceHint: "Podmień: func4_2.jpg (RSVP status)", x: "58%", y: "44%", w: "30%", ratio: "aspect-[5/4]", rotate: 2, z: 30 },
    ],
  },
  {
    id: "rsvp",
    title: "RSVP online",
    marketingHeading: "Potwierdzenia obecności bez stresu",
    marketingDescription:
      "Goście odpowiadają online, a Wy od razu widzicie aktualny obraz frekwencji i możecie spokojnie podejmować kolejne decyzje.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg3.jpg", replaceHint: "Podmień: func5_1.jpg (formularz RSVP)", x: "16%", y: "10%", w: "50%", ratio: "aspect-[16/10]", rotate: -2, z: 25 },
      { id: "b", imageSrc: "/images/funcimg/bg5.jpg", replaceHint: "Podmień: func5_2.jpg (email potwierdzenia RSVP)", x: "46%", y: "50%", w: "42%", ratio: "aspect-[16/8]", rotate: 1, z: 30 },
    ],
  },
  {
    id: "checklists",
    title: "Checklisty",
    marketingHeading: "Każdy etap pod ręką",
    marketingDescription:
      "Małe kroki prowadzą do wielkiego dnia — odhaczajcie zadania i trzymajcie harmonogram przygotowań w idealnym porządku.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg2.jpg", replaceHint: "Podmień: func6_1.jpg (checklista)", x: "18%", y: "10%", w: "34%", ratio: "aspect-[4/5]", rotate: -2, z: 24 },
      { id: "b", imageSrc: "/images/funcimg/bg6.jpg", replaceHint: "Podmień: func6_2.jpg (progress)", x: "42%", y: "6%", w: "38%", ratio: "aspect-[16/10]", rotate: 1, z: 27 },
      { id: "c", imageSrc: "/images/funcimg/bg4.jpg", replaceHint: "Podmień: func6_3.jpg (odhaczanie)", x: "54%", y: "46%", w: "32%", ratio: "aspect-[5/4]", rotate: -1, z: 30 },
    ],
  },
  {
    id: "stats",
    title: "Statystyki",
    marketingHeading: "Czytelny obraz postępów",
    marketingDescription:
      "Najważniejsze liczby widzicie od razu: goście, RSVP i organizacja zadań — bez szukania informacji w wielu miejscach.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg5.jpg", replaceHint: "Podmień: func7_1.jpg (wykresy)", x: "16%", y: "10%", w: "56%", ratio: "aspect-[16/10]", rotate: -1, z: 24 },
      { id: "b", imageSrc: "/images/funcimg/bg3.jpg", replaceHint: "Podmień: func7_2.jpg (RSVP + liczby)", x: "60%", y: "44%", w: "28%", ratio: "aspect-[4/5]", rotate: 2, z: 30 },
    ],
  },
  {
    id: "tables",
    title: "Plan stołów",
    marketingHeading: "Rozmieszczenie gości bez chaosu",
    marketingDescription:
      "Szybko ułożycie plan stołów i dopasujecie miejsca, aby każdy gość czuł się komfortowo podczas przyjęcia.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg6.jpg", replaceHint: "Podmień: func8_1.jpg (układ stołów)", x: "20%", y: "8%", w: "50%", ratio: "aspect-[16/10]", rotate: -2, z: 24 },
      { id: "b", imageSrc: "/images/funcimg/bg4.jpg", replaceHint: "Podmień: func8_2.jpg (edycja gości)", x: "66%", y: "10%", w: "22%", ratio: "aspect-[4/5]", rotate: 2, z: 30 },
      { id: "c", imageSrc: "/images/funcimg/bg2.jpg", replaceHint: "Podmień: func8_3.jpg (drag & drop)", x: "56%", y: "54%", w: "28%", ratio: "aspect-[5/3]", rotate: -1, z: 26 },
    ],
  },
  {
    id: "support",
    title: "Kontakt z administracją",
    marketingHeading: "Szybki kontakt, gdy go potrzebujesz",
    marketingDescription:
      "W każdej chwili możecie napisać do naszego zespołu i sprawnie uzyskać wsparcie przy organizacji oraz konfiguracji.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg3.jpg", replaceHint: "Podmień: func9_1.jpg (czat/mail)", x: "24%", y: "10%", w: "52%", ratio: "aspect-[16/10]", rotate: -1, z: 28 },
    ],
  },
  {
    id: "inspiration",
    title: "Inspiracje",
    marketingHeading: "Pomysły, które tworzą klimat",
    marketingDescription:
      "Zbierajcie inspiracje i detale, by od początku budować spójną oprawę estetyczną Waszego wyjątkowego dnia.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg5.jpg", replaceHint: "Podmień: func10_1.jpg (moodboard)", x: "18%", y: "10%", w: "50%", ratio: "aspect-[16/10]", rotate: -2, z: 24 },
      { id: "b", imageSrc: "/images/funcimg/bg4.jpg", replaceHint: "Podmień: func10_2.jpg (dekoracje)", x: "56%", y: "40%", w: "32%", ratio: "aspect-[4/5]", rotate: 2, z: 30 },
    ],
  },
  {
    id: "budget",
    title: "Budżet i koszty",
    marketingHeading: "Budżet pod pełną kontrolą",
    marketingDescription:
      "Na bieżąco monitorujecie wydatki i postępy, dzięki czemu decyzje finansowe podejmujecie spokojnie i świadomie.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg2.jpg", replaceHint: "Podmień: func11_1.jpg (budżet)", x: "20%", y: "10%", w: "54%", ratio: "aspect-[16/10]", rotate: -1, z: 25 },
      { id: "b", imageSrc: "/images/funcimg/bg6.jpg", replaceHint: "Podmień: func11_2.jpg (progress wydatków)", x: "58%", y: "50%", w: "30%", ratio: "aspect-[5/4]", rotate: 2, z: 30 },
    ],
  },
  {
    id: "qr",
    title: "Kody QR",
    marketingHeading: "Szybki dostęp dla Waszych gości",
    marketingDescription:
      "Udostępniajcie najważniejsze informacje jednym skanem — prosto, wygodnie i zawsze pod ręką na telefonie.",
    cards: [
      { id: "a", imageSrc: "/images/funcimg/bg3.jpg", replaceHint: "Podmień: func12_1.jpg (kod QR)", x: "18%", y: "10%", w: "44%", ratio: "aspect-[1/1]", rotate: -2, z: 24 },
      { id: "b", imageSrc: "/images/funcimg/bg5.jpg", replaceHint: "Podmień: func12_2.jpg (telefon skanujący QR)", x: "52%", y: "24%", w: "34%", ratio: "aspect-[4/5]", rotate: 2, z: 30 },
    ],
  },
] as const;

function FeatureIcon({ active }: { active: boolean }) {
  return (
    <span className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border ${active ? "border-[#cfb48d]/70 bg-[#fbf6ee]" : "border-[#e7ddd0]/80 bg-white/60"}`}>
      <svg viewBox="0 0 24 24" className={`h-4.5 w-4.5 ${active ? "text-[#6f5840]" : "text-[#8b7a68]"}`} fill="none" stroke="currentColor" strokeWidth="1.55">
        <path d="M4 6.5h16M7.5 4v5M16.5 4v5M5 11h14v8H5z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function FeatureButton({
  feature,
  active,
  onClick,
}: {
  feature: FeatureSpec;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`group flex h-[62px] w-full items-center gap-3 rounded-[20px] border px-4 text-left transition-all duration-300 ${
        active
          ? "border-[#cfb48d]/70 bg-[#f9f4ec] shadow-[0_14px_28px_-24px_rgba(105,76,43,0.9)] ring-1 ring-[#d8c09a]/35"
          : "border-[#ece4d8]/88 bg-[#f5f0e7]/70 hover:border-[#decbb0]/78 hover:bg-[#fbf7f0]"
      }`}
    >
      <span
        aria-hidden
        className={`h-7 w-[3px] rounded-full transition-all ${
          active ? "bg-[#cfb48d] shadow-[0_0_10px_rgba(207,180,141,0.55)]" : "bg-transparent"
        }`}
      />
      <FeatureIcon active={active} />
      <span className="min-w-0 flex-1 font-wa-display text-[1.02rem] font-medium text-[#342c24]">
        {feature.title}
      </span>
      <span className={`text-sm transition ${active ? "text-[#7a6144]" : "text-[#9b8a78] group-hover:text-[#7a6144]"}`}>›</span>
    </button>
  );
}

function FloatingCollage({ feature }: { feature: FeatureSpec }) {
  /*
   * Cards are absolutely positioned; they don't expand this box.
   * min-height must clear the lowest card (many specs use y ≈ 50–54% + tall aspect ratios).
   */
  return (
    <div className="relative min-h-[min(92vw,34rem)] sm:min-h-[40rem] lg:min-h-[42rem]">
      <div className="pointer-events-none absolute left-[14%] top-[8%] h-56 w-[72%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(215,183,139,0.28)_0%,rgba(215,183,139,0.12)_38%,transparent_74%)] blur-3xl" />

      <AnimatePresence mode="wait">
        <motion.div
          key={feature.id}
          initial={{ opacity: 0, y: 12, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.985 }}
          transition={{ type: "spring", stiffness: 120, damping: 24, mass: 0.8 }}
          className="absolute inset-0"
        >
          {feature.cards.map((card, index) => (
            <motion.div
              key={`${feature.id}-${card.id}`}
              layout
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 26,
                delay: index * 0.04,
              }}
              className={`absolute ${card.ratio} overflow-hidden rounded-[26px] shadow-[0_22px_44px_-28px_rgba(45,32,18,0.55)]`}
              style={{
                left: card.x,
                top: card.y,
                width: card.w,
                zIndex: card.z,
                rotate: `${card.rotate}deg`,
              }}
            >
              <Image
                src={card.imageSrc}
                alt={card.replaceHint}
                fill
                className="object-cover"
                sizes="(min-width: 1536px) 760px, (min-width: 1280px) 680px, (min-width: 768px) 58vw, 92vw"
                quality={92}
              />
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(22,18,14,0.12)_0%,rgba(22,18,14,0.18)_100%)]" />
              <div className="absolute inset-x-2 bottom-2 rounded-xl border border-white/45 bg-[#fff9ef]/84 px-2.5 py-1.5 text-[10px] font-medium leading-tight tracking-[0.01em] text-[#4a3a2a] backdrop-blur-[2px]">
                {card.replaceHint}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function HomeFeaturesSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = featureSpecs[activeIndex];
  const mobileTabs = useMemo(() => featureSpecs, []);

  return (
    <section id="sekcja-funkcje" className="w-full border-t border-[#ebe3d7]/80 bg-[#f5f1ea] pb-16 pt-7 sm:pb-20 sm:pt-10">
      <div className="mx-auto w-[min(100%,96vw)] max-w-[1800px] px-4 sm:px-6 lg:px-10">
        <header className="mx-auto mb-8 max-w-4xl text-center sm:mb-10">
          <div className="mx-auto mb-4 flex items-center justify-center gap-3 text-[#b79463]">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#c8a575]/60" />
            <span className="text-[11px] uppercase tracking-[0.24em]">✦</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#c8a575]/60" />
          </div>
          <h2 className="font-wa-display text-balance text-[2rem] font-semibold leading-tight tracking-[0.01em] text-[#2f2720] sm:text-[2.45rem]">
            Wszystko, czego potrzebujecie w jednym miejscu
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-[1.82] text-[#78695b] sm:text-base">
            Od pierwszego zaproszenia po plan stołów — Wasze przygotowania płyną spokojnie, elegancko i zawsze w Waszym rytmie.
          </p>
        </header>

        <div className="mb-5 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {mobileTabs.map((feature, index) => (
            <button
              key={feature.id}
              onClick={() => setActiveIndex(index)}
              className={`shrink-0 rounded-full border px-4 py-2 text-sm ${
                index === activeIndex
                  ? "border-[#cfb48d]/70 bg-[#f9f4ec] text-[#463627]"
                  : "border-[#e8ddcf] bg-[#f7f2e9] text-[#6f6154]"
              }`}
            >
              {feature.title}
            </button>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.6fr)_minmax(0,1.4fr)] lg:items-start lg:gap-12">
          <aside className="hidden lg:block">
            <div className="space-y-3">
              {featureSpecs.map((feature, index) => (
                <FeatureButton
                  key={feature.id}
                  feature={feature}
                  active={index === activeIndex}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </aside>

          <div>
            <FloatingCollage feature={active} />
            <div className="mx-auto mt-10 h-px w-28 bg-gradient-to-r from-transparent via-[#c8a575]/65 to-transparent sm:mt-14" />
            <AnimatePresence mode="wait">
              <motion.div
                key={active.id}
                initial={{ opacity: 0, y: 10, filter: "blur(2px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -8, filter: "blur(2px)" }}
                transition={{ duration: 0.34, ease: "easeOut" }}
                className="relative z-10 mx-auto mt-6 max-w-2xl text-center sm:mt-8"
              >
                <h3 className="font-wa-display text-[1.45rem] font-semibold tracking-[0.01em] text-[#2f2923] sm:text-[1.8rem]">
                  {active.marketingHeading}
                </h3>
                <p className="mt-2 text-pretty text-sm leading-[1.82] text-[#685b4f] sm:text-base">
                  {active.marketingDescription}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
