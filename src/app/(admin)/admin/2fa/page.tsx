import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getAnyAdminSession } from "@/lib/auth/session";
import { AdminTotpForm } from "@/components/auth/admin-totp-form";

export const dynamic = "force-dynamic";

/**
 * Weryfikacja TOTP po hasłem (gdy 2FA już włączone).
 */
export default async function Admin2faPage() {
  const s = await getAnyAdminSession();
  if (!s) {
    redirect("/logowanie?k=admin");
  }
  const u = await prisma.user.findUnique({ where: { id: s.user.id } });
  if (!u?.totpEnabledAt) {
    redirect("/admin/2fa/setup");
  }
  return (
    <div>
      <h1 className="text-center font-sans text-lg text-zinc-200">Kod weryfikacyjny (2FA)</h1>
      <p className="mt-1 text-center text-sm text-amber-100/70">Wprowadź 6-cyfrowy kod z Authenticatora.</p>
      <div className="mt-6">
        <AdminTotpForm action="afterLogin" />
      </div>
      <p className="mt-6 text-center text-sm text-zinc-500">
        <Link className="underline" href="/">
          Strona główna
        </Link>
      </p>
    </div>
  );
}
