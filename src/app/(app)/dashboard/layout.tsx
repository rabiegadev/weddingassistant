import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth/session";
import Link from "next/link";
import { logoutClientAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

/**
 * Tylko sesja typu `CLIENT` z ciasteczka `wa_s_client`. Sesja `wa_s_admin` nie otwiera tej strefy.
 */
export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientSession();
  if (!session) {
    redirect("/logowanie?k=client");
  }
  return (
    <div className="min-h-full bg-[#F2F0EC] text-[#1A1A1A]">
      <div className="mb-0 border-b border-[#D0D0D0]/50 bg-gradient-to-b from-white to-[#ECE8E0]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-3 sm:px-6 sm:flex-row sm:items-baseline sm:justify-between sm:py-4">
          <h1 className="font-serif text-base font-semibold sm:text-lg">Panel pary młodej</h1>
          <p className="text-xs text-[#4A4A4A] sm:max-w-md sm:truncate" title={session.user.email}>
            {session.user.email}
          </p>
        </div>
        <div className="border-t border-[#C8C0B8]/30 bg-white/30">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-1 px-4 py-1.5 text-sm sm:px-6">
            <Link className="rounded px-2 py-1 hover:bg-white/50" href="/dashboard">
              Pulpit
            </Link>
            <Link className="rounded px-2 py-1 hover:bg-white/50" href="/cennik">
              Cennik
            </Link>
            <Link className="rounded px-2 py-1 hover:bg-white/50" href="/dashboard/zamowienia">
              Moje zamówienia
            </Link>
            <form className="ml-auto inline" action={logoutClientAction}>
              <button className="rounded px-2 py-1 text-[#5A3A0A] hover:underline" type="submit">
                Wyloguj
              </button>
            </form>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
