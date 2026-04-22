import Link from "next/link";
import { getClientSession } from "@/lib/auth/session";

export default async function DashboardPage() {
  const s = await getClientSession();
  if (!s) {
    return null; // layout już przekieruje, ale TypeScript
  }
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="font-sans text-lg font-semibold text-[#1A1A1A]">Pulpit</h2>
      <p className="mt-1 text-sm text-[#4A4A4A]">Zalogowano. Od tej strony: zamówienia, wiadomości, status, w przyszłości więcej modułów (RSVP, lista gości…).</p>
      <p className="mt-2 text-sm text-[#2B2B2B]">Konto: {s.user.id.slice(0, 8)}…</p>
      <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-[#2B2B2B]">
        <li>
          <Link className="font-medium text-[#4A2A0A] underline" href="/cennik">
            Cennik
          </Link>{" "}
          — ten sam katalog co w obsłudze
        </li>
        <li>
          <Link className="font-medium text-[#4A2A0A] underline" href="/dashboard/zamowienia">
            Moje zamówienia
          </Link>{" "}
          — wątek, wiadomości, status
        </li>
        <li>
          <Link className="text-[#2B2B2B] underline" href="/">
            Strona główna
          </Link>
        </li>
      </ul>
    </div>
  );
}
