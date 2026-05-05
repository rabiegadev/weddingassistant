import Link from "next/link";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={[
        "mt-auto border-t border-[#c9a050]/50 bg-[#1a1510] text-[#e8dcc8]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
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
