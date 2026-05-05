import { UserRole } from "@prisma/client";
import { ensureClientProfile } from "@/lib/client-profile/ensure";
import { prisma } from "@/lib/db";
import type { GoogleUserInfo } from "@/lib/auth/google-oauth-flow";

export type GoogleClientAuthResult =
  | { ok: true; userId: string; shouldSendWelcome: boolean }
  | { ok: false; redirectCode: "admin" | "email" | "link" };

/**
 * Tworzy konto pary lub loguje po `googleSub` / e-mailu (powiązanie przy pierwszym logowaniu Google).
 */
export async function upsertClientUserFromGoogle(profile: GoogleUserInfo): Promise<GoogleClientAuthResult> {
  if (!profile.email_verified) {
    return { ok: false, redirectCode: "email" };
  }

  const bySub = await prisma.user.findUnique({ where: { googleSub: profile.sub } });
  if (bySub) {
    if (bySub.role !== UserRole.CLIENT) {
      return { ok: false, redirectCode: "admin" };
    }
    await prisma.user.update({
      where: { id: bySub.id },
      data: {
        name: bySub.name ?? profile.name ?? undefined,
        emailVerifiedAt: bySub.emailVerifiedAt ?? new Date(),
      },
    });
    await ensureClientProfile(bySub.id);
    return { ok: true, userId: bySub.id, shouldSendWelcome: false };
  }

  const byEmail = await prisma.user.findUnique({ where: { email: profile.email } });
  if (byEmail) {
    if (byEmail.role !== UserRole.CLIENT) {
      return { ok: false, redirectCode: "admin" };
    }
    const firstGoogleLinkForExistingEmail = byEmail.googleSub == null;
    if (byEmail.googleSub != null && byEmail.googleSub !== profile.sub) {
      return { ok: false, redirectCode: "link" };
    }
    await prisma.user.update({
      where: { id: byEmail.id },
      data: {
        googleSub: profile.sub,
        emailVerifiedAt: byEmail.emailVerifiedAt ?? new Date(),
        name: byEmail.name ?? profile.name ?? undefined,
      },
    });
    await ensureClientProfile(byEmail.id);
    return { ok: true, userId: byEmail.id, shouldSendWelcome: firstGoogleLinkForExistingEmail };
  }

  const created = await prisma.user.create({
    data: {
      email: profile.email,
      name: profile.name ?? null,
      role: UserRole.CLIENT,
      googleSub: profile.sub,
      passwordHash: null,
      emailVerifiedAt: new Date(),
      clientProfile: { create: {} },
    },
  });
  return { ok: true, userId: created.id, shouldSendWelcome: true };
}
