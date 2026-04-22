"use server";

import { z } from "zod";
import { prisma } from "@/lib/db";
import { hashSessionTokenToHex, createOpaqueSessionToken } from "@/lib/crypto/session-token";
import { getAppPublicUrl } from "@/lib/env/public";
import { sendMailIfConfigured } from "@/lib/mail/send";
import { strongPasswordSchema, emailSchema } from "@/lib/validation/user";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { hashPassword } from "@/lib/auth/password";
import { headers } from "next/headers";
import { verifyMathCaptchaForm } from "@/lib/captcha/math-challenge";

const H = 1000 * 60 * 60; // 1h

export type PassState = { error?: string; success?: string };

async function key(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "0";
}

const emailOnly = z.object({ email: emailSchema });

/**
 * Wysyła e-mail z linkiem resetu (nie ujawnia, czy konto istnieje).
 */
export async function requestPasswordResetAction(
  _p: PassState,
  formData: FormData
): Promise<PassState> {
  const cap = verifyMathCaptchaForm(formData);
  if (cap.ok === false) {
    return { error: cap.error };
  }
  const parsed = emailOnly.safeParse({ email: formData.get("email") ?? "" });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Błąd" };
  }
  try {
    await rateLimitOrThrow(`pr:${await key()}:${parsed.data.email}`, "pwreset");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Błąd" };
  }
  const u = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (u) {
    const raw = createOpaqueSessionToken();
    const th = hashSessionTokenToHex(raw);
    await prisma.passwordResetToken.create({
      data: { userId: u.id, tokenHash: th, expiresAt: new Date(Date.now() + H) },
    });
    const link = `${getAppPublicUrl()}/nowe-haslo?token=${encodeURIComponent(raw)}`;
    await sendMailIfConfigured({
      to: u.email,
      subject: "Reset hasła — Weddingassistant",
      text: `Ustaw nowe hasło (1 h):\n${link}\n\nJeśli to nie Ty, zignoruj tę wiadomość.`,
    });
  }
  return {
    success: "Jeśli konto istnieje, wysłaliśmy e-mail z linkiem. Sprawdź skrzynkę (i spam).",
  };
}

const resetSchema = z.object({
  token: z.string().min(20).max(500),
  password: strongPasswordSchema,
});

export async function resetPasswordWithTokenAction(
  _p: PassState,
  formData: FormData
): Promise<PassState> {
  const cap = verifyMathCaptchaForm(formData);
  if (cap.ok === false) {
    return { error: cap.error };
  }
  const parsed = resetSchema.safeParse({
    token: formData.get("token") ?? "",
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Błąd" };
  }
  const th = hashSessionTokenToHex(parsed.data.token);
  const row = await prisma.passwordResetToken.findFirst({
    where: { tokenHash: th, expiresAt: { gt: new Date() } },
  });
  if (!row) {
    return { error: "Link wygasł lub jest niepoprawny. Poproś o nowy." };
  }
  const h = await hashPassword(parsed.data.password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: row.userId }, data: { passwordHash: h } }),
    prisma.passwordResetToken.delete({ where: { id: row.id } }),
    prisma.session.deleteMany({ where: { userId: row.userId } }),
  ]);
  return { success: "Hasło zmienione. Możesz się zalogować." };
}
