import { prisma } from "@/lib/db";

/**
 * Tworzy pusty profil klienta przy pierwszym wejściu (idempotentnie).
 */
export async function ensureClientProfile(userId: string): Promise<void> {
  await prisma.clientProfile.upsert({
    where: { userId },
    create: { userId },
    update: {},
  });
}
