import Link from "next/link";
import { parseLogowanieKontekst } from "@/lib/validation/logowanie-kontekst";
import { ClientLoginForm } from "@/components/auth/client-login-form";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { getClientSession, getAnyAdminSession, getFullAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getAdmin2faEntryPath } from "@/lib/auth/mfa-routing";

type P = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = "force-dynamic";

export default async function LogowaniePage({ searchParams }: P) {
  const sp = (await searchParams) ?? {};
  const { kontekst } = parseLogowanieKontekst({ k: sp.k });
  if (kontekst === "client" && (await getFullAdminSession())) {
    redirect("/admin");
  }
  if (kontekst === "client" && (await getClientSession())) {
    redirect("/dashboard");
  }
  if (kontekst === "admin") {
    const any = await getAnyAdminSession();
    if (any?.mfaComplete) {
      redirect("/admin");
    }
    if (any && !any.mfaComplete) {
      const p = await getAdmin2faEntryPath(any.user.id);
      redirect(p);
    }
  }

  const tytuł =
    kontekst === "admin" ? "Logowanie — obsługa" : "Logowanie pary młodej / gościa";

  return (
    <div className="min-h-full bg-[#FDF8F0] px-4 py-10 sm:px-6">
      <div
        className="mx-auto w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm sm:p-8"
      >
        <h1
          className="text-center font-sans text-2xl font-semibold text-slate-900"
        >
          {tytuł}
        </h1>
        {kontekst === "client" ? (
          <>
            <p className="mt-1 text-center text-sm text-[#4A4A4A]">
              Po zatwierdzeniu rejestracji w e-mailu będziesz mógł w pełni korzystać z panelu.
            </p>
            <p className="mt-1 text-center text-sm">
              <Link className="font-medium text-[#6B5427] underline" href="/rejestracja">
                Rejestracja
              </Link>{" "}
              ·{" "}
              <Link className="text-[#3A3A3A] underline" href="/reset-hasla">
                reset hasła
              </Link>
            </p>
            <ClientLoginForm />
          </>
        ) : (
          <>
            <p className="mt-1 text-center text-sm text-slate-600">Tylko dla wyznaczonych kont (admin/obsługa).</p>
            <p className="mt-1 text-center text-sm">
              <Link className="text-slate-700 underline" href="/logowanie?k=client">
                Jestem parą
              </Link>{" "}
              · <Link className="text-slate-700 underline" href="/">Strona główna</Link>
            </p>
            <AdminLoginForm />
          </>
        )}
      </div>
    </div>
  );
}
