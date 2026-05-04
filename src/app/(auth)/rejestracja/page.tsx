import Link from "next/link";
import { getClientSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { GoogleSignInPanel } from "@/components/auth/google-sign-in-panel";
import { getRegisterPreflight, isRegistrationFormConfigured } from "@/lib/captcha/register-preflight";
import { RegistrationProtectionMissingNotice } from "@/components/auth/registration-protection-missing";

export const dynamic = "force-dynamic";

type P = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export default async function RejestracjaPage({ searchParams }: P) {
  if (await getClientSession()) {
    redirect("/dashboard");
  }
  const sp = (await searchParams) ?? {};
  const googleErr = typeof sp.ge === "string" ? sp.ge : undefined;
  const preflight = getRegisterPreflight();
  const canRegister = isRegistrationFormConfigured(preflight);

  return (
    <div className="min-h-full bg-[#FDF8F0] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#E0D0B0]/50 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-center font-serif text-2xl font-semibold text-[#2B2B2B]">Rejestracja</h1>
        <p className="mt-1 text-center text-sm text-[#4A4A4A]">
          Konto pary: Google (od razu aktywne) albo e-mail z silnym hasłem i potwierdzeniem skrzynki.
        </p>
        <p className="mt-1 text-center text-sm">
          <Link className="text-[#6B5427] underline" href="/logowanie?k=client">
            Masz konto? Zaloguj się
          </Link>
        </p>
        <GoogleSignInPanel errorCode={googleErr} />
        {canRegister ? (
          <RegisterForm preflight={preflight} />
        ) : (
          <div className="mt-4">
            <RegistrationProtectionMissingNotice />
          </div>
        )}
      </div>
    </div>
  );
}
