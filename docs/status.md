# Status prac: Weddingassistant.pl

**Aktualizacja:** 2026-04-22 (MVP + UI marketing/admin, nagłówek wg sesji, cennik na stronie głównej)  
**Cel produktu:** Jedna, spójna platforma: przygotowania, przebieg wesela, wspomnienia — marka **Weddingassistant** (łączenie z kierunkiem “Weddinfo / wizytówka” w jedną ofertę).

## Założenia (nadrzędne)
- **Tryb obecny (tymczasowo):** jedna baza = **produkcja** — w `.env` lokalnie i w Vercel ten sam `DATABASE_URL`. Przy wprowadzaniu zmian w schemacie: tylko **`npx prisma migrate deploy`** (nie seed testowy na produkcję, najpierw backup w panelu SEOHost). Później docelowo: osobna baza **preview** / lokalna pod rozwój.
- **Next.js** (monolit) na **Vercel** + **MySQL/MariaDB** w **SEOHost** — `DATABASE_URL` w env.
- **Domena:** [https://weddingassistant.pl](https://weddingassistant.pl) w `metadata` + `NEXT_PUBLIC_APP_URL` w linkach e-mail.
- **Sesje:** `wa_s_client` / `wa_s_admin` + `Session.mfaComplete` (admin: pełna sesja dopiero po 2FA lub pierwszym skanie QR).
- **Pakiety:** jeden katalog w DB — [`/cennik`](https://weddingassistant.pl/cennik) (public) = źródło dla klienta i [admin/pakiety](/admin/pakiety); **strona główna** sekcja „Oferowane funkcjonalności” ładuje te same pakiety (opublikowane) z bazy.
- **UI publiczne:** nagłówek reaguje na sesję (para / admin / 2FA w toku) — **brak** publicznego linku do logowania admina w stopce (wejście tylko znanym URL, np. `/logowanie?k=admin`).
- **UI admina:** jednolite tło `slate-100`, formularze jasne (czytelność); nie „ciemny monolit”.
- **Checklista infrastruktury:** [docs/infra-checklist.md](infra-checklist.md)

## Co ukończono (wdrożenie zgodne z planem)
- [x] **Auth:** rejestracja pary, silne hasło (Zod), e-mail weryfikacyjny (`/api/auth/verify-email`), logowanie pary, reset hasła (`/reset-hasla`, `/nowe-haslo`), rate limit w MySQL.
- [x] **Turnstile** (opcjonalne w dev): [`TurnstileField`](../src/components/auth/turnstile-field.tsx) + weryfikacja serwerowa; brak klucza w dev = pomijane z logiem.
- [x] **Admin 2FA (TOTP):** [`/admin/2fa/setup`](../src/app/(admin)/admin/2fa/setup/page.tsx) pierwsze skanowanie, [`/admin/2fa`](../src/app/(admin)/admin/2fa/page.tsx) po każdym logowaniu; `otplib@12` (API `authenticator`).
- [x] **Pakiety (CRUD):** `src/app/(admin)/admin/(protected)/pakiety/page.tsx` + `revalidatePath` cennika.
- [x] **Zamówienia + wątki:** klient: [dashboard/zamowienia](../src/app/(app)/dashboard/zamowienia/page.tsx); admin: [zamowienia](../src/app/(admin)/admin/(protected)/zamowienia/page.tsx); zmiana statusu + `OrderEvent`.
- [x] **E-maile transakcyjne:** [order-notify](../src/lib/mail/order-notify.ts) — wiadomość od klienta → `ADMIN_NOTIFY_EMAILS`; odpowiedź admina / zmiana statusu → e-mail do klienta; SMTP: [send.ts](../src/lib/mail/send.ts) (`SMTP_URL` lub `SMTP_HOST` itd.).
- [x] **Prawne (szkice):** [`/prawo/regulamin`](../src/app/(marketing)/prawo/regulamin/page.tsx), [polityka prywatności](../src/app/(marketing)/prawo/polityka-prywatnosci/page.tsx), [rodo](../src/app/(marketing)/prawo/rodo/page.tsx).
- [x] **Migracja SQL w repo:** [prisma/migrations/20250422120000_init_mvp/migration.sql](../prisma/migrations/20250422120000_init_mvp/migration.sql) — `npx prisma migrate deploy` na serwerze.
- [x] **Seed (opcjonalny):** [prisma/seed.ts](../prisma/seed.ts) — pakiety + opcjonalnie `SEED_ADMIN_PASSWORD` + opcjonalnie konto demo pary.
- [x] **Hardening:** nagłówki w [next.config.ts](../next.config.ts) (`X-Frame-Options`, `nosniff`, `Referrer-Policy`); Sentry: [instrumentation.ts](../instrumentation.ts) (tylko gdy `SENTRY_DSN`).
- [x] **E2E (Playwright):** [e2e/smoke.spec.ts](../e2e/smoke.spec.ts) — strona główna + `GET /api/health` (`npm run test:e2e`).
- [x] **Strona główna (2026-04-22):** nowe treści H1/CTA, sekcja `#oferta` z pakiety z DB, kontakt (e-mail, telefon, [rabiegadevelopment.pl](https://rabiegadevelopment.pl)), przełamania kolorystyczne, usunięty kicker marki.
- [x] **Nagłówek / stopka:** po zalogowaniu (para lub admin) ukryte Zaloguj/Załóż konto; linki do panelu + wylogowanie; usunięty łatwy link „wejście do obsługi” ze stopki i przełącznik z formularza logowania pary.

## W toku / techniczne „następne” (priorytet z planu)
- [ ] **Płatności** (Stripe / przelewy) + status „opłacone” w workflow zamówienia.
- [ ] **Wizytówka weselna** (roadmapa): formularz konfiguracji, subdomena, QR, szablony; **osobna konfiguracja** per para (zgodnie z ustaleniami użytkownika).
- [ ] **Treści prawne** z pomocą prawnika (obecnie szkice); copy marketingowe — iteracje.
- [ ] **E2E** pełnych ścieżek (auth, zamówienie, e-mail) — wymaga DB testowej lub seeda; obecnie smoke tylko.
- [ ] **Osobna baza preview/dev** gdy zakończysz pracę „tylko na produkcji” (mniejsze ryzyko błędów na danych żywych).

## Oszacowanie (orientacyjnie, po tej serii)
| Obszar | Stan |
|--------|------|
| Infrastruktura (checklista + env) | **~90%** (uzależnione od Twojego wklejenia sekretów w Vercel) |
| Auth + 2FA + sesje | **~90%** |
| Pakiety + cennik + zamówienia + maile | **~85%** (placeholdery: płatności, treści) |
| Prawo (jako strony szkiców) | **~40%** (wymagane doprecyzowanie merytoryczne) |
| Marketing / strona główna (copy + pakiety live) | **~75%** (demo strefa w menu nadal placeholder) |
| **MVP całości (plan główny)** | **~82%** |

## Ryzyka
- Vercel ↔ zewn. MySQL: opóźnienia sieciowe i limity połączeń — trzymać `connection_limit` niskie, monitorować.
- E-maile: bez SPF/DKIM/DMARC trafią do spamu.
- Turnstile: w produkcji ustaw oba klucze w Vercel.

## Jak uruchomić
1. `npm install`  
2. `.env` z [`.env.example`](../.env.example), `npx prisma migrate deploy` (lub `db push` w dev).  
3. Seed (opcjonalnie): `SEED_ADMIN_PASSWORD=... npx tsx prisma/seed.ts`  
4. `npm run dev`  
5. Testy: `npm run test:e2e` (uruchamia `npm run dev` jeśli brak serwera; `PLAYWRIGHT_NO_SERVER=1` gdy serwer już stoi)

---

*Kolejne wpisy: data, krótki log, hash commita.*
