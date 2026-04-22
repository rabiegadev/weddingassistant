"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { UserRole, SessionScope } from "@prisma/client";
import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db";
import { hashSessionTokenToHex, createOpaqueSessionToken } from "@/lib/crypto/session-token";
import { getAppPublicUrl } from "@/lib/env/public";
import { getAdmin2faEntryPath } from "@/lib/auth/mfa-routing";
import { rateLimitOrThrow } from "@/lib/rate-limit";
import { sendMailIfConfigured, parseAdminRecipientList } from "@/lib/mail/send";
import { strongPasswordSchema, emailSchema, nameOptionalSchema } from "@/lib/validation/user";
import { verifyTurnstileIfConfigured } from "@/lib/turnstile";
import { verifyUserTotpCode } from "@/lib/auth/totp-app";
import {
  createClientSessionForUserId,
  createAdminSessionForUserId,
  setClientSessionCookie,
  setAdminSessionCookie,
  logoutByScopeAndSessionId,
  setSessionMfaCompleteById,
} from "@/lib/auth/session";
import {
  getAnyAdminSession,
  getClientSession,
  clearClientSessionCookie,
  clearAdminSessionCookie,
} from "@/lib/auth/session";
import { headers } from "next/headers";

const VERIFY_TOKEN_H = 1000 * 60 * 60 * 24 * 2;

async function clientKey(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "0";
}

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Hasło wymagane").max(500, "Dane odrzucone"),
});

const registerSchema = z.object({
  name: nameOptionalSchema,
  email: emailSchema,
  password: strongPasswordSchema,
});

function firstZodMessage(err: z.ZodError): string {
  return err.issues[0]?.message ?? "Błąd walidacji";
}

export type AuthFormState = { error?: string; success?: string; warning?: string };

/**
 * Rejestracja tylko konta pary młodej; admin tworzony w seed/CLI.
 */
export async function registerClientAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const cfr = (formData.get("cf-turnstile-response") ?? formData.get("turnstile")) as
    | string
    | null;
  const t = await verifyTurnstileIfConfigured(cfr ?? undefined);
  if (t.ok === false) {
    return { error: t.error };
  }
  const parsed = registerSchema.safeParse({
    name: formData.get("name") ?? undefined,
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }
  try {
    await rateLimitOrThrow(`reg:${await clientKey()}:${parsed.data.email}`, "register");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Błąd" };
  }
  const ex = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (ex) {
    return { error: "Konto o tym adresie e-mail już istnieje." };
  }
  const passwordHash = await hashPassword(parsed.data.password);
  const u = await prisma.user.create({
    data: {
      email: parsed.data.email,
      name: parsed.data.name,
      passwordHash,
      role: UserRole.CLIENT,
    },
  });
  const raw = createOpaqueSessionToken();
  const th = hashSessionTokenToHex(raw);
  const expires = new Date(Date.now() + VERIFY_TOKEN_H);
  await prisma.emailVerificationToken.create({
    data: { userId: u.id, tokenHash: th, expiresAt: expires },
  });
  const link = `${getAppPublicUrl()}/api/auth/verify-email?token=${encodeURIComponent(raw)}`;
  const mail = await sendMailIfConfigured({
    to: u.email,
    subject: "Potwierdź rejestrację — Weddingassistant",
    text: `Otwórz w przeglądarce (2 dni):\n${link}\n\nPozdrowienia, Weddingassistant`,
  });
  if (mail.sent) {
    return {
      success: "Konto utworzone. Otwórz e-mail, aby potwierdzić adres (sprawdź też folder spam).",
    };
  }
  if (mail.reason === "no_smtp") {
    return {
      warning:
        "Konto zapisane w bazie, ale e-mail weryfikacyjny nie wysłany: brak SMTP w środowisku (Vercel → Environment Variables: SMTP_URL lub SMTP_HOST itd. dla odpowiedniego typu deployu).",
    };
  }
  return {
    warning:
      "Konto zapisane w bazie, ale wysyłka e-maila nie powiodła się (odrzucenie przez serwer SMTP). W Vercel → Logs szukaj „[mail]”. Często: zły MAIL_FROM, hasło, port lub limit hosta; sprawdź też spam odbiorcy.",
  };
}

export type LoginState = { error?: string; ok?: boolean } | void;

/**
 * Logowanie pary (cookie `wa_s_client`).
 */
export async function loginClientAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const cfr = (formData.get("cf-turnstile-response") ?? formData.get("turnstile")) as
    | string
    | null;
  const tv = await verifyTurnstileIfConfigured(cfr ?? undefined);
  if (tv.ok === false) {
    return { error: tv.error };
  }
  const parsed = loginSchema.safeParse({
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }
  try {
    await rateLimitOrThrow(`li:${await clientKey()}:${parsed.data.email}`, "login");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Błąd" };
  }
  const u = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!u || u.role !== UserRole.CLIENT) {
    return { error: "Nieprawidłowe dane logowania." };
  }
  if (!(await verifyPassword(parsed.data.password, u.passwordHash))) {
    return { error: "Nieprawidłowe dane logowania." };
  }
  if (!u.emailVerifiedAt) {
    return { error: "Potwierdź e-mail, zanim zalogujesz się z tego formularza." };
  }
  const { token } = await createClientSessionForUserId(u.id);
  await setClientSessionCookie(token);
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Logowanie hasłem w obsłudze (2FA w kolejnych krokach — cookie `wa_s_admin`, mfa niedomknięte).
 */
