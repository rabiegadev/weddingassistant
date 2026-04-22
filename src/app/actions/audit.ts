import { prisma } from "@/lib/db";

/**
 * Podstawowy dziennik błędów/operacji admina (MVP, bez wymogu na UI).
 */
export async function writeAuditLog(
  adminId: string,
  action: string,
  targetType: string,
  targetId: string,
  details: unknown
): Promise<void> {
  try {
    const detailsJson =
      details === null || details === undefined ? null : JSON.stringify(details);
    await prisma.auditLog.create({
      data: {
        adminId,
        action,
        targetType,
        targetId,
        detailsJson,
      },
    });
  } catch {
    // nie zatrzymuj głównej operacji, jeśli tabela auditów jest niedostępna
  }
}
