import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "Realizacje stron weselnych | Weddingassistant",
  description: "Przykładowe strony weselne na Weddiinfo — galeria realizacji.",
};

const EXAMPLES = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;
const THUMB = ["/images/weddingweb.png", "/images/domain2.png", "/images/checklista.png"] as const;

export default function RealizacjePage() {
  return (
    <main className="border-b border-[#e8e2dc]/70 bg-[#f9f6f0]">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 pb-20 sm:px-6 sm:py-14 sm:pb-24">
        <nav className="text-sm text-[#6b645c]">
          <Link href="/" className="font-medium text-[#6B5427] underline-offset-2 hover:underline">
            Strona główna
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-[#4a4238]">Realizacje</span>
        </nav>
        <h1 className="mt-3 font-wa-display text-2xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-3xl">
          Więcej przykładowych realizacji
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5a534c] sm:text-base">
          Poniżej kolejne adresy przykładowe (placeholdery). Pierwsze trzy są także na{" "}
          <Link href="/#strona-wesela" className="font-medium text-[#6B5427] underline">
            stronie głównej
          </Link>
          .
        </p>

        <ul className="mt-10 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {EXAMPLES.map((n, i) => {
            const href = `https://example${n}.weddinfo.pl/`;
            const thumb = THUMB[i % THUMB.length];
            return (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col overflow-hidden rounded-2xl border border-[#e8e2dc] bg-white shadow-sm transition hover:border-[#d4c4a8] hover:shadow-md"
                >
                  <div className="relative aspect-[16/10] border-b border-[#efe8df] bg-[#faf8f4]">
                    <Image
                      src={thumb}
                      alt=""
                      fill
                      className="object-contain p-3"
                      sizes="(min-width: 1024px) 320px, 50vw, 100vw"
                    />
                  </div>
                  <div className="p-4">
                    <p className="font-wa-display text-base font-semibold text-[#2E2A26]">Realizacja {n}</p>
                    <p className="mt-1 font-mono text-sm text-[#6B5427]">example{n}.weddinfo.pl</p>
                  </div>
                </a>
              </li>
            );
          })}
        </ul>

        <p className="mt-12 text-center text-sm text-[#5c564f]">
          <a
            href="https://weddinfo.pl/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-[#6B5427] underline underline-offset-2"
          >
            weddinfo.pl
          </a>
        </p>
      </div>
    </main>
  );
}
