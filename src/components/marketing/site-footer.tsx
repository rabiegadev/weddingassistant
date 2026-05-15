import Link from "next/link";

type SiteFooterProps = {
  className?: string;
};

function BotanicalAccent({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 48"
      aria-hidden
      className={className}
      fill="none"
      stroke="rgba(210,175,130,0.35)"
      strokeWidth="0.9"
      strokeLinecap="round"
    >
      <path d="M8 38c12-8 18-22 16-32 4 10 12 18 22 22M28 36c6-12 18-16 28-14M52 40c8-14 24-12 36-6M76 34c10-8 18-4 28 2" />
      <path d="M14 42c4-6 8-4 12 0M94 38c6 4 12 2 16-4" opacity="0.7" />
    </svg>
  );
}

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={[
        "relative z-[1] mt-auto shrink-0 overflow-hidden border-t border-[rgba(215,180,120,0.28)] text-[#e4d8c8]",
        "bg-[linear-gradient(180deg,#14110e_0%,#0f0d0b_42%,#12100e_100%)]",
        "shadow-[0_-36px_88px_-42px_rgba(0,0,0,0.62)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Soft top glow + grain-feel radial */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-[rgba(228,200,150,0.45)] to-transparent shadow-[0_4px_42px_rgba(228,196,140,0.14)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(ellipse_85%_120%_at_50%_0%,rgba(200,165,110,0.12),transparent_62%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[25%] bottom-[-35%] h-[min(60vw,480px)] w-[min(60vw,480px)] rounded-full opacity-[0.09]"
        style={{
          background: "radial-gradient(circle at 42% 42%, rgba(185,145,95,0.95), transparent 68%)",
          filter: "blur(56px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[18%] top-[-25%] h-[min(50vw,380px)] w-[min(50vw,380px)] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle at 55% 48%, rgba(160,125,85,0.9), transparent 72%)",
          filter: "blur(52px)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-16 pt-20 sm:px-8 sm:pb-20 sm:pt-24">
        <BotanicalAccent className="mx-auto mb-12 h-10 w-[min(280px,72vw)] opacity-90" />

        <div className="grid gap-14 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:gap-16 md:items-start">
          <div className="space-y-5">
            <p className="font-wa-display text-[clamp(1.5rem,2.8vw,1.85rem)] font-semibold leading-[1.2] tracking-[0.02em] text-[#f2e6d4]">
              Weddingassistant
            </p>
            <p className="max-w-md text-[0.9375rem] leading-[1.75] text-[#b8a99a]">
              Stworzony z myślą o parach, które chcą planować spokojniej — w jednej, dopracowanej przestrzeni.
            </p>
            <div className="flex flex-col gap-2 text-sm text-[#9a8b7c] sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5 sm:gap-y-1">
              <a
                href="https://weddinfo.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-[#d4b87a] transition hover:text-[#f0e4c8]"
              >
                weddinfo.pl
              </a>
              <span className="hidden text-[#5c5248] sm:inline" aria-hidden>
                |
              </span>
              <a
                href="https://rabiegadevelopment.pl/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit text-[#b5a08c] transition hover:text-[#e0d0bc]"
              >
                rabiegadevelopment.pl
              </a>
            </div>
          </div>

          <nav
            className="flex flex-col gap-6 md:items-end md:text-right"
            aria-label="Stopka — linki"
          >
            <Link href="/nasza-historia" className="text-[15px] text-[#cfbfab] transition hover:text-[#f5ebe0]">
              Nasza historia
            </Link>
            <div className="flex flex-col gap-3 text-[13px] text-[#8f8376] sm:items-end">
              <Link href="/prawo/regulamin" className="transition hover:text-[#d8c8b4]">
                Regulamin
              </Link>
              <Link href="/prawo/polityka-prywatnosci" className="transition hover:text-[#d8c8b4]">
                Prywatność
              </Link>
              <Link href="/prawo/rodo" className="transition hover:text-[#d8c8b4]">
                RODO
              </Link>
            </div>
            <p className="mt-2 font-wa-display text-[13px] tracking-[0.12em] text-[#6d645b]">
              © {new Date().getFullYear()} Weddingassistant
            </p>
          </nav>
        </div>
      </div>
    </footer>
  );
}
