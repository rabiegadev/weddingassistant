"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { type MarketingFeature, marketingFeatures } from "@/data/marketing-features";

const STAGGER_MS = 42;
const STAGGER_CAP = 11;

function chunkPairs<T>(items: readonly T[]): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += 2) {
    rows.push(items.slice(i, i + 2) as T[]);
  }
  return rows;
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return reduced;
}

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

function FeatureSpot({
  feature,
  index,
  revealed,
  reducedMotion,
}: {
  feature: MarketingFeature;
  index: number;
  revealed: boolean;
  reducedMotion: boolean;
}) {
  const delayMs = reducedMotion ? 0 : Math.min(index, STAGGER_CAP) * STAGGER_MS;
  const label = String(index + 1).padStart(2, "0");

  return (
    <article
      className={`flex gap-4 sm:gap-5 md:min-h-[5.5rem] md:items-start ${
        revealed
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } transition-[opacity,transform] duration-[580ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-200`}
      style={
        revealed
          ? { transitionDelay: `${delayMs}ms` }
          : { transitionDelay: "0ms" }
      }
    >
      <div className="relative h-[3.25rem] w-[3.25rem] shrink-0 overflow-hidden rounded-2xl sm:h-14 sm:w-14">
        <Image
          src={feature.imageSrc}
          alt=""
          fill
          className="object-contain p-1.5 sm:p-2"
          sizes="(min-width: 768px) 56px, 52px"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
          <span className="font-mono text-[0.65rem] font-medium tabular-nums tracking-[0.14em] text-[#c4b8a8]">
            {label}
          </span>
          <h3 className="font-wa-display text-[0.9375rem] font-semibold tracking-[-0.01em] text-[#1f1c19] sm:text-base">
            {feature.title}
          </h3>
        </div>
        <p className="mt-1.5 max-w-prose text-pretty text-[0.8125rem] leading-relaxed text-[#5c564f] sm:text-sm">
          {feature.description}
        </p>
      </div>
    </article>
  );
}

export function HomeFeaturesSection() {
  const { ref, visible } = useSectionRevealOnce();
  const reducedMotion = usePrefersReducedMotion();
  const rows = chunkPairs(marketingFeatures);

  return (
    <div ref={ref} className="w-full border-t border-[#ebe7e0]/90 pb-12 pt-2 sm:pb-14 sm:pt-3">
      <div className="mx-auto w-[min(100%,96vw)] max-w-[1800px] px-4 sm:px-6 lg:px-10">
        <div className="flex flex-col">
          {rows.map((pair, rowIndex) => {
            const isLastRow = rowIndex === rows.length - 1;
            return (
              <div
                key={pair.map((f) => f.id).join("-")}
                className={`flex flex-col gap-8 py-8 sm:gap-9 sm:py-9 md:flex-row md:items-start md:gap-0 md:divide-x md:divide-[#e8e2dc]/45 md:py-10 lg:py-11 ${
                  isLastRow ? "" : "border-b border-[#e8e2dc]/55"
                }`}
              >
                {pair.map((feature, cellIndex) => {
                  const globalIndex = rowIndex * 2 + cellIndex;
                  return (
                    <div key={feature.id} className="min-w-0 flex-1 md:px-8 lg:px-12">
                      <FeatureSpot
                        feature={feature}
                        index={globalIndex}
                        revealed={visible}
                        reducedMotion={reducedMotion}
                      />
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
