import Link from "next/link";
import { parseLogowanieKontekst } from "@/lib/validation/logowanie-kontekst";
import { ClientLoginForm } from "@/components/auth/client-login-form";
import { AdminLoginForm } from "@/components/auth/admin-login-form";
import { getClientSession, getAnyAdminSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getAdmin2faEntryPath } from "@/lib/auth/mfa-routing";

type P = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = "force-dynamic";

export default async function LogowaniePage({ searchParams }: P) {
  const sp = (await searchParams) ?? {};
  const { kontekst } = parseLogowanieKontekst({ k: sp.k });
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
        className={
          kontekst === "admin"
            ? "mx-auto w-full max-w-md rounded-2xl border border-amber-800/30 bg-zinc-950/95 p-6 shadow-lg sm:p-8"
            : "mx-auto w-full max-w-md rounded-2xl border border-[#E0D0B0]/50 bg-white p-6 shadow-sm sm:p-8"
        }
      >
        <h1
          className={
            kontekst === "admin"
              ? "text-center font-sans text-2xl font-medium text-amber-100/95"
              : "text-center font-serif text-2xl font-semibold text-[#2B2B2B]"
          }
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
            <p className="mt-4 text-center text-sm text-[#3A3A3A]">
              Potrzebny panel obsługi? —{" "}
              <Link className="font-medium text-[#5A5A5A] underline" href="/logowanie?k=admin">
                przełącz
              </Link>
            </p>
          </>
        ) : (
          <>
            <p className="mt-1 text-center text-sm text-amber-100/60">Tylko dla wyznaczonych kont (admin/obsługa).</p>
            <p className="mt-1 text-center text-sm">
              <Link className="text-amber-200/60 underline" href="/logowanie?k=client">
                Jestem parą
              </Link>{" "}
              · <Link className="text-amber-200/60 underline" href="/">Strona główna</Link>
            </p>
            <AdminLoginForm />
          </>
        )}
      </div>
    </div>
  );
}
