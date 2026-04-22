import Link from "next/link";
import { NewPasswordForm } from "@/components/auth/new-password-form";

type P = { searchParams?: Promise<Record<string, string | string[] | undefined>> };

export const dynamic = "force-dynamic";

export default async function NoweHasloPage({ searchParams }: P) {
  const sp = (await searchParams) ?? {};
  const t = typeof sp.token === "string" ? sp.token : Array.isArray(sp.token) ? sp.token[0] : "";
  if (!t) {
    return (
      <div className="min-h-full bg-[#FDF8F0] px-4 py-10 text-center sm:px-6">
        <p className="text-sm text-rose-800">Brak tokenu w linku. Poproś o nowy e-mail z resetem.</p>
        <p className="mt-2">
          <Link className="underline" href="/reset-hasla">
            Reset hasła
          </Link>
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-full bg-[#FDF8F0] px-4 py-10 sm:px-6">
      <div className="mx-auto w-full max-w-md rounded-2xl border border-[#E0D0B0]/50 bg-white p-6 sm:p-8">
        <h1 className="text-center font-serif text-2xl font-semibold text-[#2B2B2B]">Ustaw nowe hasło</h1>
        <NewPasswordForm token={t} />
        <p className="mt-4 text-center text-sm">
          <Link className="underline" href="/logowanie?k=client">
            Do logowania
          </Link>
        </p>
      </div>
    </div>
  );
}
