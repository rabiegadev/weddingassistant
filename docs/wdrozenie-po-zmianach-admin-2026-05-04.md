# Wdrożenie po zmianach: panel admina, pary, plany, migracja bazy (2026-05-04)

Ten dokument jest **checklistą dla Ciebie na serwerze / Vercel / lokalnie**. Kod zakłada wykonanie migracji Prisma i ponowne wygenerowanie klienta.

---

## 0. Localhost — logowanie Google, rejestracja, przekierowania

W **`next dev`** aplikacja używa **`http://localhost:<port>`** jako bazy URL (nie zmiennej produkcyjnej `NEXT_PUBLIC_APP_URL` w `.env`). Linki z rejestracji / OAuth mają iść na ten sam host.

- **Google OAuth:** w Google Cloud Console dodaj redirect: `http://localhost:3000/api/auth/google/callback` (i ewentualny inny port).
- **Turnstile:** w development wyłączona ścieżka wymuszająca Cloudflare — bez blokady „fałszywych” kluczy produkcyjnych na localhost.
- **Brak pakietów na stronie głównej / cenniku:** uruchom **`npm run db:seed`** (lub równoważny seed na bazie podłączonej do `DATABASE_URL`).

---

## 1. Zatrzymaj procesy blokujące Prisma (Windows)

Jeśli `npx prisma generate` lub `npm run build` kończy się `EPERM` przy `query_engine-windows.dll.node`:

1. Zatrzymaj **`npm run dev`** / **Next dev**.
2. Zamknij inne instancje Node, które mogą trzymać plik (czasem pomaga restart IDE).
3. Powtórz: `npx prisma generate` → `npm run build`.

Na CI/Linux ten problem zwykle nie występuje.

---

## 2. Migracja bazy danych (obowiązkowe)

Na środowisku docelowym (SEOHost / staging / prod):

```bash
npx prisma migrate deploy
```

Migracja `20260504210000_admin_operational_layer` dodaje m.in.:

- status zamówienia **`AWAITING_PAYMENT`** (enum na `Order`, `OrderEvent`);
- kolumnę **`ClientProfile.infoJson`** (baza informacji — JSON);
- tabele **`WeddingPageRequest`**, **`NotificationLog`**.

**Backup bazy** przed migracją na produkcji (panel SEOHost / eksport SQL).

Istniejące zamówienia **nie są automatycznie** przepisywane na `AWAITING_PAYMENT`. Nowe zamówienia płatne z panelu pary dostają ten status przy utworzeniu. Opcjonalnie możesz ręcznie zaktualizować stare rekordy SQL-em (jeśli potrzebujesz spójnych raportów).

---

## 3. Zmienne środowiskowe (przypomnienie)

Bez zmian w stosunku do wcześniejszego MVP, ale funkcje **„na żywo”** wymagają:

| Obszar | Zmienne |
|--------|---------|
| Baza | `DATABASE_URL` |
| URL aplikacji | `NEXT_PUBLIC_APP_URL` |
| E-maile + log powiadomień | `SMTP_URL` lub `SMTP_HOST` / `SMTP_*`, `MAIL_FROM` |
| Powiadomienia adminów (formularz kontaktu) | `ADMIN_NOTIFY_EMAILS` |
| Płatności | `PRZELEWY24_*`, opcjonalnie `PAYU_*`, `PAYU_SANDBOX` |

Po zmianach w `send.ts` e-maile dostają **minimalny HTML**; nadal potrzebujesz działającego SMTP, żeby wpisy w **„Powiadomienia”** w adminie nie były puste z powodu `no_smtp`.

---

## 4. Panel admina — nowe adresy URL

| Ścieżka | Opis |
|---------|------|
| `/admin/uzytkownicy` | Lista par (CLIENT) |
| `/admin/uzytkownicy/[id]` | Edycja e-mail / imienia, profil (data ślubu, `infoJson`), **subskrypcje ręczne** (nowy wpis, zmiana `endsAt`, usunięcie) |
| `/admin/kontakt` | Zapytania z formularza kontaktowego — statusy NOWE / PRZECZYTANE / ARCHIWUM |
| `/admin/strony-weselne` | Zgłoszenia strony WWW — tworzenie po e-mailu użytkownika, status, notatka |
| `/admin/powiadomienia` | Rejestr wysłanych maili (po próbie wysyłki) |

Zamówienia: na `/admin/zamowienia/[id]` jest **korekta kwoty PLN i pakietu** (audyt w `AuditLog` + wpis w historii zdarzeń bez zmiany statusu).

---

## 5. Panel klienta — „Mój pakiet” / paywall

- **`/dashboard/moje-konto/moj-pakiet`** oraz **`/dashboard/moje-konto/wszystkie-pakiety`** — treść realna (pakiet, subskrypcje, linki).
- Moduły **`galeria`** i **`strona-weselna`** mogą pokazać **komunikat blokady**, jeśli pakiet nie ma `gallery` / `weddingPage` w `featuresJson` (seed pakietów już ustawia pola tam, gdzie dotyczy).

Upewnij się, że w **`Package.featuresJson`** dla pakietów z WWW jest `"weddingPage": true` tam, gdzie ma być dostępny konfigurator (seed w repozytorium jest wzorcowy).

---

## 6. Vercel / deploy

1. Wypchnij commit z migracją i kodem.
2. W Vercel: **Build** użyje `prisma generate` (z `postinstall` / `build`) — w logach musi się udać `Generated Prisma Client`.
3. Po pierwszym deployu z migracją: uruchom **`prisma migrate deploy`** (np. komenda startowa / jednorazowo z poziomu maszyny z dostępem do DB) — **zgodnie z Twoją dotychczasową praktyką** (wcześniej robiłeś to ręcznie na SEOHost).

---

## 7. Test ręczny (krótki)

1. **Admin:** logowanie → 2FA → `/admin/uzytkownicy` → otwórz parę → dodaj subskrypcję testową z przyszłą datą → zaloguj jako para → sprawdź `/dashboard/moje-konto/moj-pakiet`.
2. **Kontakt:** wyślij formularz z witryny → wpis w `/admin/kontakt` → zmiana statusu.
3. **Mail:** sprawdź `/admin/powiadomienia` po akcji wysyłającej e-mail (np. wiadomość w zamówieniu).

---

## 8. Co zostało planowo „szersze” niż ten commit

- Pełna **egzekucja limitów** gości/stołów przy CRUD (nie tylko banner tekstowy).
- Bogatsze **szablony HTML** maili (obecnie prosty wrapper).
- **E2E** pod pełne ścieżki zamówienie → płatność sandbox.

---

*Jeśli migracja lub generate nadal się wyłoży, prześlij log z terminala — wtedy diagnozujemy konkret (np. lock pliku, prawa do folderu `node_modules`).*
