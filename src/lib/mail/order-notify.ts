import { getAppPublicUrl } from "@/lib/env/public";
import { sendMailIfConfigured, parseAdminRecipientList } from "@/lib/mail/send";
import {
  paragraphsFromPlainBody,
  renderWaTransactionalHtml,
  renderWaTransactionalText,
  type WaTransactionalMailPayload,
} from "@/lib/mail/templates/wa-transactional";
import { MAIL_TEMPLATE_KEY } from "@/lib/mail/template-keys";
import { prisma } from "@/lib/db";

const fromLabel = (u: { email: string; name: string | null }): string =>
  u.name ? `${u.name} <${u.email}>` : u.email;

function defaultLegalLinks(): WaTransactionalMailPayload["legalLinks"] {
  const base = getAppPublicUrl();
  return [
    { label: "Regulamin", href: `${base}/prawo/regulamin` },
    { label: "Polityka prywatności", href: `${base}/prawo/polityka-prywatnosci` },
  ];
}

function titleFromSubject(subject: string): string {
  const sep = " — ";
  const idx = subject.indexOf(sep);
  return idx >= 0 ? subject.slice(0, idx).trim() : subject.trim();
}

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
  const payload: WaTransactionalMailPayload = {
    preheader: orderLabel,
    title: "Nowa wiadomość od pary",
    introParagraphs: [`Od: ${fromLabel(client)}`, preview.trim()],
    ctaUrl: link,
    ctaLabel: "Otwórz wątek zamówienia",
    nextSteps: [
      "Przeczytaj wiadomość w panelu administratora.",
      "Odpowiedz z poziomu zamówienia — klient dostanie powiadomienie e‑mailem.",
    ],
    legalLinks: defaultLegalLinks(),
  };
  const html = renderWaTransactionalHtml(payload);
  const text = renderWaTransactionalText(payload);
  await Promise.all(
    to.map((e) =>
      sendMailIfConfigured({
        to: e,
        subject: sub,
        text,
        html,
        replyTo: client.email,
        templateKey: MAIL_TEMPLATE_KEY.ORDER_MESSAGE_ADMIN,
      })
    )
  );
}

/**
 * Nowe zamówienie klienta — powiadomienie do adminów.
 */
export async function notifyAdminsOnNewOrder(
  orderId: string,
  orderLabel: string,
  client: { email: string; name: string | null },
  statusLabel: string
): Promise<void> {
  const to = parseAdminRecipientList();
  if (to.length === 0) {
    return;
  }
  const link = `${getAppPublicUrl()}/admin/zamowienia/${orderId}`;
  const sub = `Nowe zamówienie — ${orderLabel}`;
  const payload: WaTransactionalMailPayload = {
    preheader: orderLabel,
    title: "Nowe zamówienie do obsłużenia",
    introParagraphs: [
      `Klient: ${fromLabel(client)}.`,
      "Para złożyła zamówienie w panelu — wymaga Twojej decyzji lub pierwszej wiadomości zwrotnej.",
    ],
    statusBadge: { label: "Status", value: statusLabel },
    ctaUrl: link,
    ctaLabel: "Otwórz zamówienie w panelu",
    nextSteps: [
      "Zweryfikuj wybrany pakiet i dane kontaktowe.",
      "Wyślij pierwszą wiadomość lub zmień status zamówienia.",
      "Po akceptacji klient otrzyma automatyczne powiadomienie.",
    ],
    legalLinks: defaultLegalLinks(),
  };
  const html = renderWaTransactionalHtml(payload);
  const text = renderWaTransactionalText(payload);
  await Promise.all(
    to.map((e) =>
      sendMailIfConfigured({
        to: e,
        subject: sub,
        text,
        html,
        replyTo: client.email,
        templateKey: MAIL_TEMPLATE_KEY.ORDER_CREATED_ADMIN,
      })
    )
  );
}

/**
 * Potwierdzenie złożenia zamówienia — mail do klienta.
 */
export async function notifyClientOnOrderCreated(
  userId: string,
  orderId: string,
  orderLabel: string,
  statusLabel: string
): Promise<void> {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) {
    return;
  }
  const link = `${getAppPublicUrl()}/dashboard/zamowienia/${orderId}`;
  const payload: WaTransactionalMailPayload = {
    preheader: orderLabel,
    title: "Dziękujemy za złożenie zamówienia",
    introParagraphs: [
      "Twoje zamówienie zostało przyjęte. Administrator zweryfikuje szczegóły i wróci z kolejnymi krokami.",
      `Wybrany pakiet: ${orderLabel}.`,
    ],
    statusBadge: { label: "Status", value: statusLabel },
    ctaUrl: link,
    ctaLabel: "Przejdź do zamówienia",
    nextSteps: [
      "Sprawdzaj wiadomości na stronie zamówienia.",
      "Upewnij się, że dane kontaktowe w koncie są aktualne.",
      "Po akceptacji administratora dostaniesz kolejne informacje mailem.",
    ],
    legalLinks: defaultLegalLinks(),
  };
  const html = renderWaTransactionalHtml(payload);
  const text = renderWaTransactionalText(payload);
  await sendMailIfConfigured({
    to: u.email,
    subject: `Potwierdzenie zamówienia — ${orderLabel}`,
    text,
    html,
    templateKey: MAIL_TEMPLATE_KEY.ORDER_CREATED_CLIENT,
  });
}

/**
 * Odpowiedź admina / zmiana statusu / inne aktualizacje — e-mail do klienta.
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
  const paras = paragraphsFromPlainBody(textBody);
  const payload: WaTransactionalMailPayload = {
    preheader: orderLabel,
    title: titleFromSubject(sub),
    introParagraphs: paras.length > 0 ? paras : ["W Twoim zamówieniu pojawiły się nowe informacje."],
    ctaUrl: link,
    ctaLabel: "Otwórz zamówienie",
    nextSteps: [
      "Przeczytaj szczegóły na stronie zamówienia.",
      "Możesz odpowiedzieć w wątku wiadomości — administrator dostanie powiadomienie.",
    ],
    legalLinks: defaultLegalLinks(),
  };
  const html = renderWaTransactionalHtml(payload);
  const text = renderWaTransactionalText(payload);
  await sendMailIfConfigured({
    to: u.email,
    subject: sub,
    text,
    html,
    templateKey: MAIL_TEMPLATE_KEY.ORDER_UPDATE_CLIENT,
  });
}
