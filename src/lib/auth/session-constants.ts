/** Dwa oddzielne identyfikatory — ciasteczko strefy klienta nigdy nie otwiera /admin. */
export const COOKIE_NAME_CLIENT = "wa_s_client" as const;
export const COOKIE_NAME_ADMIN = "wa_s_admin" as const;

export const CLIENT_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 dni
export const ADMIN_SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 7; // 7 dni (węższe okno dla panelu)
