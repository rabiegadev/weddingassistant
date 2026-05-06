import nodemailer from "nodemailer";
import { logNotificationSent } from "@/lib/notifications/log";

type SendOpts = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  /** Klucz szablonu / scenariusza — trafia do NotificationLog (np. `mail.order-created.client`). */
  templateKey?: string;
};

/** Minimalny HTML z treści tekstowej (paragrafy po \n\n). */
function simpleHtmlFromText(text: string): string {
  const escaped = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const body = escaped.split(/\n\n+/).map((p) => `<p style="margin:0 0 12px;">${p.replace(/\n/g, "<br/>")}</p>`).join("");
  return `<!DOCTYPE html><html><body style="font-family:system-ui,sans-serif;font-size:15px;color:#1a1a1a;">${body}</body></html>`;
}

type Transport = ReturnType<typeof nodemailer.createTransport>;

let cached: Transport | null = null;

function smtpTimeoutMs(): number {
  const raw = process.env.SMTP_TIMEOUT_MS;
  const parsed = raw ? Number.parseInt(raw, 10) : NaN;
  if (Number.isFinite(parsed) && parsed >= 1000) {
    return parsed;
  }
  /** Domyślnie krótko — unikamy długiego „mielenia” przy nieosiągalnym SMTP (np. z Vercel). */
  return 4000;
}

function fromConnectionString(smtpUrl: string): Transport {
  const timeout = smtpTimeoutMs();
  return nodemailer.createTransport({
    url: smtpUrl,
    connectionTimeout: timeout,
    greetingTimeout: timeout,
    socketTimeout: timeout,
  });
}

function fromEnvParts(): Transport | null {
  const h = process.env.SMTP_HOST;
  if (!h) {
    return null;
  }
  return nodemailer.createTransport({
    host: h,
    port: Number.parseInt(process.env.SMTP_PORT ?? "587", 10) || 587,
    secure: process.env.SMTP_SECURE === "1" || process.env.SMTP_SECURE === "true",
    connectionTimeout: smtpTimeoutMs(),
    greetingTimeout: smtpTimeoutMs(),
    socketTimeout: smtpTimeoutMs(),
    auth:
      process.env.SMTP_USER && process.env.SMTP_PASS
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
        : undefined,
  });
}

/**
 * Pojedynczy współdzielony transport. Brak poprawnej konfiguracji — `transporter: null` (e-maily wyłączone).
 */
export function getTransporter(): Transport | null {
  if (cached) {
    return cached;
  }
  if (process.env.SMTP_URL) {
    cached = fromConnectionString(process.env.SMTP_URL);
    return cached;
  }
  const t = fromEnvParts();
  if (t) {
    cached = t;
  }
  return cached;
}

export function getFromAddress(): string {
  return process.env.MAIL_FROM?.trim() ? process.env.MAIL_FROM : "Weddingassistant <noreply@localhost>";
}

/**
 * Wysyłka z obsługą pustych środowisk: zwraca `false` gdy wysyłka nie wykonana, nie rzuca
 * w typowych brakach SMTP w dev. W produkcji: log błędu, ale nadrzędna akcja może kontynuować.
 */
export async function sendMailIfConfigured(
  o: SendOpts
): Promise<{ sent: true } | { sent: false; reason: "no_smtp" | "error" }> {
  const logKeyBase = o.templateKey ?? "sendMailIfConfigured";
  const t = getTransporter();
  if (!t) {
    console.warn(`[mail] (nie wysłano) do=${o.to} — brak SMTP: ustaw SMTP_URL lub SMTP_HOST w env (Vercel: Production/Preview).`);
    void logNotificationSent({
      channel: "email",
      templateKey: o.templateKey ? `${logKeyBase}.no_smtp` : "sendMailIfConfigured.no_smtp",
      toEmail: o.to,
      subject: o.subject,
      bodyPreview: o.text.slice(0, 400),
      meta: { reason: "no_smtp" },
    });
    return { sent: false, reason: "no_smtp" };
  }
  try {
    await t.sendMail({
      from: getFromAddress(),
      to: o.to,
      subject: o.subject,
      text: o.text,
      html: o.html ?? simpleHtmlFromText(o.text),
      replyTo: o.replyTo,
    });
    void logNotificationSent({
      channel: "email",
      templateKey: logKeyBase,
      toEmail: o.to,
      subject: o.subject,
      bodyPreview: o.text.slice(0, 400),
    });
    return { sent: true };
  } catch (e) {
    // Zawsze loguj — na Vercel widać w Runtime Logs (diagnoza SMTP/MAIL_FROM/tls).
    const msg = e instanceof Error ? e.message : String(e);
    console.error("[mail] sendMail failed:", msg);
    void logNotificationSent({
      channel: "email",
      templateKey: o.templateKey ? `${logKeyBase}.error` : "sendMailIfConfigured.error",
      toEmail: o.to,
      subject: o.subject,
      bodyPreview: o.text.slice(0, 400),
      meta: { reason: "error", message: msg },
    });
    return { sent: false, reason: "error" };
  }
}

/**
 * Wiele odbiorców (adresy z `ADMIN_NOTIFY_EMAILS` oddzielone przecinkiem/średnikiem).
 */
export function parseAdminRecipientList(): string[] {
  const raw = process.env.ADMIN_NOTIFY_EMAILS;
  if (!raw?.trim()) {
    return [];
  }
  return raw
    .split(/[;,]/)
    .map((e) => e.trim())
    .filter(Boolean);
}
