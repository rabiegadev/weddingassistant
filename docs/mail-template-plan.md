# Plan szablonów maili (white / dark-brown / gold)

Data: 2026-05-05

## 1) Kierunek wizualny

- Motyw: elegancki, ciepły, ślubny.
- Kolory:
  - tło główne: `#ffffff`
  - tekst główny: `#2e2926`
  - tło sekcji premium: `#1f1813` (ciemny brąz)
  - akcent / CTA: `#b8955c` (złoty)
  - obramowania pomocnicze: `#e6dccf`
- Typografia:
  - nagłówki: styl display (zbliżony do strony)
  - treść: czytelny sans-serif

## 2) Spójny układ każdego maila

1. **Header**: logo + nazwa Weddingassistant.
2. **Hero strip**: krótki tytuł i 1 zdanie kontekstu.
3. **Body card**: główna informacja (status, podsumowanie, link).
4. **CTA button**: jeden główny przycisk.
5. **Sekcja pomocnicza**: 1-3 punkty „co dalej”.
6. **Footer**: dane kontaktowe, link do polityki/regulaminu.

## 3) Zestaw szablonów do wdrożenia

1. `welcome-google` – powitanie po pierwszej rejestracji Google.
2. `welcome-email` – potwierdzenie założenia konta klasycznego.
3. `order-created-client` – podsumowanie po złożeniu zamówienia.
4. `order-created-admin` – alert do obsługi o nowym zamówieniu.
5. `order-status-update` – zmiana statusu zamówienia.
6. `order-message` – nowa wiadomość w wątku zamówienia.
7. `password-reset` – reset hasła.
8. `email-verify` – weryfikacja adresu e-mail.

## 4) Przykładowy podgląd (układ)

- **Tytuł:** „Dziękujemy za złożenie zamówienia”
- **Treść:** nazwa pakietu, status, numer zamówienia.
- **Przycisk:** „Przejdź do zamówienia”.
- **Sekcja niżej:** „Co dalej?” (3 kroki).

## 5) Implementacja techniczna (proponowana)

- Wydzielić katalog `src/lib/mail/templates/`.
- Dla każdego szablonu:
  - `renderText(data)` – fallback tekstowy,
  - `renderHtml(data)` – pełny HTML.
- Dodać centralny renderer:
  - `renderMailTemplate(templateKey, data)`.
- W `sendMailIfConfigured` przekazywać gotowe `subject`, `text`, `html`.

## 6) Kolejność wdrożenia

1. Najpierw: `welcome-google`, `order-created-client`, `order-created-admin`.
2. Potem: `order-status-update`, `order-message`.
3. Na końcu: `password-reset`, `email-verify` (ujednolicenie stylu).

## 7) Kryteria gotowości

- Każdy mail ma spójny branding (kolory + układ).
- Działa poprawnie w desktop/mobile oraz popularnych klientach (Gmail, Outlook).
- Każdy mail ma tekstowy fallback.
- Logi wysyłki (`NotificationLog`) zawierają klucz szablonu.
