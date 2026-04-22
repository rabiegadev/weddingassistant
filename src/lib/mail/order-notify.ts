import { OrderStatus } from "@prisma/client";
import { getAppPublicUrl } from "@/lib/env/public";
import { sendMailIfConfigured, parseAdminRecipientList } from "@/lib/mail/send";
import { prisma } from "@/lib/db";

const fromLabel = (u: { email: string; name: string | null }): string =>
  u.name ? `${u.name} <${u.email}>` : u.email;

/**
 * Kliencka wiadomość: powiadomienie do zdefiniowanych adminów.
 */
export async function notifyAdminsOnClientMessage(
  orderId: string,
  orderLabel: string,
  client: { email: string; name: string | null },
  preview: string
): Promise<void> {
  const to = parseAdminRecipientList();
  if (to.length === 0) {
    return;
  }
  const link = `${getAppPublicUrl()}/admin/zamowienia/${orderId}`;
  const sub = `Nowa wiadomość — ${orderLabel}`;
  const text = `Od: ${fromLabel(client)}\n\n${preview}\n\nOtwórz: ${link}`;
  await Promise.all(
    to.map((e) => sendMailIfConfigured({ to: e, subject: sub, text, replyTo: client.email }))
  );
}

/**
 * Odpowiedź admina / zmiana statusu: e-mail do klienta.
 */
export async function notifyClientOnOrderUpdate(
  userId: string,
  orderId: string,
  orderLabel: string,
  sub: string,
  textBody: string
): Promise<void> {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) {
    return;
  }
  const link = `${getAppPublicUrl()}/dashboard/zamowienia/${orderId}`;
  await sendMailIfConfigured({
    to: u.email,
    subject: sub,
    text: `${textBody}\n\nPodgląd: ${link}`,
  });
}

export function orderStatusPl(s: OrderStatus): string {
  const m: Record<OrderStatus, string> = {
    DRAFT: "Szkic",
    SUBMITTED: "Złożone / czeka na weryfikację",
    PENDING_REVIEW: "Oczekuje na weryfikację",
    APPROVED: "Zatwierdzone / opłacone",
    IN_PROGRESS: "W trakcie realizacji",
    COMPLETED: "Zamknięte",
    CANCELLED: "Anulowane",
  };
  return m[s] ?? s;
}
