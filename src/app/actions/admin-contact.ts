"use server";

import { revalidatePath } from "next/cache";
import { ContactInquiryStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { writeAuditLog } from "@/app/actions/audit";

export type AdminContactState = { error?: string; ok?: boolean } | void;

const contactStatuses = ["NEW", "READ", "ARCHIVED"] as const;

const statusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(contactStatuses),
});

export async function adminSetContactInquiryStatusAction(
  _s: AdminContactState,
  formData: FormData
): Promise<AdminContactState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Brak sesji admina (2FA)." };
  }
  const p = statusSchema.safeParse({
    id: formData.get("id") ?? "",
    status: formData.get("status") ?? "",
  });
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Błąd." };
  }
  const row = await prisma.contactInquiry.findUnique({ where: { id: p.data.id } });
  if (!row) {
    return { error: "Brak wpisu." };
  }
  const nextStatus = p.data.status as ContactInquiryStatus;
  await prisma.contactInquiry.update({
    where: { id: row.id },
    data: { status: nextStatus },
  });
  await writeAuditLog(a.user.id, "contactInquiry.status", "ContactInquiry", row.id, {
    status: nextStatus,
  });
  revalidatePath("/admin/kontakt");
  return { ok: true };
}
