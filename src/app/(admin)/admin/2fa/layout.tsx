import { redirect } from "next/navigation";
import { getAnyAdminSession, getFullAdminSession } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/**
 * Krok 2–3 logowania admina: pełen dostęp tylko po dokończeniu 2FA.
 * Brak kolidowania z sesją pary.
 */
export default async function Admin2faLayout({ children }: { children: React.ReactNode }) {
  const any = await getAnyAdminSession();
  if (!any) {
    redirect("/logowanie?k=admin");
  }
  const full = await getFullAdminSession();
  if (full) {
    redirect("/admin");
  }
  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col justify-center bg-slate-100 px-4 py-8 text-slate-900">
      {children}
    </div>
  );
}
