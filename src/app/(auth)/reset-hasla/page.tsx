import Link from "next/link";
import { RequestPasswordForm } from "@/components/auth/request-password-form";
import { buildMathChallenge } from "@/lib/captcha/math-challenge";

export const dynamic = "force-dynamic";

export default function ResetHaslaPage() {
  const challenge = buildMathChallenge();
  return (
    <div className="min-h-full bg-[#FDF8F0] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#E0D0B0]/50 bg-white p-6 sm:p-8">
        <h1 className="text-center font-serif text-2xl font-semibold text-[#2B2B2B]">Reset hasła</h1>
        <p className="mt-1 text-center text-sm text-[#4A4A4A]">Wyślemy link, jeśli konto z tym e-mailem istnieje.</p>
        <p className="mt-1 text-center text-sm">
          <Link className="underline" href="/logowanie?k=client">
            Wróć do logowania
          </Link>
        </p>
        <RequestPasswordForm challenge={challenge} />
      </div>
    </div>
  );
}
