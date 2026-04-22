import Link from "next/link";
import { prisma } from "@/lib/db";

function formatPln(cents: number) {
  return (cents / 100).toLocaleString("pl-PL", { style: "currency", currency: "PLN" });
}

export async function HomeOfferSection() {
  const packages = await prisma.package.findMany({
    where: { isPublished: true },
    orderBy: { sortOrder: "asc" },
    take: 6,
  });
  if (packages.length === 0) {
    return (
      <p className="mt-2 text-sm text-[#4A4A4A] sm:text-base">
        Cennik jest w przygotowaniu.{" "}
        <Link className="font-medium text-[#6B5427] underline" href="/cennik">
          Zobacz stronę cennika
        </Link>{" "}
        — wkrótce pakiety pojawią się i tutaj.
      </p>
    );
  }
  return (
    <div className="mt-8 grid list-none grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {packages.map((p, i) => (
        <div
          key={p.id}
          className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#E0D0B0]/60 bg-gradient-to-b from-white to-[#FDF6EC] p-5 shadow-sm ring-1 ring-inset ring-white/80 transition duration-500 hover:-translate-y-1 hover:shadow-md"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[#B8955C]/10 blur-2xl transition group-hover:bg-[#B8955C]/20" />
          <p className="text-xs font-medium uppercase tracking-wider text-[#8A6A3A]">Pakiet</p>
          <h3 className="mt-1 font-serif text-lg font-semibold text-[#2B2B2B]">{p.name}</h3>
            <p className="mt-2 line-clamp-3 flex-1 text-sm text-[#4A4A4A]">{p.description}</p>
          <p className="mt-4 font-serif text-2xl font-semibold text-[#6B5427]">{formatPln(p.priceCents)}</p>
          <Link
            className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-[#B8955C] bg-white/80 py-2.5 text-sm font-medium text-[#2B2B2B] transition hover:bg-[#B8955C] hover:text-white"
            href="/cennik"
          >
            Szczegóły w cenniku
          </Link>
        </div>
      ))}
    </div>
  );
}
