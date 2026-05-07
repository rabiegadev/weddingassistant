"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Subtelne tło całej strony marketingowej: miękkie światło, warstwy, drobne „iskiery”.
 * `pointer-events-none` — nie blokuje interakcji.
 */
export function MarketingAmbientBackdrop() {
  const reduce = useReducedMotion();

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-[linear-gradient(180deg,#fdf9f3_0%,#f7f1ea_38%,#faf6ef_72%,#f4ebe1_100%)]" />
      <div
        className="absolute -left-[20%] top-[-10%] h-[min(85vh,720px)] w-[min(120vw,900px)] rounded-[46%] opacity-[0.55]"
        style={{
          background: "radial-gradient(ellipse 62% 52% at 42% 38%, rgba(228,200,160,0.14), transparent 68%)",
          filter: "blur(2px)",
        }}
      />
      <div
        className="absolute -right-[15%] top-[18%] h-[min(70vh,600px)] w-[min(100vw,700px)] rounded-[50%] opacity-40"
        style={{
          background: "radial-gradient(ellipse 58% 48% at 55% 45%, rgba(210,180,130,0.1), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-5%] left-1/2 h-[min(50vh,480px)] w-[min(130vw,1000px)] -translate-x-1/2 opacity-30"
        style={{
          background: "radial-gradient(ellipse 72% 42% at 50% 80%, rgba(232,210,175,0.12), transparent 65%)",
          filter: "blur(4px)",
        }}
      />
      {!reduce ? (
        <>
          <motion.div
            className="absolute left-[12%] top-[28%] h-[180px] w-[220px] rounded-full opacity-[0.06]"
            style={{
              background: "radial-gradient(circle at 40% 40%, rgba(190,150,95,0.9), transparent 72%)",
              filter: "blur(48px)",
            }}
            animate={{ scale: [1, 1.06, 1], opacity: [0.05, 0.09, 0.05] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-[8%] top-[42%] h-[140px] w-[180px] rounded-full opacity-[0.05]"
            style={{
              background: "radial-gradient(circle at 60% 50%, rgba(175,135,90,0.85), transparent 75%)",
              filter: "blur(40px)",
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.04, 0.08, 0.04] }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          />
          {[12, 55, 78, 34, 65, 88].map((leftPct, i) => (
            <motion.span
              key={i}
              className="absolute top-[64%] rounded-full bg-[#d4b896]"
              style={{
                left: `${leftPct}%`,
                width: 3 + (i % 3),
                height: 3 + (i % 3),
                filter: "blur(1.2px)",
              }}
              animate={{ y: [0, -10, 0], opacity: [0.08, 0.18, 0.08] }}
              transition={{ duration: 10 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.6 }}
            />
          ))}
        </>
      ) : null}
    </div>
  );
}
