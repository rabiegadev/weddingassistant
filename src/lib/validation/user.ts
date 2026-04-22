import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .min(1, "E-mail wymagany")
  .email("Niepoprawny adres e-mail")
  .max(254, "E-mail zbyt długi")
  .transform((s) => s.toLowerCase());

const hasChars = (s: string) =>
  /[a-z]/.test(s) && /[A-Z]/.test(s) && /[0-9]/.test(s) && /[^A-Za-z0-9]/.test(s);

/**
 * Wymagania zgodne z ustaleniami: silne hasło (NIE słownik, NIE tylko cyfry, NIE tylko litery).
 * Techniczne minimum 12 + znak specjalny itd. — możesz w przyszłości podnosić słabiej.
 */
export const strongPasswordSchema = z
  .string()
  .min(12, "Hasło: minimum 12 znaków")
  .max(200, "Hasło zbyt długie")
  .refine(
    (s) => hasChars(s),
    "Użyj co najmniej: małą i dużą literę, cyfrę i znak specjalny (np. !#%)."
  );

export const nameOptionalSchema = z
  .string()
  .trim()
  .max(120, "Zbyt długa nazwa")
  .optional()
  .transform((s) => (s?.length ? s : undefined));
