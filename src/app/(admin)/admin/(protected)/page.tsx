import Link from "next/link";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminKokpitPage() {
  const s = await getFullAdminSession();
  if (!s) {
    return null;
  }
  const [orders, packages] = await Promise.all([
    prisma.order.count(),
    prisma.package.count(),
  ]);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="font-sans text-lg text-zinc-200">Kokpit</h2>
      <p className="mt-1 text-sm text-amber-100/70">Przegląd operacyjny (MVP).</p>
      <ul className="mt-4 grid list-none gap-3 sm:grid-cols-2">
        <li className="rounded-lg border border-amber-900/30 bg-zinc-900/50 p-4">
          <p className="text-2xl font-semibold text-amber-200">{orders}</p>
          <p className="text-sm text-zinc-400">Zamówienia łącznie</p>
        </li>
        <li className="rounded-lg border border-amber-900/30 bg-zinc-900/50 p-4">
          <p className="text-2xl font-semibold text-amber-200">{packages}</p>
          <p className="text-sm text-zinc-400">Pakiety w katalogu</p>
        </li>
      </ul>
      <p className="mt-6 text-sm text-amber-100/60">
        <Link className="text-amber-200 underline" href="/admin/pakiety">
          Konfiguruj pakiety
        </Link>{" "}
        (cennik na stronie reaguje na te same dane).
      </p>
    </div>
  );
}