export async function loginAdminAction(_: LoginState, formData: FormData): Promise<LoginState> {
  const cfr = (formData.get("cf-turnstile-response") ?? formData.get("turnstile")) as
    | string
    | null;
  const tv = await verifyTurnstileIfConfigured(cfr ?? undefined);
  if (tv.ok === false) {
    return { error: tv.error };
  }
  const parsed = loginSchema.safeParse({
    email: formData.get("email") ?? "",
    password: formData.get("password") ?? "",
  });
  if (!parsed.success) {
    return { error: firstZodMessage(parsed.error) };
  }
  try {
    await rateLimitOrThrow(`lia:${await clientKey()}:${parsed.data.email}`, "loginAdmin");
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Błąd" };
  }
  const u = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (!u || u.role !== UserRole.ADMIN) {
    return { error: "Nieprawidłowe dane logowania (obsługa)." };
  }
  if (!(await verifyPassword(parsed.data.password, u.passwordHash))) {
    return { error: "Nieprawidłowe dane logowania (obsługa)." };
  }
  if (!u.emailVerifiedAt) {
    return { error: "Potwierdź e-mail przypisany do tego konta (admina)." };
  }
  const { token } = await createAdminSessionForUserId(u.id, false);
  await setAdminSessionCookie(token);
  revalidatePath("/", "layout");
  const path2fa = await getAdmin2faEntryPath(u.id);
  redirect(path2fa);
}

export async function completeTotpSetupAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const code = (formData.get("code") as string)?.trim() ?? "";
  if (!/^\d{4,8}$/.test(code)) {
    return { error: "Wpisz 6-cyfrowy kod z aplikacji (Authenticator)." };
  }
  const s = await getAnyAdminSession();
  if (!s) {
    return { error: "Sesja wygasła. Zaloguj się ponownie (obsługa)." };
  }
  const u = await prisma.user.findUnique({ where: { id: s.user.id } });
  if (!u?.totpSecret) {
    return { error: "Zainicjuj jeszcze skan QR w tym ekranie." };
  }
  if (!verifyUserTotpCode(u.totpSecret, code)) {
    return { error: "Niepoprawny kod. Spróbuj ponownie (czas w telefonie musi być w miarę dokładny)." };
  }
  await prisma.user.update({
    where: { id: u.id },
    data: { totpEnabledAt: new Date() },
  });
  await setSessionMfaCompleteById(s.id, true);
  revalidatePath("/admin", "layout");
  redirect("/admin");
}

/**
 * TOTP użytkownika po logowaniu, gdy 2FA włączane — drugi krok.
 */
export async function verifyAdminTotpAfterPasswordAction(
  _: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const code = (formData.get("code") as string)?.trim() ?? "";
  if (!/^\d{4,8}$/.test(code)) {
    return { error: "Wpisz 6-cyfrowy kod." };
  }
  const s = await getAnyAdminSession();
  if (!s || s.mfaComplete) {
    redirect(s?.mfaComplete ? "/admin" : "/logowanie?k=admin");
  }
  const u = await prisma.user.findUnique({ where: { id: s.user.id } });
  if (!u?.totpSecret) {
    redirect("/admin/2fa/setup");
  }
  if (!u.totpEnabledAt) {
    return { error: "Najpierw włącz 2FA (setup)." };
  }
  if (!verifyUserTotpCode(u.totpSecret, code)) {
    return { error: "Kod błędny." };
  }
  await setSessionMfaCompleteById(s.id, true);
  revalidatePath("/admin", "layout");
  redirect("/admin");
}

export async function logoutClientAction(): Promise<void> {
  const s = await getClientSession();
  if (s) {
    await logoutByScopeAndSessionId(s.id, SessionScope.CLIENT);
  } else {
    await clearClientSessionCookie();
  }
  redirect("/");
}

export async function logoutAdminAction(): Promise<void> {
  const s = await getAnyAdminSession();
  if (s) {
    await logoutByScopeAndSessionId(s.id, SessionScope.ADMIN);
  } else {
    await clearAdminSessionCookie();
  }
  redirect("/");
}

/**
 * (Opcjonalnie) mail do Ciebie po weryfikacji: hook może wywołać w route verify-email.
 */
export async function sendAdminInfoNotification(subject: string, text: string): Promise<void> {
  const to = parseAdminRecipientList();
  await Promise.all(to.map((email) => sendMailIfConfigured({ to: email, subject, text })));
}
