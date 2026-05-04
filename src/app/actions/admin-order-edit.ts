"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { writeAuditLog } from "@/app/actions/audit";

export type AdminOrderEditState = { error?: string; ok?: boolean } | void;

const schema = z.object({
  orderId: z.string().min(1),
  totalPln: z.coerce.number().min(0).max(999_999.99),
  packageId: z.string().min(1),
  note: z.string().max(2000).optional(),
});

/**
 * Korekta kwoty / pakietu zamówienia (operacje ręczne). Nie zmienia statusu płatności u operatora.
 */
export async function adminUpdateOrderDetailsAction(
  _s: AdminOrderEditState,
  formData: FormData
): Promise<AdminOrderEditState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Brak sesji admina (2FA)." };
  }
  const p = schema.safeParse({
    orderId: formData.get("orderId") ?? "",
    totalPln: formData.get("totalPln") ?? "",
    packageId: formData.get("packageId") ?? "",
    note: (formData.get("note") as string) || "",
  });
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Błąd walidacji." };
  }
  const totalCents = Math.round(p.data.totalPln * 100);
  const order = await prisma.order.findUnique({
    where: { id: p.data.orderId },
    include: { package: true },
  });
  if (!order) {
    return { error: "Brak zamówienia." };
  }
  const pkg = await prisma.package.findUnique({ where: { id: p.data.packageId } });
  if (!pkg) {
    return { error: "Wybrany pakiet nie istnieje." };
  }
  const prev = { totalCents: order.totalCents, packageId: order.packageId };
  await prisma.order.update({
    where: { id: order.id },
    data: {
      totalCents,
      packageId: pkg.id,
    },
  });
  await prisma.orderEvent.create({
    data: {
      orderId: order.id,
      fromStatus: order.status,
      toStatus: order.status,
      message:
        `Korekta operacyjna (kwota/pakiet). Było: ${prev.totalCents} gr, pakiet ${prev.packageId}. ` +
        (p.data.note?.trim() ? `Notatka: ${p.data.note.trim()}` : ""),
      createdById: a.user.id,
    },
  });
  await writeAuditLog(a.user.id, "order.edit", "Order", order.id, {
    totalCents,
    packageId: pkg.id,
    prev,
  });
  revalidatePath("/admin/zamowienia");
  revalidatePath(`/admin/zamowienia/${order.id}`);
  revalidatePath("/dashboard/zamowienia");
  return { ok: true };
}
