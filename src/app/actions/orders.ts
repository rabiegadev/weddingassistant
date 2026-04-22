"use server";

import { revalidatePath } from "next/cache";
import { OrderStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { getClientSession, getFullAdminSession } from "@/lib/auth/session";
import { writeAuditLog } from "./audit";
import {
  notifyAdminsOnClientMessage,
  notifyClientOnOrderUpdate,
  orderStatusPl,
} from "@/lib/mail/order-notify";

const msg = z.string().min(1, "Wpisz treść").max(8000, "Zbyt długa wiadomość");

export type OrderActionState = { error?: string; ok?: boolean } | void;

/**
 * Nowe zamówienie z panelu pary: wybór pakietu (szkielet, bez płatności).
 */
export async function createOrderForClientAction(
  _s: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  const c = await getClientSession();
  if (!c) {
    return { error: "Zaloguj się." };
  }
  const packageId = (formData.get("packageId") as string) || "";
  if (!packageId) {
    return { error: "Wybierz pakiet." };
  }
  const p = await prisma.package.findFirst({
    where: { id: packageId, isPublished: true },
  });
  if (!p) {
    return { error: "Pakiet niedostępny." };
  }
  const extra = (formData.get("selection") as string) || "{}";
  let sel = "{}";
  try {
    sel = JSON.stringify(JSON.parse(extra) as object);
  } catch {
    return { error: "Nieprawidłowe dane formularza (JSON)." };
  }
  const o = await prisma.order.create({
    data: {
      userId: c.user.id,
      packageId: p.id,
      status: OrderStatus.SUBMITTED,
      totalCents: p.priceCents,
      selectionJson: sel,
    },
  });
  await prisma.orderEvent.create({
    data: {
      orderId: o.id,
      fromStatus: null,
      toStatus: OrderStatus.SUBMITTED,
      message: "Zamówienie złożone z panelu klienta (wstęp, bez płatności).",
    },
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/zamowienia", "page");
  revalidatePath("/admin/zamowienia", "page");
  return { ok: true };
}

/**
 * Wiadomość w wątku zamówienia.
 */
export async function postOrderMessageAction(
  _s: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  const orderId = (formData.get("orderId") as string) || "";
  const body = (formData.get("body") as string) || "";
  const p = msg.safeParse(body);
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Błąd" };
  }
  if (!orderId) {
    return { error: "Brak identyfikatora." };
  }
  const o = await prisma.order.findUnique({
    where: { id: orderId },
    include: { user: true, package: true },
  });
  if (!o) {
    return { error: "Zamówienie nie istnieje." };
  }
  const admin = await getFullAdminSession();
  const client = await getClientSession();
  if (admin) {
    const m = await prisma.orderMessage.create({
      data: { orderId, authorId: admin.user.id, isFromAdmin: true, body: p.data },
    });
    await prisma.order.update({ where: { id: o.id }, data: { lastMessageAt: m.createdAt } });
    await notifyClientOnOrderUpdate(
      o.userId,
      o.id,
      o.package.name,
      `Nowa wiadomość (obsługa) — ${o.package.name}`,
      `Obsługa napisała: ${p.data.slice(0, 500)}${p.data.length > 500 ? "…" : ""}`
    );
    revalidatePath(`/admin/zamowienia/${o.id}`);
    revalidatePath(`/dashboard/zamowienia/${o.id}`);
    return { ok: true };
  }
  if (client && o.userId === client.user.id) {
    const m = await prisma.orderMessage.create({
      data: { orderId, authorId: client.user.id, isFromAdmin: false, body: p.data },
    });
    await prisma.order.update({ where: { id: o.id }, data: { lastMessageAt: m.createdAt } });
    await notifyAdminsOnClientMessage(
      o.id,
      o.package.name,
      o.user,
      p.data.slice(0, 2000)
    );
    revalidatePath(`/admin/zamowienia/${o.id}`);
    revalidatePath(`/dashboard/zamowienia/${o.id}`);
    return { ok: true };
  }
  return { error: "Brak uprawnień do tej konwersacji." };
}

const orderStatuses = Object.values(OrderStatus) as string[];

const statusUpdate = z.object({
  orderId: z.string().min(1),
  status: z
    .string()
    .refine((s): s is string => orderStatuses.includes(s), "Nieprawidłowy status")
    .transform((s) => s as OrderStatus),
  note: z.string().max(2000).optional().default(""),
});

/**
 * Tylko admin: zmiana statusu + e-mail do klienta.
 */
export async function updateOrderStatusAction(
  _s: OrderActionState,
  formData: FormData
): Promise<OrderActionState> {
  const a = await getFullAdminSession();
  if (!a) {
    return { error: "Wymagane konto obsługi (2FA ukończone)." };
  }
  const p = statusUpdate.safeParse({
    orderId: formData.get("orderId") ?? "",
    status: formData.get("status") ?? "",
    note: (formData.get("note") as string) || "",
  });
  if (!p.success) {
    return { error: p.error.issues[0]?.message ?? "Błąd" };
  }
  const o = await prisma.order.findUnique({
    where: { id: p.data.orderId },
    include: { user: true, package: true },
  });
  if (!o) {
    return { error: "Nie ma takiego zamówienia." };
  }
  const from = o.status;
  if (from === p.data.status) {
    return { error: "Status już taki." };
  }
  await prisma.$transaction([
    prisma.order.update({ where: { id: o.id }, data: { status: p.data.status } }),
    prisma.orderEvent.create({
      data: {
        orderId: o.id,
        fromStatus: from,
        toStatus: p.data.status,
        message: p.data.note || null,
        createdById: a.user.id,
      },
    }),
  ]);
  await writeAuditLog(a.user.id, "order.status", "Order", o.id, { to: p.data.status });
  await notifyClientOnOrderUpdate(
    o.userId,
    o.id,
    o.package.name,
    `Aktualizacja zamówienia — ${o.package.name}`,
    `Status: ${orderStatusPl(from)} → ${orderStatusPl(p.data.status)}${
      p.data.note ? `\n\nNotatka: ${p.data.note}` : ""
    }`
  );
  revalidatePath("/admin/zamowienia");
  revalidatePath(`/admin/zamowienia/${o.id}`);
  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/zamowienia/${o.id}`);
  return { ok: true };
}
