import type { PlatformTool } from "@/data/platform-tools";

type Props = {
  tool: PlatformTool;
};

type TierKind = "free" | "mid" | "premium";

function TierBlock({
  label,
  kind,
  bullets,
}: {
  label: string;
  kind: TierKind;
  bullets: string[];
}) {
  const accent =
    kind === "free"
      ? "border-[#8FA894]/50 bg-white/90 text-[#2D3B32]"
      : kind === "mid"
        ? "border-[#B8955C]/45 bg-[#FFFCF7] text-[#3D331F]"
        : "border-[#6B5427]/40 bg-gradient-to-b from-[#2D4A32]/[0.07] to-white/95 text-[#2A2620]";

  return (
    <div
      className={`rounded-xl border px-3 py-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.65)] ${accent}`}
    >
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-[#6A5A4A]">
        {label}
      </p>
      <ul className="mt-2 space-y-1.5 text-[0.78rem] leading-snug text-[#3F3A35] sm:text-[0.8125rem]">
        {bullets.map((line) => (
          <li key={line} className="flex gap-2 text-pretty">
            <span className="shrink-0 select-none font-medium text-[#B8955C]" aria-hidden>
              –
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PlatformToolTile({ tool }: Props) {
  return (
    <article
      className="flex flex-col rounded-2xl border border-[#D4C4A8]/90 bg-gradient-to-b from-white via-white to-[#FAF6EE] p-4 shadow-[0_14px_40px_-18px_rgba(62,44,18,0.45),0_0_0_1px_rgba(184,149,92,0.12)] ring-1 ring-white/80 transition hover:shadow-[0_18px_46px_-14px_rgba(62,44,18,0.5)] sm:p-5"
    >
      <h3 className="font-wa-display text-lg font-semibold leading-snug tracking-[0.01em] text-[#2E2A26] sm:text-xl">
        {tool.title}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-[#5A534C] sm:text-[0.9375rem]">{tool.summary}</p>

      <div className="mt-5 grid flex-1 grid-cols-1 gap-3 md:grid-cols-3 md:gap-2.5 lg:gap-3">
        <TierBlock kind="free" label="Wersja free" bullets={tool.free.bullets} />
        <TierBlock kind="mid" label="Wersja mid" bullets={tool.mid.bullets} />
        <TierBlock kind="premium" label="Wersja premium" bullets={tool.premium.bullets} />
      </div>
    </article>
  );
}
