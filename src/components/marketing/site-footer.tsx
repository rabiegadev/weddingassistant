import Link from "next/link";

type SiteFooterProps = {
  className?: string;
};

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={["mt-auto border-t border-[#E8DCC4]/60 bg-[#FDF8F0]", className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-2">
        <div>
          <h2 className="font-serif text-lg font-semibold text-[#2B2B2B]">Weddingassistant.pl</h2>
          <p className="mt-2 text-sm text-[#4A4A4A]">
            Planowanie, lista gości, RSVP, harmonogram, budżet i wspomnienia w jednej spójnej
            platformie. Obecna wersja: szkielet + sesje, kolejne moduły w roadmapie.
          </p>
        </div>
        <div className="md:text-right">
          <p className="text-sm text-[#4A4A4A]">Dołącz, gdy będziesz gotowy.</p>
          <p className="mt-1 text-sm">
            <Link
              className="font-medium text-[#6B5427] underline-offset-2 hover:underline"
              href="/logowanie?k=client"
            >
              Zaloguj się / panel pary
            </Link>
          </p>
          <p className="mt-2 text-xs text-[#5A5A5A]">
            <Link className="hover:underline" href="/prawo/regulamin">Regulamin</Link> ·{" "}
            <Link className="hover:underline" href="/prawo/polityka-prywatnosci">Prywatność</Link> ·{" "}
            <Link className="hover:underline" href="/prawo/rodo">RODO</Link>
          </p>
          <p className="mt-4 text-xs text-[#6A6A6A]">© {new Date().getFullYear()} Weddingassistant</p>
        </div>
      </div>
    </footer>
  );
}
