import Link from "next/link";
import { getAppPublicUrl } from "@/lib/env/public";
import { MAIL_TEMPLATE_KEY } from "@/lib/mail/template-keys";
import { renderWaTransactionalHtml } from "@/lib/mail/templates/wa-transactional";
import {
  buildContactAdminMail,
  buildEmailVerificationMail,
  buildPasswordResetMail,
  buildWelcomeGoogleMail,
} from "@/lib/mail/templates/presets";
import type { WaTransactionalMailPayload } from "@/lib/mail/templates/wa-transactional";

function MailIframe({ title, html }: { title: string; html: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#e8ddce] bg-white shadow-inner">
      <iframe
        title={title}
        srcDoc={html}
        className="h-[min(720px,85vh)] w-full border-0 bg-[#f3e9db]"
        sandbox="allow-popups allow-top-navigation-by-user-activation"
      />
    </div>
  );
}

export default function PodgladMailiPage() {
  const base = getAppPublicUrl();
  const demoOrderId = "podglad-przyklad";

  const orderCreatedClientPayload: WaTransactionalMailPayload = {
    preheader: "Pakiet: przykładowy",
    title: "Dziękujemy za złożenie zamówienia",
    introParagraphs: [
      "Twoje zamówienie zostało przyjęte. Administrator zweryfikuje szczegóły i wróci z kolejnymi krokami.",
      "Wybrany pakiet: Pakiet przykładowy.",
    ],
    statusBadge: { label: "Status", value: "Oczekuje na decyzję administratora" },
    ctaUrl: `${base}/dashboard/zamowienia/${demoOrderId}`,
    ctaLabel: "Przejdź do zamówienia",
    nextSteps: [
      "Sprawdzaj wiadomości na stronie zamówienia.",
      "Upewnij się, że dane kontaktowe w koncie są aktualne.",
      "Po akceptacji administratora dostaniesz kolejne informacje mailem.",
    ],
    legalLinks: [
      { label: "Regulamin", href: `${base}/prawo/regulamin` },
      { label: "Polityka prywatności", href: `${base}/prawo/polityka-prywatnosci` },
    ],
  };

  const orderCreatedAdminPayload: WaTransactionalMailPayload = {
    preheader: "Pakiet: przykładowy",
    title: "Nowe zamówienie do obsłużenia",
    introParagraphs: [
      "Klient: Anna Przykładowa <para@example.com>.",
      "Para złożyła zamówienie w panelu — wymaga Twojej decyzji lub pierwszej wiadomości zwrotnej.",
    ],
    statusBadge: { label: "Status", value: "Oczekuje na decyzję administratora" },
    ctaUrl: `${base}/admin/zamowienia/${demoOrderId}`,
    ctaLabel: "Otwórz zamówienie w panelu",
    nextSteps: [
      "Zweryfikuj wybrany pakiet i dane kontaktowe.",
      "Wyślij pierwszą wiadomość lub zmień status zamówienia.",
      "Po akceptacji klient otrzyma automatyczne powiadomienie.",
    ],
    legalLinks: orderCreatedClientPayload.legalLinks,
  };

  const welcome = buildWelcomeGoogleMail(base);

  const verify = buildEmailVerificationMail(`${base}/api/auth/verify-email?token=demo`);
  const reset = buildPasswordResetMail(`${base}/nowe-haslo?token=demo`);
  const contact = buildContactAdminMail({
    name: "Jan Kowalski",
    email: "jan@example.com",
    phone: "+48 600 000 000",
    message: "Dzień dobry, chciałbym zapytać o dostępność pakietu…",
    sourcePage: "/#kontakt",
  });

  const sections: { key: string; label: string; html: string }[] = [
    {
      key: MAIL_TEMPLATE_KEY.ORDER_CREATED_CLIENT,
      label: "Klient — nowe zamówienie",
      html: renderWaTransactionalHtml(orderCreatedClientPayload),
    },
    {
      key: MAIL_TEMPLATE_KEY.ORDER_CREATED_ADMIN,
      label: "Administrator — nowe zamówienie",
      html: renderWaTransactionalHtml(orderCreatedAdminPayload),
    },
    { key: welcome.templateKey, label: "Powitanie — Google", html: welcome.html },
    { key: verify.templateKey, label: "Potwierdzenie e-mail (rejestracja)", html: verify.html },
    { key: reset.templateKey, label: "Reset hasła", html: reset.html },
    { key: contact.templateKey, label: "Formularz www → administrator", html: contact.html },
  ];

  return (
    <main className="border-b border-[#dcc9ab]/70 bg-[#f3e9db]">
      <section className="mx-auto w-full max-w-6xl px-4 py-10 pb-20 sm:px-6 sm:py-14 sm:pb-24" aria-labelledby="sekcja-podglad-maili">
        <h1 className="font-wa-display text-2xl font-semibold tracking-[0.02em] text-[#2E2A26] sm:text-3xl" id="sekcja-podglad-maili">
          Podgląd szablonów maili
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-[#5a4d40] sm:text-base">
          Ten sam układ HTML jest wysyłany z serwera co widać poniżej — białe tło karty, ciemnobrązowy nagłówek, złoty przycisk CTA i sekcja „Co dalej”.
          Podgląd używa adresu <span className="font-medium">{base}</span> w linkach demonstracyjnych.
        </p>
        <div className="mt-8 space-y-10">
          {sections.map((item) => (
            <article key={item.key} className="rounded-2xl border border-[#dccab1] bg-[#fffdf9] p-4 shadow-[0_16px_34px_-24px_rgba(43,31,20,0.55)] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8d7453]">{item.label}</p>
              <p className="mt-1 text-xs text-[#7c6d5a]">Szablon / klucz logów: <code className="rounded bg-[#f3ebe0] px-1">{item.key}</code></p>
              <div className="mt-4">
                <MailIframe title={item.label} html={item.html} />
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <Link
            href="/#kontakt"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[#B8955C] bg-white px-7 py-2.5 text-sm font-semibold text-[#4a3820] shadow-sm transition hover:bg-[#faf6ef]"
          >
            Przejdź do kontaktu
          </Link>
        </div>
      </section>
    </main>
  );
}
