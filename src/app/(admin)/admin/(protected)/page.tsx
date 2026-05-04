import Link from "next/link";
import {
  ContactInquiryStatus,
  UserRole,
  WeddingPageRequestStatus,
} from "@prisma/client";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function AdminKokpitPage() {
  const s = await getFullAdminSession();
  if (!s) {
    return null;
  }
  const [orders, packages, users, inquiriesNew, weddingOpen] = await Promise.all([
    prisma.order.count(),
    prisma.package.count(),
    prisma.user.count({ where: { role: UserRole.CLIENT } }),
    prisma.contactInquiry.count({ where: { status: ContactInquiryStatus.NEW } }),
    prisma.weddingPageRequest.count({
      where: {
        status: {
          in: [
            WeddingPageRequestStatus.NEW,
            WeddingPageRequestStatus.IN_REVIEW,
            WeddingPageRequestStatus.IN_PROGRESS,
            WeddingPageRequestStatus.AWAITING_CLIENT,
          ],
        },
      },
    }),
  ]);
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="font-sans text-xl font-semibold text-slate-900">Kokpit</h2>
      <p className="mt-1 text-sm text-slate-600">Przegląd operacyjny — skróty do codziennej pracy.</p>
      <ul className="mt-6 grid list-none gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <li className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold text-slate-900">{orders}</p>
          <p className="text-sm text-slate-500">Zamówienia</p>
          <Link className="mt-3 inline-block text-sm font-medium text-amber-900 underline" href="/admin/zamowienia">
            Lista →
          </Link>
        </li>
        <li className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold text-slate-900">{users}</p>
          <p className="text-sm text-slate-500">Pary (konta)</p>
          <Link className="mt-3 inline-block text-sm font-medium text-amber-900 underline" href="/admin/uzytkownicy">
            Zarządzaj →
          </Link>
        </li>
        <li className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold text-slate-900">{packages}</p>
          <p className="text-sm text-slate-500">Pakiety w katalogu</p>
          <Link className="mt-3 inline-block text-sm font-medium text-amber-900 underline" href="/admin/pakiety">
            Konfiguruj →
          </Link>
        </li>
        <li className="rounded-xl border border-amber-200/80 bg-amber-50/80 p-5 shadow-sm">
          <p className="text-3xl font-semibold text-amber-950">{inquiriesNew}</p>
          <p className="text-sm text-amber-900/80">Nowe zapytania kontaktowe</p>
          <Link className="mt-3 inline-block text-sm font-medium text-amber-950 underline" href="/admin/kontakt">
            Skrzynka →
          </Link>
        </li>
        <li className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <p className="text-3xl font-semibold text-slate-900">{weddingOpen}</p>
          <p className="text-sm text-slate-500">Strony WWW (otwarte zgłoszenia)</p>
          <Link className="mt-3 inline-block text-sm font-medium text-amber-900 underline" href="/admin/strony-weselne">
            Lista →
          </Link>
        </li>
      </ul>
      <p className="mt-8 text-sm text-slate-600">
        <Link className="font-medium text-amber-900 underline" href="/admin/powiadomienia">
          Rejestr wysłanych e-maili
        </Link>{" "}
        — diagnostyka SMTP i treści.
      </p>
    </div>
  );
}
