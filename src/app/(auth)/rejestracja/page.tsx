import Link from "next/link";
import { getClientSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/auth/register-form";
import { buildMathChallenge } from "@/lib/captcha/math-challenge";
import { MathCaptchaMissingNotice } from "@/components/auth/math-captcha-missing";

export const dynamic = "force-dynamic";

export default async function RejestracjaPage() {
  if (await getClientSession()) {
    redirect("/dashboard");
  }
  const challenge = buildMathChallenge();
  return (
    <div className="min-h-full bg-[#FDF8F0] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#E0D0B0]/50 bg-white p-6 shadow-sm sm:p-8">
        <h1 className="text-center font-serif text-2xl font-semibold text-[#2B2B2B]">Rejestracja</h1>
        <p className="mt-1 text-center text-sm text-[#4A4A4A]">Konto pary. Silne hasło, potwierdzenie e-mail.</p>
        <p className="mt-1 text-center text-sm">
          <Link className="text-[#6B5427] underline" href="/logowanie?k=client">
            Masz konto? Zaloguj się
          </Link>
        </p>
        {challenge ? <RegisterForm challenge={challenge} /> : <div className="mt-4"><MathCaptchaMissingNotice /></div>}
      </div>
    </div>
  );
}
