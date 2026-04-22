# Status prac: Weddingassistant.pl

**Aktualizacja:** 2026-04-22 (pełne MVP z planu: auth, pakiety, zamówienia, maile, 2FA admina, testy e2e)  
**Cel produktu:** Jedna, spójna platforma: przygotowania, przebieg wesela, wspomnienia — marka **Weddingassistant** (łączenie z kierunkiem “Weddinfo / wizytówka” w jedną ofertę).

## Założenia (nadrzędne)
- **Next.js** (monolit) na **Vercel** + **MySQL/MariaDB** w **SEOHost** — `DATABASE_URL` w env.
- **Domena:** [https://weddingassistant.pl](https://weddingassistant.pl) w `metadata` + `NEXT_PUBLIC_APP_URL` w linkach e-mail.
- **Sesje:** `wa_s_client` / `wa_s_admin` + `Session.mfaComplete` (admin: pełna sesja dopiero po 2FA lub pierwszym skanie QR).
- **Pakiety:** jeden katalog w DB — [`/cennik`](https://weddingassistant.pl/cennik) (public) = źródło dla klienta i [admin/pakiety](/admin/pakiety).
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

## W toku / techniczne „następne”
- [ ] Wypełnienie treści prawnych z pomocą prawnika; treści marketingu spójne z ofertą.
- [ ] Płatności (Stripe / przelewy) do statusu „opłacone” zamiast ręcznej zmiany w adminie.
- [ ] Wizytówka weselna: formularz, subdomena, QR, szablony (roadmapa z planu użytkownika).
- [ ] E2E przepływów zalogowanych (wymaga testowej bazy + seedu).

## Oszacowanie (orientacyjnie, po tej serii)
| Obszar | Stan |
|--------|------|
| Infrastruktura (checklista + env) | **~90%** (uzależnione od Twojego wklejenia sekretów w Vercel) |
| Auth + 2FA + sesje | **~90%** |
| Pakiety + cennik + zamówienia + maile | **~85%** (placeholdery: płatności, treści) |
| Prawo (jako strony szkiców) | **~40%** (wymagane doprecyzowanie merytoryczne) |
| **MVP całości (plan główny)** | **~80%** |

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
