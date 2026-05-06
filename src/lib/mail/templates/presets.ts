import { getAppPublicUrl } from "@/lib/env/public";
import { MAIL_TEMPLATE_KEY } from "@/lib/mail/template-keys";
import {
  renderWaTransactionalHtml,
  renderWaTransactionalText,
  type WaTransactionalMailPayload,
} from "@/lib/mail/templates/wa-transactional";

function legalLinks(): WaTransactionalMailPayload["legalLinks"] {
  const base = getAppPublicUrl();
  return [
    { label: "Regulamin", href: `${base}/prawo/regulamin` },
    { label: "Polityka prywatności", href: `${base}/prawo/polityka-prywatnosci` },
  ];
}

export type BrandedOutgoingMail = {
  subject: string;
  html: string;
  text: string;
  templateKey: string;
};

/** Witamy po pierwszym logowaniu / rejestracji przez Google (`origin` = np. https://twoja-domena.pl). */
export function buildWelcomeGoogleMail(origin: string): BrandedOutgoingMail {
  const root = origin.replace(/\/$/, "");
  const payload: WaTransactionalMailPayload = {
    preheader: "Konto utworzone przez Google",
    title: "Witamy w Weddingassistant",
    introParagraphs: [
      "Dziękujemy za rejestrację przez Google.",
      "Twoje konto jest aktywne — możecie od razu korzystać z panelu planowania wesela.",
    ],
    ctaUrl: `${root}/dashboard`,
    ctaLabel: "Przejdź do panelu",
    nextSteps: [
      "Uzupełnij podstawowe informacje w Bazie informacji.",
      "Zajrzyj na Start — skrót zamówienia i odliczanie do ślubu.",
      "Gdy będziecie gotowi, wybierz wyższy pakiet w sekcji konta.",
    ],
    legalLinks: legalLinks(),
  };
  return {
    subject: "Witamy w Weddingassistant",
    html: renderWaTransactionalHtml(payload),
    text: renderWaTransactionalText(payload),
    templateKey: MAIL_TEMPLATE_KEY.WELCOME_GOOGLE,
  };
}

export function buildEmailVerificationMail(verifyLink: string): BrandedOutgoingMail {
  const payload: WaTransactionalMailPayload = {
    preheader: "Link ważny około 48 godzin",
    title: "Potwierdź adres e-mail",
    introParagraphs: [
      "Dokończ rejestrację, używając przycisku poniżej.",
      "Jeśli to nie Ty zakładałeś konto w Weddingassistant, zignoruj tę wiadomość.",
    ],
    ctaUrl: verifyLink,
    ctaLabel: "Potwierdź adres e-mail",
    nextSteps: [
      "Po potwierdzeniu możesz logować się adresem e-mail i hasłem.",
      "Sprawdź też folder spam, jeśli nie widzisz kolejnych wiadomości.",
    ],
    legalLinks: legalLinks(),
  };
  return {
    subject: "Potwierdź rejestrację — Weddingassistant",
    html: renderWaTransactionalHtml(payload),
    text: renderWaTransactionalText(payload),
    templateKey: MAIL_TEMPLATE_KEY.VERIFY_EMAIL_CLIENT,
  };
}

export function buildPasswordResetMail(resetLink: string): BrandedOutgoingMail {
  const payload: WaTransactionalMailPayload = {
    preheader: "Link ważny około 1 godziny",
    title: "Reset hasła",
    introParagraphs: [
      "Otrzymaliśmy prośbę o ustawienie nowego hasła do konta Weddingassistant.",
      "Jeśli to nie Ty — zignoruj wiadomość; hasło pozostanie bez zmian.",
    ],
    ctaUrl: resetLink,
    ctaLabel: "Ustaw nowe hasło",
    nextSteps: ["Link jest jednorazowy i ma ograniczoną ważność.", "Po zmianie zaloguj się ponownie w panelu."],
    legalLinks: legalLinks(),
  };
  return {
    subject: "Reset hasła — Weddingassistant",
    html: renderWaTransactionalHtml(payload),
    text: renderWaTransactionalText(payload),
    templateKey: MAIL_TEMPLATE_KEY.PASSWORD_RESET_CLIENT,
  };
}

export function buildContactAdminMail(args: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
  sourcePage?: string | null;
}): BrandedOutgoingMail {
  const lines: string[] = [`Od: ${args.name}`, `E-mail: ${args.email}`, `Telefon: ${args.phone?.trim() || "—"}`];
  if (args.sourcePage?.trim()) {
    lines.push(`Strona źródłowa: ${args.sourcePage.trim()}`);
  }
  lines.push("", "Treść:", args.message.trim());

  const payload: WaTransactionalMailPayload = {
    preheader: args.email,
    title: "Nowe zapytanie z formularza kontaktowego",
    introParagraphs: lines,
    ctaUrl: `${getAppPublicUrl()}/admin`,
    ctaLabel: "Otwórz panel administratora",
    nextSteps: ["Odpisz nadawcy z firmowej skrzynki lub z poziomu kontaktu w panelu."],
    footerHint: "Ta wiadomość została wygenerowana automatycznie po wysłaniu formularza na stronie.",
    legalLinks: legalLinks(),
  };

  return {
    subject: `Zapytanie z www — ${args.email}`,
    html: renderWaTransactionalHtml(payload),
    text: renderWaTransactionalText(payload),
    templateKey: MAIL_TEMPLATE_KEY.CONTACT_ADMIN,
  };
}
