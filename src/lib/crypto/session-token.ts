import { createHash, randomBytes } from "node:crypto";

const TOKEN_BYTE_LENGTH = 32;

/**
 * Opaque token wysyłany tylko w `HttpOnly` cookie; w bazie trzymamy wyłącznie hash.
 */
export function createOpaqueSessionToken(): string {
  return randomBytes(TOKEN_BYTE_LENGTH).toString("base64url");
}

export function hashSessionTokenToHex(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}
