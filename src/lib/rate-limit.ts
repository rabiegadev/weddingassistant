import { prisma } from "@/lib/db";

const MAX_ATTEMPTS = 8;
const WINDOW_MINUTES = 15;

/**
 * Działa na współdzielonej bazie (Vercel-safe).
 */
export async function rateLimitOrThrow(
  key: string,
  kind: string
): Promise<void> {
  const k = `${kind}:${key}`.slice(0, 180);
  const now = new Date();
  const newWindowEnd = new Date(Date.now() + WINDOW_MINUTES * 60_000);
  const row = await prisma.rateLimitEntry.findUnique({ where: { key: k } });
  if (!row || row.windowEndsAt < now) {
    await prisma.rateLimitEntry.upsert({
      where: { key: k },
      create: { key: k, count: 1, windowEndsAt: newWindowEnd },
      update: { count: 1, windowEndsAt: newWindowEnd },
    });
    return;
  }
  if (row.count >= MAX_ATTEMPTS) {
    throw new Error("Zbyt wiele prób. Poczekaj chwilę i spróbuj ponownie.");
  }
  await prisma.rateLimitEntry.update({
    where: { key: k },
    data: { count: { increment: 1 } },
  });
}
