import { hash, verify, type Options } from "@node-rs/argon2";

/* W `@node-rs/argon2` `Algorithm` / `Version` to const enum z — przy `isolatedModules`
   używamy literałów zgodnych z deklaracjami: Argon2id=2, V0x13=1. */
const argon2idOptions: Options = {
  algorithm: 2,
  version: 1,
  memoryCost: 19_456,
  timeCost: 2,
  outputLen: 32,
};

/**
 * Kryptograficzne hashowanie haseł (rejestracja) — weryfikacja tym samym algiorytmem.
 */
export async function hashPassword(plain: string): Promise<string> {
  return hash(plain, argon2idOptions);
}

export function verifyPassword(plain: string, encoded: string): Promise<boolean> {
  return verify(encoded, plain);
}
