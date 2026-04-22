import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashSessionTokenToHex } from "@/lib/crypto/session-token";
import { getAppPublicUrl } from "@/lib/env/public";

/**
 * Link z maila: /api/auth/verify-email?token=...
 */
export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const raw = u.searchParams.get("token");
  if (!raw) {
    return NextResponse.redirect(new URL("/logowanie?e=brak+tokenu", getAppPublicUrl()));
  }
  const th = hashSessionTokenToHex(raw);
  const t = await prisma.emailVerificationToken.findFirst({
    where: { tokenHash: th, expiresAt: { gt: new Date() } },
  });
  if (!t) {
    return NextResponse.redirect(new URL("/logowanie?e=link+niepoprawny", getAppPublicUrl()));
  }
  await prisma.$transaction([
    prisma.user.update({
      where: { id: t.userId },
      data: { emailVerifiedAt: new Date() },
    }),
    prisma.emailVerificationToken.delete({ where: { id: t.id } }),
  ]);
  return NextResponse.redirect(new URL("/logowanie?k=client&w=1", getAppPublicUrl()));
}
