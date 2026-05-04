"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { type MarketingFeature, marketingFeatures } from "@/data/marketing-features";

function useSectionRevealOnce() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || visible) {
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        const hit = entries[0];
        if (hit?.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.06, rootMargin: "0px 0px -4% 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [visible]);

  return { ref, visible };
}

type HighlightRect = { top: number; height: number };

type PreviewPair = {
  desktopSrc: "/images/f1desktop.png" | "/images/f2desktop.png";
  mobileSrc: "/images/f1mobile.png" | "/images/f2mobile.png";
};

function getFeaturePreviewPair(feature: MarketingFeature, index: number): PreviewPair {
  if (feature.id === "wedding-web") {
    return { desktopSrc: "/images/f1desktop.png", mobileSrc: "/images/f1mobile.png" };
  }
  if (feature.id === "domain") {
    return { desktopSrc: "/images/f2desktop.png", mobileSrc: "/images/f2mobile.png" };
  }
  return index % 2 === 0
    ? { desktopSrc: "/images/f1desktop.png", mobileSrc: "/images/f1mobile.png" }
    : { desktopSrc: "/images/f2desktop.png", mobileSrc: "/images/f2mobile.png" };
}

function FeatureListItem({
  feature,
  index,
  active,
  hovered,
  reveal,
  onActivate,
  onHoverStart,
  onHoverEnd,
}: {
  feature: MarketingFeature;
  index: number;
  active: boolean;
  hovered: boolean;
  reveal: boolean;
  onActivate: () => void;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  const label = String(index + 1).padStart(2, "0");

  return (
    <button
      type="button"
      onMouseEnter={onHoverStart}
      onFocus={onHoverStart}
      onMouseLeave={onHoverEnd}
      onBlur={onHoverEnd}
      onClick={onActivate}
      aria-pressed={active}
      className={`group relative z-10 flex w-full items-center gap-3 rounded-2xl border px-3 py-2.5 text-left transition duration-300 ease-out sm:gap-3.5 ${
        active || hovered
          ? "border-[#dcccad] bg-[#fdfaf5]"
          : "border-transparent bg-transparent hover:border-[#e6d9c6]/80 hover:bg-[#fefbf6]/80"
      } ${
        reveal
          ? "translate-y-0 opacity-100"
          : "translate-y-2 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      }`}
      style={{ transitionDelay: `${Math.min(index, 8) * 34}ms` }}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition ${
          active ? "bg-[#efe2cc]" : "bg-[#f5efe5]"
        }`}
      >
        <Image src={feature.imageSrc} alt="" width={18} height={18} className="h-[18px] w-[18px] object-contain" />
      </span>
      <span className="min-w-0 flex-1 pr-1">
        <span className="flex items-baseline gap-2">
          <span className="font-mono text-[0.62rem] font-medium tracking-[0.14em] text-[#bdaf9d]">{label}</span>
          <span className="font-wa-display text-[0.96rem] font-semibold text-[#1f1c19] sm:text-[1.01rem]">{feature.title}</span>
        </span>
      </span>
    </button>
  );
}

function DevicePreview({
  features,
  activeIndex,
}: {
  features: MarketingFeature[];
  activeIndex: number;
}) {
  const activeFeature = features[activeIndex];

  return (
    <div className="relative mx-auto w-full max-w-[48rem] rounded-[1.9rem] border border-[#ebdfcd] bg-[linear-gradient(180deg,#fbf8f3_0%,#f5efe5_100%)] p-4 shadow-[0_30px_70px_-54px_rgba(37,25,8,0.95)] sm:p-5">
      <div className="pointer-events-none absolute inset-0 rounded-[1.9rem] ring-1 ring-white/65" />
      <div className="relative flex min-h-[18.5rem] items-end justify-center gap-2.5 pb-2 pl-1 pr-1 sm:min-h-[22.5rem] sm:gap-4">
        <div className="relative h-[12.5rem] w-[86%] max-w-[31rem] rounded-[0.9rem] border border-[#d6c6ab] bg-[#d7c6aa] p-2 shadow-[0_20px_40px_-32px_rgba(38,25,6,0.95)] sm:h-[16rem] sm:rounded-[1rem] sm:p-2.5">
          <div className="relative h-full w-full overflow-hidden rounded-[0.5rem] border border-[#c4b291] bg-[#ece4d6]">
            {features.map((feature, i) => {
              const pair = getFeaturePreviewPair(feature, i);
              return (
                <Image
                  key={`${feature.id}-desktop`}
                  src={pair.desktopSrc}
                  alt={`Podgląd desktop: ${feature.title}`}
                  fill
                  sizes="(min-width: 1024px) 450px, (min-width: 640px) 72vw, 88vw"
                  className={`object-cover transition-opacity duration-500 ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
                  priority={i === 0}
                />
              );
            })}
          </div>
          <span className="absolute -bottom-4 left-1/2 h-3.5 w-[34%] -translate-x-1/2 rounded-full bg-[#c6b290] sm:h-4" />
          <span className="absolute -bottom-7 left-1/2 h-2.5 w-[58%] -translate-x-1/2 rounded-full bg-[#d8c8ae]" />
        </div>

        <div className="relative -ml-8 h-[10.8rem] w-[5.35rem] rounded-[1.15rem] border border-[#d6c6ab] bg-[#f7f1e7] p-[0.28rem] shadow-[0_24px_36px_-30px_rgba(31,20,4,0.95)] sm:-ml-14 sm:h-[14.2rem] sm:w-[6.9rem] sm:rounded-[1.4rem] sm:p-[0.35rem]">
          <div className="relative h-full w-full overflow-hidden rounded-[0.92rem] border border-[#ccb998] bg-[#ece4d6] sm:rounded-[1.15rem]">
            {features.map((feature, i) => {
              const pair = getFeaturePreviewPair(feature, i);
              return (
                <Image
                  key={`${feature.id}-mobile`}
                  src={pair.mobileSrc}
                  alt={`Podgląd mobile: ${feature.title}`}
                  fill
                  sizes="(min-width: 640px) 105px, 82px"
                  className={`object-cover transition-opacity duration-500 ${i === activeIndex ? "opacity-100" : "opacity-0"}`}
                />
              );
            })}
          </div>
          <span className="absolute left-1/2 top-[0.24rem] h-[0.2rem] w-[2.1rem] -translate-x-1/2 rounded-full bg-[#cbb793] sm:top-[0.33rem] sm:w-[2.7rem]" />
        </div>
      </div>

      <div className="mt-10 text-center sm:mt-11">
        <p className="font-wa-display text-xl font-semibold tracking-[0.01em] text-[#3b332c] sm:text-2xl">
          {activeFeature?.title}
        </p>
        <p className="mx-auto mt-2 max-w-2xl text-pretty text-[0.84rem] leading-relaxed text-[#746a5f] sm:text-[0.92rem]">
          {activeFeature?.description}
        </p>
      </div>
    </div>
  );
}

