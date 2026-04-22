import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import qrcode from "qrcode";
import { prisma } from "@/lib/db";
import { getAnyAdminSession } from "@/lib/auth/session";
import { getOrCreateTotpSetupSecretB32ForAdmin, buildOtpAuthUrl } from "@/lib/auth/totp-app";
import { AdminTotpForm } from "@/components/auth/admin-totp-form";

export const dynamic = "force-dynamic";

export default async function Admin2faSetupPage() {
  const s = await getAnyAdminSession();
  if (!s) {
    redirect("/logowanie?k=admin");
  }
  const u = await prisma.user.findUnique({ where: { id: s.user.id } });
  if (u?.totpEnabledAt) {
    redirect("/admin/2fa");
  }
  const secret = await getOrCreateTotpSetupSecretB32ForAdmin(s.user.id);
  const url = buildOtpAuthUrl(s.user.email, secret);
  const dataUrl = await qrcode.toDataURL(url, { width: 256, margin: 1, color: { dark: "#0a0a0a", light: "#ffffff" } });
  return (
    <div>
      <h1 className="text-center font-sans text-lg font-medium text-slate-900">Pierwsze włączenie 2FA</h1>
      <p className="mt-2 text-center text-sm text-slate-600">
        Zeskanuj kod w Google Authenticator / 1Password itd. Następnie wpisz 6-cyfrowy kod, aby zatwierdzić.
      </p>
      <div className="mt-4 flex justify-center">
        <Image width={200} height={200} className="rounded-md bg-white p-2" src={dataUrl} alt="Kod QR 2FA" unoptimized />
      </div>
      <p className="mt-2 break-all text-center text-xs text-slate-500">Ręcznie: {secret}</p>
      <div className="mt-4">
        <AdminTotpForm action="firstSetup" />
      </div>
      <p className="mt-4 text-center text-sm text-slate-500">
        <Link className="underline" href="/">
          Strona główna
        </Link>
      </p>
    </div>
  );
}
