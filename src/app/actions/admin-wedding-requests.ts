"use server";

import { revalidatePath } from "next/cache";
import { WeddingPageRequestStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { writeAuditLog } from "@/app/actions/audit";

export type AdminWeddingReqState = { error?: string; ok?: boolean } | void;

const weddingReqStatuses = [
  "NEW",
  "IN_REVIEW",
  "IN_PROGRESS",
  "AWAITING_CLIENT",
  "DONE",
  "CANCELLED",
] as const;

const updateSchema = z.object({
  id: z.string().min(1),
  status: z.enum(weddingReqStatuses),
  internalNote: z.string().max(8000).optional(),
});

export async function adminUpdateWeddingPageRequestAction(
  _s: AdminWeddingReqState,
  formData: FormData
): Promise<AdminWeddingReqState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Brak sesji admina (2FA)." };
  }
  const p = updateSchema.safeParse({
    id: formData.get("id") ?? "",
    status: formData.get("status") ?? "",
    internalNote: (formData.get("internalNote") as string) || "",
  });
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Błąd walidacji." };
  }
  const row = await prisma.weddingPageRequest.findUnique({ where: { id: p.data.id } });
  if (!row) {
    return { error: "Brak zgłoszenia." };
  }
  const nextStatus = p.data.status as WeddingPageRequestStatus;
  await prisma.weddingPageRequest.update({
    where: { id: row.id },
    data: {
      status: nextStatus,
      internalNote: p.data.internalNote?.trim() || null,
    },
  });
  await writeAuditLog(a.user.id, "weddingPageRequest.update", "WeddingPageRequest", row.id, {
    status: nextStatus,
  });
  revalidatePath("/admin/strony-weselne");
  return { ok: true };
}

const createSchema = z.object({
  userEmail: z.string().email(),
});

/** Utworzenie zgłoszenia dla istniejącego konta pary (po e-mailu). */
export async function adminCreateWeddingPageRequestAction(
  _s: AdminWeddingReqState,
  formData: FormData
): Promise<AdminWeddingReqState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Brak sesji admina (2FA)." };
  }
  const p = createSchema.safeParse({
    userEmail: (formData.get("userEmail") as string)?.trim() ?? "",
  });
  if (!p.success) {
    return { error: "Podaj poprawny e-mail użytkownika." };
  }
  const user = await prisma.user.findUnique({
    where: { email: p.data.userEmail.toLowerCase() },
  });
  if (!user) {
    return { error: "Nie znaleziono użytkownika z tym adresem." };
  }
  await prisma.weddingPageRequest.create({
    data: {
      userId: user.id,
      status: WeddingPageRequestStatus.NEW,
    },
  });
  await writeAuditLog(a.user.id, "weddingPageRequest.create", "User", user.id, {});
  revalidatePath("/admin/strony-weselne");
  return { ok: true };
}
