/**
 * Logowanie / rejestracja konta pary przez Google OAuth (PKCE).
 * Wymaga zmiennych środowiskowych — bez nich przycisk Google jest ukryty.
 */
export type GoogleOAuthSecrets = {
  clientId: string;
  clientSecret: string;
  cookieSecret: string;
};

export function getGoogleOAuthSecrets(): GoogleOAuthSecrets | null {
  const clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  const cookieSecret = process.env.GOOGLE_OAUTH_COOKIE_SECRET?.trim();
  if (!clientId || !clientSecret || !cookieSecret || cookieSecret.length < 32) {
    return null;
  }
  return { clientId, clientSecret, cookieSecret };
}

export function isGoogleClientOAuthEnabled(): boolean {
  return getGoogleOAuthSecrets() !== null;
}
