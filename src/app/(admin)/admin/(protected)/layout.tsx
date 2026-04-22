import Link from "next/link";
import { redirect } from "next/navigation";
import { getAnyAdminSession, getFullAdminSession } from "@/lib/auth/session";
import { getAdmin2faEntryPath } from "@/lib/auth/mfa-routing";
import { logoutAdminAction } from "@/app/actions/auth";

export const dynamic = "force-dynamic";

export default async function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const full = await getFullAdminSession();
  if (full) {
    return (
      <div className="min-h-0 flex-1">
        <div className="mb-0 border-b border-amber-900/40 bg-gradient-to-b from-zinc-900/70 to-zinc-950/90">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
            <h1 className="font-sans text-base font-medium tracking-tight sm:text-lg">Weddingassistant — obsługa</h1>
            <p className="text-xs text-amber-100/60" title={full.user.email}>
              {full.user.email}
            </p>
            <nav className="flex flex-wrap items-center gap-2 text-sm" aria-label="Nawigacja admina">
              <Link className="rounded-md px-2 py-1 text-amber-100/90 hover:bg-zinc-800" href="/admin">
                Kokpit
              </Link>
              <Link className="rounded-md px-2 py-1 text-amber-100/90 hover:bg-zinc-800" href="/admin/pakiety">
                Pakiety
              </Link>
              <Link className="rounded-md px-2 py-1 text-amber-100/90 hover:bg-zinc-800" href="/admin/zamowienia">
                Zamówienia
              </Link>
              <form action={logoutAdminAction} className="inline">
                <button
                  type="submit"
                  className="rounded-md px-2 py-1 text-amber-200/80 hover:bg-zinc-800"
                >
                  Wyloguj
                </button>
              </form>
            </nav>
          </div>
        </div>
        {children}
      </div>
    );
  }
  const any = await getAnyAdminSession();
  if (!any) {
    redirect("/logowanie?k=admin");
  }
  const go = await getAdmin2faEntryPath(any.user.id);
  redirect(go);
}
