import nodemailer from "nodemailer";

type SendOpts = { to: string; subject: string; text: string; html?: string; replyTo?: string };

type Transport = ReturnType<typeof nodemailer.createTransport>;

let cached: Transport | null = null;

function fromConnectionString(smtpUrl: string): Transport {
  return nodemailer.createTransport(smtpUrl);
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
  const t = getTransporter();
  if (!t) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[mail] (nie wysłano) ${o.to} — brak SMTP_URL / SMTP_HOST`);
    }
    return { sent: false, reason: "no_smtp" };
  }
  try {
    await t.sendMail({
      from: getFromAddress(),
      to: o.to,
      subject: o.subject,
      text: o.text,
      html: o.html,
      replyTo: o.replyTo,
    });
    return { sent: true };
  } catch (e) {
    if (process.env.NODE_ENV === "development") {
      console.error("[mail]", e);
    }
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
