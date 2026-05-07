import Link from "next/link";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={[
        "relative z-[1] mt-auto shrink-0 overflow-hidden border-t border-[rgba(201,160,80,0.42)] bg-[#16120e] text-[#e8dcc8] shadow-[0_-32px_80px_-40px_rgba(0,0,0,0.55)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(228,196,140,0.55)] to-transparent shadow-[0_-8px_32px_rgba(228,196,140,0.12)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[20%] bottom-[-40%] h-[min(55vw,420px)] w-[min(55vw,420px)] rounded-full opacity-[0.07]"
        style={{
          background: "radial-gradient(circle at 40% 40%, rgba(200,165,110,0.9), transparent 68%)",
          filter: "blur(48px)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] top-[-30%] h-[min(45vw,360px)] w-[min(45vw,360px)] rounded-full opacity-[0.06]"
        style={{
          background: "radial-gradient(circle at 55% 55%, rgba(175,135,88,0.85), transparent 70%)",
          filter: "blur(52px)",
        }}
      />
      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:gap-12 md:py-16">
        <div>
          <h2 className="font-serif text-lg font-semibold tracking-wide text-[#f0e4c8]">Weddingassistant.pl</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#c9bba8]">
            To rozwiązanie, które przygotowaliśmy dla siebie będąc na tym samym etapie, na którym teraz jesteście Wy - i
            chcemy się nim z wami podzielić.
          </p>
          <p className="mt-4 text-sm text-[#b8a896]">
            Strony weselne:{" "}
            <a
              href="https://weddinfo.pl/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#d4b87a] underline decoration-[#c9a050]/70 underline-offset-2 transition hover:text-[#f5e6bc]"
            >
              weddinfo.pl
            </a>
          </p>
          <p className="mt-2 text-sm text-[#b8a896]">
            Created by:{" "}
            <a
              href="https://rabiegadevelopment.pl/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#d4b87a] underline decoration-[#c9a050]/70 underline-offset-2 transition hover:text-[#f5e6bc]"
            >
              rabiegadevelopment.pl
            </a>
          </p>
        </div>
        <div className="flex flex-col justify-end md:items-end md:text-right">
          <p className="mt-1 text-xs text-[#9a8c78]">
            <Link
              className="text-[#d4b87a] underline decoration-[#c9a050]/50 underline-offset-2 hover:text-[#f5e6bc]"
              href="/nasza-historia"
            >
              Nasza historia
            </Link>
          </p>
          <p className="mt-2 text-xs text-[#9a8c78]">
            <Link
              className="text-[#d4b87a] underline decoration-[#c9a050]/50 underline-offset-2 hover:text-[#f5e6bc]"
              href="/prawo/regulamin"
            >
              Regulamin
            </Link>
            {" · "}
            <Link
              className="text-[#d4b87a] underline decoration-[#c9a050]/50 underline-offset-2 hover:text-[#f5e6bc]"
              href="/prawo/polityka-prywatnosci"
            >
              Prywatność
            </Link>
            {" · "}
            <Link
              className="text-[#d4b87a] underline decoration-[#c9a050]/50 underline-offset-2 hover:text-[#f5e6bc]"
              href="/prawo/rodo"
            >
              RODO
            </Link>
          </p>
          <p className="mt-3 text-xs text-[#7d7062]">© {new Date().getFullYear()} Weddingassistant</p>
        </div>
      </div>
    </footer>
  );
}
