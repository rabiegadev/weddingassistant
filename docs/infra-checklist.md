# Checklista infrastruktury (Weddingassistant.pl)

Użyj listy, żeby nic nie pominąć przed **produkcją** / pierwszym deployem. Konkretne wartości (loginy, hasła) trzymaj poza gitem.

## 1. Repozytorium (GitHub)
- [ ] Repozytorium utworzone; branch `main` = produkcja, `dev` = integracja.
- [ ] Dostęp: co najmniej Ty + backup MFA na koncie.
- [ ] (Opcjonalnie) wymagane recenzje przed merge do `main`.
- [ ] W **Vercel** połączony projekt z repozytorium; w Settings → **Production branch** = `main`.

## 2. Baza danych (SEOHost, MySQL/MariaDB)
- [ ] Utworzona pusta baza, użytkownik z ograniczonymi uprawnieniami tylko do tej bazy.
- [ ] **Connection string** w Vercel → Environment → `DATABASE_URL` (production i preview `dev` osobno, jeśli używacie dwóch DB).
- [ ] Lokalnie: [`.env.example`](../.env.example) → `.env`; baza **dev** osobno od produkcyjnej, sekretów nie commitujesz.
- [ ] **Migracje na produkcję (Vercel, SEOHost):** `npx prisma migrate deploy` z tym samym `DATABASE_URL` co w Vercel — nakłada pliki z `prisma/migrations/`, **nie** wymaga shadow DB. Odpal lokalnie po nowych migracjach, zanim/razem z deployem.
- [ ] **`prisma migrate dev` na SEOHost (błąd P3014 / P1010):** polecenie tworzy tymczasową **shadow database**; na współdzielonym hostingu konto zwykle **nie** ma `CREATE DATABASE` — to **oczekiwane**. Warianty:
  - **Najczyściej:** lokalna MariaDB (Docker) lub inna baza, gdzie użytkownik może tworzyć bazy — tam `npx prisma migrate dev` (zapisuje migracje w repo).
  - **Na tym samym serwerze:** w panelu utwórz ręcznie **drugą pustą bazę**, daj użytkownikowi do niej dostęp; w `schema.prisma` dodaj `shadowDatabaseUrl = env("SHADOW_DATABASE_URL")` i w lokalnym `.env` wskaż ten URL; wtedy Prisma nie wywołuje `CREATE DATABASE`.
  - **Tylko szybki schemat na zdalnej DB (bez plików migracji):** `npx prisma db push` — przed merge do `main` i tak trzeba wygenerować migrację w środowisku, gdzie `migrate dev` działa.
- [ ] W panelu SEOHost: włącz co najmniej tygodniowe backupy + jednorazowe sprawdzenie odtwarzania.

## 3. Aplikacja (Vercel)
- [ ] Wszystkie zmienne z `.env.example` wklejone w Vercel (Production + Preview, jeśli inne).
- [ ] Domena `weddingassistant.pl` przypięta do projektu; w DNS zgodnie z kreatorem Vercel (A/CNAME/ALIAS).
- [ ] Po pierwszym deploy: smoke test `/`, `/api/health`, `/cennik`, rejestracja, logowanie, `/admin` (2FA).
- [ ] (Opcjonalnie) włącz Sentry w produkcji — zmienne `Sentry` z kreatora integracji Vercel.

## 4. Poczta wychodząca (SMTP) i DNS
- [ ] Działające konto SMTP (seohost lub zewn. dostawca); host, port, użytkownik, hasło, TLS/SSL w `SMTP_URL` lub poje w `.env` zgodnie z [kodem maila](../src/lib/mail).
- [ ] Dla domeny nadawczej: **SPF**, **DKIM** i sensowna polityka **DMARC** (nawet tylko `p=none` na start, potem zaostrzenie), żeby trafiać do skrzynek, a nie do spamu.
- [ ] Wysyłka testowa (rejestracja, reset, wiadomość) na Twoją i drugą skrzynkę.

## 5. Ochrona haseł i haseł seedu
- [ ] Silne, unikalne hasło bazy; nie w commicie.
- [ ] `SEED_ADMIN_PASSWORD` tylko do jednorazowego seeda lokalnie/CI, nie w produkcyjnych zmienv.

## 6. Szyfrowanie (opcjonalnie później)
- [ ] `TOTP_ENCRYPTION_KEY` 32+ losowych znaków (baza zapisu sekretów 2FA w mniej jawnej formie).

Kiedy to masz, wpisz w `docs/status.md` datę i wersję „infrastruktura weryfikowana (prod/preview)\".