export function HomeFeaturesSection() {
  const { ref, visible } = useSectionRevealOnce();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [highlightRect, setHighlightRect] = useState<HighlightRect>({ top: 0, height: 0 });

  const highlightIndex = hoveredIndex ?? activeIndex;

  useEffect(() => {
    const listEl = listRef.current;
    const itemEl = itemRefs.current[highlightIndex];
    if (!listEl || !itemEl) {
      return;
    }
    const nextTop = itemEl.offsetTop;
    const nextHeight = itemEl.offsetHeight;
    setHighlightRect({ top: nextTop, height: nextHeight });
  }, [highlightIndex, visible]);

  useEffect(() => {
    const listEl = listRef.current;
    if (!listEl) {
      return;
    }
    const refreshHighlight = () => {
      const itemEl = itemRefs.current[highlightIndex];
      if (!itemEl) {
        return;
      }
      setHighlightRect({ top: itemEl.offsetTop, height: itemEl.offsetHeight });
    };
    refreshHighlight();
    const observer = new ResizeObserver(refreshHighlight);
    observer.observe(listEl);
    window.addEventListener("resize", refreshHighlight);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", refreshHighlight);
    };
  }, [highlightIndex]);

  const listItems = useMemo(() => marketingFeatures, []);

  return (
    <div ref={ref} className="w-full border-t border-[#ebe7e0]/90 pb-10 pt-3 sm:pb-12 sm:pt-5">
      <div className="mx-auto w-[min(100%,96vw)] max-w-[1800px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)] lg:items-start lg:gap-10">
          <div ref={listRef} className="relative space-y-2.5 rounded-3xl bg-[#fcfaf6] p-2 sm:space-y-2 sm:p-2.5">
            <div
              className={`pointer-events-none absolute left-2 right-2 rounded-2xl border border-[#d7c6aa] bg-[#fbf7f0] shadow-[0_10px_26px_-22px_rgba(52,40,20,0.95)] transition-[top,height,opacity] duration-300 ease-out sm:left-2.5 sm:right-2.5 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
              style={{ top: `${highlightRect.top}px`, height: `${highlightRect.height}px` }}
              aria-hidden
            />
            {listItems.map((feature, index) => (
              <div
                key={feature.id}
                ref={(node: HTMLDivElement | null) => {
                  itemRefs.current[index] = node;
                }}
              >
                <FeatureListItem
                  feature={feature}
                  index={index}
                  active={index === activeIndex}
                  hovered={index === hoveredIndex}
                  reveal={visible}
                  onActivate={() => setActiveIndex(index)}
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                />
              </div>
            ))}
          </div>

          <div className={`${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-500`}>
            <DevicePreview features={marketingFeatures} activeIndex={activeIndex} />
          </div>
        </div>
      </div>
    </div>
  );
}
