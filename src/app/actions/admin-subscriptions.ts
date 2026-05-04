"use server";

import { revalidatePath } from "next/cache";
import { UserRole } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { writeAuditLog } from "@/app/actions/audit";

export type AdminSubActionState = { error?: string; ok?: boolean } | void;

const createSchema = z.object({
  userId: z.string().min(1),
  packageId: z.string().min(1),
  endsAt: z.string().min(1),
});

/** Ręczne nadanie / przedłużenie planu: nowa subskrypcja (bez powiązania z zamówieniem). */
export async function adminCreateSubscriptionAction(
  _s: AdminSubActionState,
  formData: FormData
): Promise<AdminSubActionState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Brak sesji admina (2FA)." };
  }
  const p = createSchema.safeParse({
    userId: formData.get("userId") ?? "",
    packageId: formData.get("packageId") ?? "",
    endsAt: formData.get("endsAt") ?? "",
  });
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Błąd walidacji." };
  }
  const user = await prisma.user.findUnique({ where: { id: p.data.userId } });
  if (!user || user.role !== UserRole.CLIENT) {
    return { error: "Tylko konta pary." };
  }
  const pkg = await prisma.package.findUnique({ where: { id: p.data.packageId } });
  if (!pkg) {
    return { error: "Nie ma takiego pakietu." };
  }
  const endsAt = new Date(p.data.endsAt);
  if (!Number.isFinite(endsAt.getTime())) {
    return { error: "Niepoprawna data końca dostępu." };
  }
  await prisma.userSubscription.create({
    data: {
      userId: user.id,
      packageId: pkg.id,
      endsAt,
      sourceOrderId: null,
    },
  });
  await writeAuditLog(a.user.id, "subscription.create", "User", user.id, {
    packageId: pkg.id,
    endsAt: endsAt.toISOString(),
  });
  revalidatePath(`/admin/uzytkownicy/${user.id}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

const updateEndsSchema = z.object({
  subscriptionId: z.string().min(1),
  endsAt: z.string().min(1),
});

export async function adminUpdateSubscriptionEndsAction(
  _s: AdminSubActionState,
  formData: FormData
): Promise<AdminSubActionState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Brak sesji admina (2FA)." };
  }
  const p = updateEndsSchema.safeParse({
    subscriptionId: formData.get("subscriptionId") ?? "",
    endsAt: formData.get("endsAt") ?? "",
  });
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Błąd walidacji." };
  }
  const sub = await prisma.userSubscription.findUnique({
    where: { id: p.data.subscriptionId },
    include: { user: true },
  });
  if (!sub || sub.user.role !== UserRole.CLIENT) {
    return { error: "Nie znaleziono subskrypcji." };
  }
  const endsAt = new Date(p.data.endsAt);
  if (!Number.isFinite(endsAt.getTime())) {
    return { error: "Niepoprawna data." };
  }
  await prisma.userSubscription.update({
    where: { id: sub.id },
    data: { endsAt },
  });
  await writeAuditLog(a.user.id, "subscription.endsAt", "UserSubscription", sub.id, {
    endsAt: endsAt.toISOString(),
  });
  revalidatePath(`/admin/uzytkownicy/${sub.userId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}

const deleteSchema = z.object({
  subscriptionId: z.string().min(1),
});

export async function adminDeleteSubscriptionAction(
  _s: AdminSubActionState,
  formData: FormData
): Promise<AdminSubActionState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Brak sesji admina (2FA)." };
  }
  const p = deleteSchema.safeParse({
    subscriptionId: formData.get("subscriptionId") ?? "",
  });
  if (!p.success) {
    return { error: "Błąd walidacji." };
  }
  const sub = await prisma.userSubscription.findUnique({
    where: { id: p.data.subscriptionId },
    include: { user: true },
  });
  if (!sub || sub.user.role !== UserRole.CLIENT) {
    return { error: "Nie znaleziono." };
  }
  await prisma.userSubscription.delete({ where: { id: sub.id } });
  await writeAuditLog(a.user.id, "subscription.delete", "UserSubscription", sub.id, {});
  revalidatePath(`/admin/uzytkownicy/${sub.userId}`);
  revalidatePath("/dashboard");
  return { ok: true };
}
