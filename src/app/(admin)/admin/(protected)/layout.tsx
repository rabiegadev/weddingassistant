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
      <div className="flex min-h-screen flex-1 flex-col bg-gradient-to-b from-slate-100 via-slate-50 to-white">
        <div className="border-b border-slate-800/20 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-md">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div>
              <h1 className="font-sans text-lg font-semibold tracking-tight text-white">
                Weddingassistant — panel obsługi
              </h1>
              <p className="mt-0.5 text-xs text-slate-300" title={full.user.email}>
                {full.user.email}
              </p>
            </div>
            <nav
              className="flex flex-wrap items-center gap-1 text-sm font-medium"
              aria-label="Nawigacja admina"
            >
              <Link className="rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10" href="/admin">
                Kokpit
              </Link>
              <Link className="rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10" href="/admin/uzytkownicy">
                Pary
              </Link>
              <Link className="rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10" href="/admin/pakiety">
                Pakiety
              </Link>
              <Link className="rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10" href="/admin/zamowienia">
                Zamówienia
              </Link>
              <Link className="rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10" href="/admin/kontakt">
                Kontakt
              </Link>
              <Link className="rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10" href="/admin/strony-weselne">
                Strony WWW
              </Link>
              <Link className="rounded-lg px-3 py-2 text-slate-100 hover:bg-white/10" href="/admin/powiadomienia">
                Powiadomienia
              </Link>
              <form action={logoutAdminAction} className="inline">
                <button
                  type="submit"
                  className="rounded-lg px-3 py-2 text-amber-100/90 underline decoration-amber-300/50 underline-offset-2 hover:bg-white/10"
                >
                  Wyloguj
                </button>
              </form>
            </nav>
          </div>
        </div>
        <div className="flex-1">{children}</div>
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
