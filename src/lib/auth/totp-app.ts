import { authenticator } from "otplib";
import { prisma } from "@/lib/db";

const ISSUER = "Weddingassistant";

authenticator.options = { step: 30, digits: 6, window: 1 };

/**
 * Pobierz (lub utwórz tymczasowo) base32 do pierwszego skanu QR; zapis w `User.totpSecret` przed włączeniem.
 */
export async function getOrCreateTotpSetupSecretB32ForAdmin(userId: string): Promise<string> {
  const u = await prisma.user.findUnique({ where: { id: userId } });
  if (!u) {
    throw new Error("Nie znaleziono użytkownika.");
  }
  if (u.totpEnabledAt) {
    throw new Error("2FA jest już włączone.");
  }
  if (u.totpSecret) {
    return u.totpSecret;
  }
  const secret = authenticator.generateSecret();
  await prisma.user.update({ where: { id: userId }, data: { totpSecret: secret } });
  return secret;
}

export function buildOtpAuthUrl(email: string, secret: string): string {
  return authenticator.keyuri(email, ISSUER, secret);
}

export function verifyUserTotpCode(secret: string, code: string): boolean {
  return authenticator.verify({ token: code, secret });
}
