/**
 * Wspólny szablon maili transakcyjnych (biały / ciemnobrązowy nagłówek / złoty CTA).
 * Bazowy układ dla przyszłych reminderów i kolejnych typów wiadomości.
 */

export type WaTransactionalMailPayload = {
  /** Krótki tekst widoczny w podglądzie skrzynki (preheader). */
  preheader: string;
  /** Główny nagłówek (jak na podglądzie /podglad-maili). */
  title: string;
  /** Akapity treści głównej (każdy = osobny blok). */
  introParagraphs: readonly string[];
  /** Opcjonalny bloczek „Status: …”. */
  statusBadge?: { label: string; value: string };
  /** Jedno główne CTA. */
  ctaUrl: string;
  ctaLabel: string;
  /** Lista „Co dalej” — jeśli pusta, sekcja nie jest renderowana. */
  nextSteps?: readonly string[];
  /** Krótka stopka nad linkami prawnymi. */
  footerHint?: string;
  /** Opcjonalne linki w stopce (np. regulamin). Ścieżki absolutne HTTPS. */
  legalLinks?: ReadonlyArray<{ label: string; href: string }>;
};

export function escapeHtml(raw: string): string {
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Dzieli płaski tekst (np. z dotychczasowych wywołań) na akapity. */
export function paragraphsFromPlainBody(body: string): string[] {
  const chunks = body
    .split(/\n\n+/u)
    .map((s) => s.trim())
    .filter(Boolean);
  return chunks.length > 0 ? chunks : [body.trim()].filter(Boolean);
}

function renderNextStepsHtml(steps: readonly string[]): string {
  const items = steps
    .map((step) => `<li style="margin:0 0 8px;padding-left:4px;">${escapeHtml(step)}</li>`)
    .join("");
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:22px;border-top:1px solid #efe5d7;">
  <tr>
    <td style="padding-top:18px;">
      <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8d7453;">Co dalej</p>
      <ul style="margin:10px 0 0;padding-left:18px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.5;color:#4d4237;">
        ${items}
      </ul>
    </td>
  </tr>
</table>`;
}

function renderLegalLinksHtml(links: ReadonlyArray<{ label: string; href: string }>): string {
  if (links.length === 0) {
    return "";
  }
  const parts = links.map((l, i) => {
    const sep = i < links.length - 1 ? `<span style="color:#c9b59a;"> · </span>` : "";
    return `<a href="${escapeHtml(l.href)}" style="color:#8a6f48;text-decoration:underline;">${escapeHtml(l.label)}</a>${sep}`;
  });
  return `<p style="margin:12px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:11px;line-height:1.5;color:#8b7a68;">${parts.join("")}</p>`;
}

/**
 * Pełny dokument HTML (tabele + inline style — lepsza kompatybilność z klientami poczty).
 */
export function renderWaTransactionalHtml(payload: WaTransactionalMailPayload): string {
  const preEscaped = escapeHtml(payload.preheader);
  const titleEscaped = escapeHtml(payload.title);
  const introBlocks = payload.introParagraphs
    .map(
      (p) =>
        `<p style="margin:0 0 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:15px;line-height:1.55;color:#2f2923;">${escapeHtml(p)}</p>`
    )
    .join("");

  const statusHtml =
    payload.statusBadge != null
      ? `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:16px;">
  <tr>
    <td style="border-radius:8px;border:1px solid #e5d8c3;background:#fbf6ee;padding:12px 14px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.45;color:#5b4a36;">
      ${escapeHtml(payload.statusBadge.label)}: <strong style="color:#3d3228;">${escapeHtml(payload.statusBadge.value)}</strong>
    </td>
  </tr>
</table>`
      : "";

  const nextStepsHtml =
    payload.nextSteps != null && payload.nextSteps.length > 0 ? renderNextStepsHtml(payload.nextSteps) : "";

  const footerHint =
    payload.footerHint?.trim() ??
    "Masz pytania? Odpowiedz na tego maila albo skontaktuj się przez panel.";
  const legalHtml = renderLegalLinksHtml(payload.legalLinks ?? []);

  const ctaUrl = escapeHtml(payload.ctaUrl);
  const ctaLabel = escapeHtml(payload.ctaLabel);

  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="x-ua-compatible" content="ie=edge" />
  <title>${titleEscaped}</title>
</head>
<body style="margin:0;padding:0;background-color:#f3e9db;">
  <span style="display:none!important;visibility:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f3e9db;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preEscaped}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3e9db;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;border-collapse:separate;background:#ffffff;border:1px solid #e8ddce;border-radius:12px;overflow:hidden;">
          <tr>
            <td style="background-color:#1f1813;padding:22px 24px;">
              <p style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:11px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#d8bc8b;">Weddingassistant</p>
              <h1 style="margin:10px 0 0;font-family:Georgia,'Times New Roman',serif;font-size:22px;font-weight:600;color:#f4e7d2;line-height:1.25;">${titleEscaped}</h1>
              <p style="margin:8px 0 0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;line-height:1.45;color:#ecdbc1;">${preEscaped}</p>
            </td>
          </tr>
          <tr>
            <td style="padding:22px 24px 10px;">
              ${introBlocks}
              ${statusHtml}
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:22px 0 6px;">
                <tr>
                  <td align="left">
                    <a href="${ctaUrl}" style="display:inline-block;background-color:#b8955c;color:#231a12;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:14px;font-weight:700;text-decoration:none;padding:12px 22px;border-radius:6px;">${ctaLabel}</a>
                  </td>
                </tr>
              </table>
              ${nextStepsHtml}
            </td>
          </tr>
          <tr>
            <td style="border-top:1px solid #ece2d4;background-color:#f9f4ec;padding:14px 24px 18px;">
              <p style="margin:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;font-size:12px;line-height:1.55;color:#73614c;">${escapeHtml(footerHint)}</p>
              ${legalHtml}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderWaTransactionalText(payload: WaTransactionalMailPayload): string {
  const lines: string[] = [];
  lines.push(payload.title);
  lines.push("");
  lines.push(payload.preheader);
  lines.push("");
  for (const p of payload.introParagraphs) {
    lines.push(p);
    lines.push("");
  }
  if (payload.statusBadge) {
    lines.push(`${payload.statusBadge.label}: ${payload.statusBadge.value}`);
    lines.push("");
  }
  lines.push(`${payload.ctaLabel}: ${payload.ctaUrl}`);
  lines.push("");
  if (payload.nextSteps != null && payload.nextSteps.length > 0) {
    lines.push("Co dalej:");
    for (const s of payload.nextSteps) {
      lines.push(`- ${s}`);
    }
    lines.push("");
  }
  const footerHint =
    payload.footerHint?.trim() ??
    "Masz pytania? Odpowiedz na tego maila albo skontaktuj się przez panel.";
  lines.push(footerHint);
  if (payload.legalLinks != null && payload.legalLinks.length > 0) {
    lines.push("");
    lines.push(payload.legalLinks.map((l) => `${l.label}: ${l.href}`).join("\n"));
  }
  return lines.join("\n").trim();
}
