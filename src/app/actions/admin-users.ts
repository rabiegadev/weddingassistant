"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { writeAuditLog } from "@/app/actions/audit";

export type AdminUserActionState = { error?: string; ok?: boolean } | void;

const profileSchema = z.object({
  userId: z.string().min(1),
  weddingDate: z.string().optional(),
});

/** Admin: profil pary (data ślubu, JSON bazy informacji). */
export async function adminUpdateClientProfileAction(
  _s: AdminUserActionState,
  formData: FormData
): Promise<AdminUserActionState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Brak sesji admina (2FA)." };
  }
  const rawWedding = (formData.get("weddingDate") as string)?.trim() ?? "";
  const rawInfo = (formData.get("infoJson") as string) ?? "";
  const p = profileSchema.safeParse({
    userId: formData.get("userId") ?? "",
    weddingDate: rawWedding || undefined,
  });
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Błąd walidacji." };
  }
  const user = await prisma.user.findUnique({ where: { id: p.data.userId } });
  if (!user || user.role !== UserRole.CLIENT) {
    return { error: "Użytkownik nie jest kontem pary." };
  }
  let infoJson: string | null = null;
  if (rawInfo.trim()) {
    try {
      infoJson = JSON.stringify(JSON.parse(rawInfo) as object);
    } catch {
      return { error: "infoJson musi być poprawnym JSON." };
    }
  }
  let weddingDate: Date | null = null;
  if (p.data.weddingDate) {
    const d = new Date(p.data.weddingDate);
    if (!Number.isFinite(d.getTime())) {
      return { error: "Niepoprawna data ślubu." };
    }
    weddingDate = d;
  }
  await prisma.clientProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      weddingDate,
      infoJson,
    },
    update: {
      weddingDate,
      infoJson,
    },
  });
  await writeAuditLog(a.user.id, "clientProfile.update", "User", user.id, {
    weddingDate: weddingDate?.toISOString() ?? null,
    infoJson: Boolean(infoJson),
  });
  revalidatePath("/admin/uzytkownicy");
  revalidatePath(`/admin/uzytkownicy/${user.id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

const userEditSchema = z.object({
  userId: z.string().min(1),
  name: z.string().max(200).optional(),
  email: z.string().email("Niepoprawny e-mail").max(320),
});

/** Admin: edycja podstawowych danych użytkownika (para). */
export async function adminUpdateUserAction(
  _s: AdminUserActionState,
  formData: FormData
): Promise<AdminUserActionState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Brak sesji admina (2FA)." };
  }
  const p = userEditSchema.safeParse({
    userId: formData.get("userId") ?? "",
    name: (formData.get("name") as string)?.trim() || undefined,
    email: (formData.get("email") as string)?.trim() ?? "",
  });
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Błąd walidacji." };
  }
  const user = await prisma.user.findUnique({ where: { id: p.data.userId } });
  if (!user || user.role !== UserRole.CLIENT) {
    return { error: "Edycja dotyczy tylko kont pary." };
  }
  const emailNorm = p.data.email.toLowerCase();
  const clash = await prisma.user.findFirst({
    where: { email: emailNorm, NOT: { id: user.id } },
  });
  if (clash) {
    return { error: "Ten adres e-mail jest już zajęty." };
  }
  await prisma.user.update({
    where: { id: user.id },
    data: {
      email: emailNorm,
      name: p.data.name?.trim() || null,
    },
  });
  await writeAuditLog(a.user.id, "user.update", "User", user.id, { email: emailNorm });
  revalidatePath("/admin/uzytkownicy");
  revalidatePath(`/admin/uzytkownicy/${user.id}`);
  return { ok: true };
}
