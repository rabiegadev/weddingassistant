const CLIENT_GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  cfg: "Logowanie Google nie jest skonfigurowane na tym serwerze.",
  denied: "Anulowano logowanie w oknie Google.",
  state: "Sesja logowania wygasła lub jest nieprawidłowa — spróbuj ponownie.",
  token: "Nie udało się dokończyć logowania z Google. Spróbuj ponownie.",
  profile: "Nie udało się pobrać profilu z Google.",
  email: "Google nie potwierdził adresu e-mail. Wybierz inne konto lub zarejestruj się przez e-mail.",
  admin: "Ten adres jest przypisany do konta obsługi — użyj logowania dla obsługi.",
  link: "Ten adres jest już powiązany z innym kontem Google.",
  limit: "Zbyt wiele prób. Poczekaj chwilę i spróbuj ponownie.",
};

export function getClientGoogleErrorMessage(code: string | undefined): string | null {
  if (!code) {
    return null;
  }
  return CLIENT_GOOGLE_ERROR_MESSAGES[code] ?? "Logowanie Google nie powiodło się. Spróbuj ponownie.";
}
