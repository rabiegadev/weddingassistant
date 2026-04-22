import { prisma } from "@/lib/db";

export async function getAdmin2faEntryPath(
  userId: string
): Promise<"/admin/2fa" | "/admin/2fa/setup"> {
  const u = await prisma.user.findUnique({
    where: { id: userId },
    select: { totpEnabledAt: true },
  });
  if (u?.totpEnabledAt) {
    return "/admin/2fa";
  }
  return "/admin/2fa/setup";
}
