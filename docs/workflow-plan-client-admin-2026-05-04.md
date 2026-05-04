# Weddingassistant - plan docelowego workflow (klient/admin) + baza danych

Data: 2026-05-04  
Zakres: analiza obecnego stanu, docelowy proces, model danych, bezpieczeństwo, wdrożenie 100% sprawne

## 1) Cel biznesowy

Zbudować spójny, przewidywalny workflow od wejścia na stronę, przez rejestrację i wybór planu, aż po realizację usługi (w tym strona weselna), z:
- modelem freemium (dużo funkcji dostępnych od razu, ale z limitami),
- płynną obsługą zamówień i płatności,
- jasnym panelem klienta i profesjonalnym panelem admina,
- pełną audytowalnością zmian,
- gotowością do dokładania kolejnych modułów bez przebudowy fundamentów.

## 2) Stan obecny (realnie w repo)

## 2.1 Co już działa

- Rejestracja/logowanie klienta, reset hasła, weryfikacja e-mail.
- Logowanie Google dla klientów.
- Admin z 2FA (TOTP).
- Pakiety w bazie (`Package`) i publikacja na stronie/cenniku.
- Zamówienia (`Order`) ze statusami i historią (`OrderEvent`).
- Wątek wiadomości per zamówienie (`OrderMessage`) + notyfikacje e-mail dla statusów/wiadomości.
- Dashboard klienta i admina istnieją, ale duża część dashboardu klienta to UI placeholder.
- Podstawowe hardening (nagłówki, rate limit, Sentry opcjonalnie).

## 2.2 Co jest wąskim gardłem / brakujące

- Brak przypisanego "aktywnego planu klienta" (entitlements/licencja) niezależnie od zamówienia.
- Brak formalnego workflow subskrypcji/planu (trial/free/paid/expired itp.).
- Brak automatycznego gatingu funkcji per plan (dzisiaj to głównie treści i manualne działania).
- Brak modeli danych pod "Baza informacji" (sekcje, wymagane pola per plan, wersjonowanie zmian).
- Brak osobnej domeny "strona weselna jako usługa" (brief, statusy realizacji, SLA/czas oczekiwania, akceptacja projektu, rewizje).
- Brak płatności online i brak warstwy invoice/payment reconciliation.
- Brak formularza kontaktowego zapisującego do DB + wysyłka do Ciebie.
- Brak wiadomości powitalnej HTML po rejestracji (szczególnie brak po Google OAuth).
- Panel admina: obecnie MVP, za mało KPI/alertów/filtrowania/skrzynek i narzędzi operacyjnych.

## 3) Jak to zwykle wygląda w podobnych aplikacjach (benchmark)

Najczęściej stosowany jest model:
- **Order** (zamówienie) oddzielone od **Subscription/PlanAssignment** (co klient realnie ma aktywne),
- **Feature flags + usage limits** per plan,
- **Workflow status machine** (ściśle zdefiniowane przejścia),
- **Data completeness** (czy klient podał wymagane dane do realizacji),
- **Service Request** dla usług manualnych (np. strona weselna robiona przez zespół),
- **Audit log + notifications center** jako rdzeń operacyjny.

To dokładnie pasuje do Twojego kierunku: freemium + manualna realizacja premium.

## 3A) Katalog pakietów — założenia biznesowe (ustalone)

Poniżej **6 pakietów** jako linia produktowa do planowania prac, limitów, formularzy zamówienia i realizacji wizytówki WWW.

| # | Nazwa robocza | Skrót |
|---|----------------|--------|
| 1 | Darmowy | `FREE` |
| 2 | Asystent podstawowy | `ASSIST_BASIC` |
| 3 | Wizytówka WWW z gotowego szablonu | `WWW_TEMPLATE` |
| 4 | Asystent podstawowy + wizytówka WWW z gotowych szablonów | `ASSIST_BASIC_WWW_TEMPLATE` |
| 5 | Asystent premium + wizytówka WWW z gotowych szablonów | `ASSIST_PREMIUM_WWW_TEMPLATE` |
| 6 | Asystent premium + personalizowany projekt wizytówki WWW | `ASSIST_PREMIUM_WWW_CUSTOM` |

### 3A.1 Pakiet 1 — Darmowy

- **Lista gości:** dostępna, limit **25 osób** (inaczej niż wcześniejsze szkice 20 — przyjmujemy **25** jako docelowe).
- **Inne narzędzia:** dostępne w **ograniczonym trybie** (limity / częściowe funkcje / podglądy — szczegółowa matryca limitów w osobnym kroku konfiguracji produktu).
- **Galeria:** **brak** (zgodnie z ustaleniem: galeria nie w planie darmowym).
- **Strona WWW / RSVP zaawansowane:** typowo poza free lub tylko komunikat upgrade (RSVP „pro” dopiero w pakietach ze stroną).

### 3A.2 Pakiet 2 — Asystent podstawowy

- Dostęp do **większości narzędzi** „asystenta” z wyjątkiem części modułów **premium** albo z **niższymi limitami** niż w pakiecie premium (konkretna lista modułów do dopisania przy definicji MVP narzędzi).
- **Bez** pełnej wizytówki WWW z usługą hostingu/domeny (jeśli nie dokupi innego pakietu).

### 3A.3 Pakiet 3 — Wizytówka WWW z gotowego szablonu

- **Tylko** usługa strony weselnej: strona WWW + **domena**.
- **Bez galerii** na stronie (lub moduł galerii wyłączony w tym wariancie produktowym).
- **RSVP:** wersja **podstawowa** (np. potwierdzenie obecności / prosty limit odpowiedzi — do doprecyzowania technicznie).
- Przy zamówieniu: **obowiązkowy wybór szablonu** z listy gotowych (`templateId` w zamówieniu / briefie).

### 3A.4 Pakiet 4 — Asystent podstawowy + wizytówka WWW (szablony)

- Logicznie: **suma pakietu 2 i 3** (asystent w wariancie podstawowym + strona z szablonu + domena, bez galerii na stronie w tym samym założeniu co pkt 3).
- Przy zamówieniu: **wybór szablonu z listy** (jak w pakiecie 3).

### 3A.5 Pakiet 5 — Asystent premium + wizytówka WWW (szablony)

- **Wszystkie narzędzia asystenta** z **najwyższymi limitami**.
- Strona WWW **z gotowych szablonów** (jak linia produktowa 3/4).
- Przy zamówieniu pakietów opartych o szablony: w formularzu **konieczny wybór szablonu** z listy (`templateId`).
- RSVP: zakładamy **szerszy zakres** niż „podstawowy” z pakietu 3 (do doprecyzowania vs pakiet 6 — np. limity gości w RSVP, eksport — na etapie projektowania modułu).

### 3A.6 Pakiet 6 — Asystent premium + personalizowany projekt wizytówki WWW

- Ten sam zakres co **pakiet 5** po stronie asystenta (premium + najwyższe limity).
- Zamiast wyboru gotowego szablonu: klient **opisuje kolorystykę**, **załącza inspiracje i zdjęcia**, podaje **szczegółowy brief** oczekiwań.
- Realizacja po stronie admina: workflow **custom design** (brief, iteracje, akceptacja — możliwie osobne statusy niż linia szablonowa).

### 3A.7 Wpływ na system (planowanie wdrożenia)

- **Entitlements:** każdy pakiet mapuje się na `featuresConfigJson` + `limitsConfigJson` (np. `guests.max`, `gallery.enabled`, `weddingPage.mode`: `none` | `template` | `custom`, `rsvp.tier`: `none` | `basic` | `full`).
- **Zamówienie:** dla pakietów **3, 4, 5** — pole **wyboru szablonu** (walidacja wymagana przed złożeniem); dla **6** — **brief + załączniki** zamiast `templateId` (limit rozmiaru/plików, antywirus w przyszłości).
- **`WeddingPageRequest`:** rozróżnienie typu realizacji `TEMPLATE` vs `CUSTOM_BRIEF` (różne checklisty dla admina i klienta).
- **Panel admina:** filtry po typie pakietu / typie realizacji strony; kolejka „szablony” vs „projekty indywidualne”.

### 3A.8 Ważność dostępu, reset planu Free, poprawki wizytówki (ustalone)

**Plan darmowy**

- **Co tydzień** automatyczny reset danych planera dodanych przez klienta (m.in. lista gości, budżet — wg tabel `PlannerGuest` / `PlannerBudgetLine`). **Konto i logowanie pozostają.**
- Technicznie: cron `GET /api/cron/free-planner-reset` (nagłówek `Authorization: Bearer CRON_SECRET`), harmonogram w `vercel.json` (niedziela 04:00 UTC — do strojenia).

**Pakiety 2, 3, 4**

- Dostęp **od wykupienia** do **6 miesięcy po dacie ślubu** (`postWeddingAccessMonths = 6`, koniec = `weddingDate + 6 mies.`; przy braku daty ślubu — tymczasowo od daty zakupu + ten sam horyzont miesięcy — do strojenia po pełnym profilu).

**Pakiety 5 i 6**

- Dostęp **od wykupienia** do **12 miesięcy po dacie ślubu** (`postWeddingAccessMonths = 12`), **z możliwością przedłużenia** (osobna obsługa administracyjna / pole `endsAt` — do doprecyzowania w UI).

**Poprawki wizytówki WWW**

- Pakiety z **gotowym szablonem:** po akceptacji projektu przez klienta — **2 darmowe poprawki**.
- Pakiet **personalizowany (6):** **2 duże poprawki**; poprawki w **treści, imionach, numerach telefonu** — **bez dodatkowych opłat** (polityka „drobiazgi gratis”).

## 4) Docelowy workflow klienta (proponowany)

## 4.1 Wejście i onboarding

1. Klient wchodzi na `weddingassistant.pl`, ogląda ofertę/funkcje/cennik/case studies.
2. Rejestruje konto (mail lub Google).
3. Dostaje:
   - e-mail weryfikacyjny (mail),
   - e-mail powitalny HTML (mail + Google),
   - wejście do dashboardu z aktywnym planem `FREE`.

## 4.2 Dashboard - warstwa freemium i planów

- W menu: nowa kategoria **Mój plan** (między `Baza informacji` i `Moje konto`), z podstronami:
  - `Mój plan` (domyślna),
  - `Wszystkie plany`.
- W `Mój plan` klient widzi:
  - aktualny plan (np. Free),
  - limity i wykorzystanie (np. goście: 12/25 w planie darmowym),
  - informację, że moduł `Galeria` jest dostępny wyłącznie od planu płatnego,
  - blokowane funkcje i co odblokuje upgrade,
  - CTA do `Wszystkie plany`.
- W `Wszystkie plany`:
  - lista planów (docelowo **6** pozycji — sekcja **3A**),
  - porównanie funkcji i limitów,
  - wejście do dedykowanej podstrony planu.

## 4.3 Złożenie zamówienia planu

Przy "Zamów ten plan":
- checkbox potwierdzenia (wymagany),
- walidacja "profil kompletności minimalnej" (zależnie od planu),
- utworzenie zlecenia z numerem,
- status początkowy: `PENDING_APPROVAL` (zamiast obecnego luźnego mapowania statusów),
- przekierowanie na `Start` i pokazanie statusu zamówienia.

## 4.4 Akceptacja -> płatność -> aktywacja planu

1. Admin akceptuje zamówienie -> status `PENDING_PAYMENT`.
2. Klient dostaje e-mail + może przejść do "Szczegóły zamówienia" i opłacić.
3. Po opłaceniu:
   - zamówienie: `PAID`,
   - plan klienta: aktywowany (`ACTIVE`),
   - narzędzia automatycznie dostają nowe limity/uprawnienia,
   - jeżeli plan zawiera stronę weselną: tworzony request realizacyjny.

## 4.5 Realizacja strony weselnej (manualna usługa)

Jeśli plan zawiera usługę strony:
- automatycznie tworzony `WeddingPageRequest`,
- klient widzi status i SLA:
  - standard: 2-5 dni roboczych,
  - przy obłożeniu: 7-10 dni roboczych,
- statusy realizacji ustawiane przez admina (np. `QUEUED`, `IN_BUILD`, `AWAITING_FEEDBACK`, `READY_TO_APPROVE`, `LIVE`),
- klient dostaje e-mail przy każdej istotnej zmianie statusu.

## 4.6 Baza informacji jako warunek realizacji

- `Baza informacji > Informacje podstawowe` staje się centralnym miejscem danych wejściowych.
- Każdy plan ma minimum wymaganych pól (dynamicznie).
- Bez spełnionego minimum:
  - nie pozwalamy złożyć zamówienia planu wymagającego danych,
  - pokazujemy checklistę braków.
- Edycje danych po złożeniu zamówienia:
  - zapis wersji + diff,
  - widoczne na czerwono w panelu admina,
  - wpis w audycie pod klientem i usługą.

## 5) Docelowy workflow administratora (proponowany)

## 5.1 Admin home - profesjonalny kokpit

Pierwszy ekran admina powinien mieć:
- KPI: nowi użytkownicy (24h/7d), nowe zamówienia, oczekujące płatności, opóźnione realizacje.
- Alerty: brakujące dane klientów, nieprzeczytane wiadomości, nierozpatrzone formularze kontaktowe.
- Taskbox: "Wymagają działania dzisiaj".

## 5.2 Główne moduły admina

1. **Zamówienia**
   - filtry: status, data, plan, klient, kanał płatności,
   - masowe akcje (np. akceptacja, archiwizacja),
   - pełna historia zdarzeń i komentarzy.
2. **Klienci**
   - profil klienta, aktywny plan, wykorzystanie limitów, kompletność danych,
   - mapa usług przypisanych do klienta.
3. **Realizacje strony weselnej**
   - pipeline prac, SLA, blokery, przypisania.
4. **Wiadomości/czat**
   - inbox unifikowany (order chat + kontakt),
   - SLA odpowiedzi, etykiety, przypisanie opiekuna.
5. **Skrzynki pocztowe**
   - etap 1: agregacja metadanych/aliasy i logi e-maili wysłanych przez app,
   - etap 2 (opcjonalnie): pełna integracja IMAP/API (Gmail/MS365).
6. **Pakiety i limity**
   - zarządzanie planami, cechami, limitami, publikacją.
7. **Audyt i bezpieczeństwo**
   - logi admin actions, zmiany w danych klientów, logi podejrzanych zdarzeń.

## 6) Proponowany model danych (docelowy)

Poniżej rozszerzenie obecnego `User/Package/Order/...` - bez łamania tego, co już masz.

## 6.1 Rdzeń planów i dostępów

- `Plan` (zastępuje/rozszerza obecny `Package` semantycznie):
  - `id`, `name`, `slug`, `tier`, `isFree`, `isPublished`, `priceCents`,
  - `billingType` (`ONE_TIME`, `SUBSCRIPTION`),
  - `featuresConfigJson` (flagi funkcji),
  - `limitsConfigJson` (limity, np. guests/maxTables/...).
- `UserPlan` (aktywne przypisanie planu do klienta):
  - `id`, `userId`, `planId`, `status` (`ACTIVE`, `PENDING`, `EXPIRED`, `CANCELLED`),
  - `startedAt`, `endsAt`, `sourceOrderId`.
- `FeatureUsage`:
  - `id`, `userId`, `featureKey`, `periodKey`, `used`, `limitSnapshot`.

Dlaczego tak: jednoznacznie oddziela "co zamówił" od "co realnie ma aktywne".

## 6.2 Zamówienia i płatności

- `Order` (rozszerzyć):
  - nowy enum statusów:
    - `PENDING_APPROVAL`,
    - `PENDING_PAYMENT`,
    - `PAID`,
    - `IN_FULFILLMENT`,
    - `COMPLETED`,
    - `REJECTED`,
    - `CANCELLED`.
  - `orderNumber` (czytelny dla klienta),
  - `confirmationAcceptedAt` (checkbox),
  - `currency`, `paymentDueAt`, `paidAt`.
- `Payment`:
  - `id`, `orderId`, `provider`, `providerPaymentId`,
  - `status`, `amountCents`, `currency`,
  - `createdAt`, `capturedAt`, `failedAt`, `failureReason`.
- `Invoice` (opcjonalnie etap 2):
  - `id`, `orderId`, `number`, `pdfUrl`, `issuedAt`.

## 6.3 Baza informacji (strukturyzowana)

- `InfoSection` (np. podstawowe, dojazd, nocleg, poprawiny).
- `InfoFieldDefinition`:
  - klucz pola, typ, walidacja, czy wymagane dla jakich planów.
- `UserInfoFieldValue`:
  - wartość per klient per pole.
- `UserInfoSnapshot`:
  - wersja danych (do porównań i audytu).
- `UserInfoChangeLog`:
  - kto, kiedy, co zmienił (z diffem).

## 6.4 Strona weselna jako usługa

- `WeddingPageRequest`:
  - `id`, `userId`, `orderId`, `status`, `priority`,
  - `fulfillmentType`: `TEMPLATE` | `CUSTOM_BRIEF` (zgodnie z pakietami 3–6, sekcja **3A**),
  - `templateId` (wymagane dla `TEMPLATE`; `null` dla `CUSTOM_BRIEF`),
  - `customBriefJson` / załączniki (dla pakietu 6),
  - `galleryEnabled` (dla linii produktowej „WWW”: domyślnie **false** w pakiecie 3 zgodnie z założeniem „bez galerii”),
  - `estimatedFrom`, `estimatedTo`, `delayedReason`,
  - `assignedAdminId`.
- `WeddingPageMilestone`:
  - kroki realizacji + terminy.
- `WeddingPageRevision`:
  - feedback klienta, licznik poprawek, akceptacje.

## 6.5 Kontakt i komunikacja

- `ContactInquiry` (formularz z landing page):
  - `id`, `name`, `email`, `phone?`, `message`,
  - `sourcePage`, `status`, `assignedAdminId`.
- `NotificationLog`:
  - rejestr wszystkich wysłanych e-maili/push.
- `Conversation` + `ConversationMessage` (opcja docelowa)
  - unifikacja czatu order + kontakt.

## 7) Gating i limity - jak to wdrożyć bez chaosu

Wprowadzić centralną warstwę:
- `getUserEntitlements(userId)` zwraca:
  - plan aktywny,
  - flagi funkcji,
  - limity i bieżące użycie.
- Każdy moduł pyta tę warstwę (zamiast własnej logiki if-ów).
- Komunikaty UX:
   - "Masz plan Free: limit gości 25, użyto 14"
  - "Galeria nie jest dostępna w planie darmowym - odblokuj plan płatny"
  - "Odblokuj plan X, by zwiększyć limit do 120"
- Soft lock + CTA do upgrade, nie twarde "brak dostępu" (zgodnie z Twoim założeniem).

## 8) E-mail i notyfikacje - standard

Wysyłki obowiązkowe:
- rejestracja (verify),
- welcome HTML (mail i Google),
- złożenie zamówienia,
- zmiana statusu zamówienia,
- płatność (sukces/błąd),
- każda nowa wiadomość na czacie,
- status realizacji strony weselnej,
- nowy formularz kontaktowy (do admina).

Minimum jakości:
- szablony HTML + fallback text,
- SPF/DKIM/DMARC,
- idempotency key przy wysyłkach (uniknięcie duplikatów),
- logowanie do `NotificationLog`.

## 9) Bezpieczeństwo i niezawodność (priorytet)

## 9.1 Co dodać

- CSRF protection dla mutujących formularzy (szczególnie plan/order/payment).
- Idempotency token dla akcji "zamów plan" i "opłać".
- Walidacja przejść statusów jako state machine (brak dowolnych skoków).
- RBAC granularny w panelu admina (role w przyszłości: owner, support, operator).
- Limit/lockout dla krytycznych endpointów (order/payment/contact).
- Centralny audit trail dla każdej istotnej zmiany.
- Backup + test odtworzeniowy + plan awaryjny.

## 9.2 Co poprawić względem obecnego stanu

- Obecne statusy zamówień są "MVP", wymagają doprecyzowania pod płatności i akceptację.
- Brakuje formalnego modelu płatności i aktywacji planu po płatności.
- Brakuje centralnego modelu uprawnień i usage limits.
- Brakuje formalnego modelu "realizacji strony weselnej" i SLA.

## 10) Plan wdrożenia (etapami)

## Etap 1 - Fundament planów i workflow (najważniejsze)

- Dodać `UserPlan` i entitlements service.
- Przebudować statusy `Order` pod Twój proces.
- Dodać checkbox confirm + order number.
- Dodać menu i widoki `Mój plan` / `Wszystkie plany`.
- Dodać e-mail welcome HTML (mail + Google).

Rezultat: działający freemium + upgrade flow bez płatności online.

## Etap 2 - Płatności i aktywacja automatyczna

- Dodać `Payment`.
- Integracja operatora płatności (najprościej Stripe, alternatywnie Przelewy24/Tpay/PayU).
- Webhooki + idempotencja + automatyczna aktywacja `UserPlan`.

Rezultat: end-to-end order -> payment -> active plan.

## Etap 3 - Baza informacji i wymagalność danych

- Dodać model sekcji/pól/wartości/snapshotów.
- Reguły "minimalne dane per plan".
- Alerty braków i czerwone znaczniki zmian dla admina.

Rezultat: kontrola jakości danych i mniej ręcznej komunikacji.

## Etap 4 - Realizacja strony weselnej (manual operations)

- Dodać `WeddingPageRequest` + milestone/revisions.
- Widok statusów i SLA po stronie klienta.
- Panel operacyjny admina pod realizacje.

Rezultat: klient widzi postęp, admin ma pipeline.

## Etap 5 - Admin Pro + kontakt + unified inbox

- Przebudowa kokpitu admina na KPI/alerty/listy zadań.
- Formularz kontaktowy -> DB + e-mail + panel admina.
- Rozszerzenie czatu i centrum notyfikacji.

Rezultat: profesjonalna operacyjna obsługa.

## 11) Propozycje wariantów (plusy/minusy)

## 11.1 Płatności

1. **Stripe**
   - plusy: szybka implementacja, świetne webhooki, dobre DX,
   - minusy: UX płatności mniej "lokalne PL".
2. **Przelewy24 / PayU / Tpay**
   - plusy: lokalna rozpoznawalność i metody płatności PL,
   - minusy: zwykle dłuższa integracja i mniej "gotowych" narzędzi developerskich.

## 11.2 Plan modelowania

1. **Plan = rozwinięcie Package**
   - plusy: mniejsza migracja,
   - minusy: semantyczne mieszanie "oferty" i "entitlements".
2. **Nowe Plan + UserPlan + OfferPackage**
   - plusy: czystość domenowa i skalowalność,
   - minusy: więcej pracy na starcie.

Rekomendacja: hybryda - zacząć od rozszerzenia obecnego `Package`, ale koniecznie dodać `UserPlan`.

## 11.3 Komunikacja klient-admin

1. **Chat per zamówienie (jak teraz) + ContactInquiry osobno**
   - plusy: szybkie wdrożenie,
   - minusy: komunikacja rozproszona.
2. **Unified inbox**
   - plusy: porządek operacyjny,
   - minusy: większy koszt wdrożenia.

Rekomendacja: etapowo, najpierw wariant 1.

## 12) Koszty i wysiłek (orientacyjnie)

Zakładając 1 developera full-stack:
- Etap 1: 6-10 dni
- Etap 2: 5-9 dni
- Etap 3: 7-12 dni
- Etap 4: 6-10 dni
- Etap 5: 8-14 dni

Łącznie: ~32-55 dni roboczych (zależnie od UX, zakresu admina i integracji płatności).

Koszty zewnętrzne:
- SMTP/deliverability (czasem dedykowany provider),
- operator płatności (prowizje),
- monitoring/logowanie (opcjonalnie),
- ewentualnie storage pod pliki i assety.

## 13) Konkretna lista zmian w projekcie (co dodać/usunąć/zmienić)

## 13.1 Dodać

- Modele: `UserPlan`, `FeatureUsage`, `Payment`, `ContactInquiry`, `NotificationLog`, `WeddingPageRequest`.
- Centralny serwis entitlements.
- Widoki `Mój plan` / `Wszystkie plany`.
- Welcome mail HTML i templatki transakcyjne.
- Formularz kontaktowy zapisujący do DB.
- Dashboard admin pro (KPI + alerty + task list).

## 13.2 Zmienić

- Mapowanie i przejścia statusów zamówień.
- `Package` (cechy + limity + powiązanie z wymaganiami danych).
- Onboarding po rejestracji (Free plan i "next steps").
- Dostępność `Galeria` wyłącznie dla planów płatnych (brak dostępu w Free).
- Start dashboard klienta (status planu, status zamówień, licznik do ślubu, checklista braków).

## 13.3 Usunąć / ograniczyć

- Manualne JSON-y wpisywane przez klienta w "nowe zamówienie" (to ma być formularz domenowy).
- Rozproszone placeholdery tam, gdzie użytkownik oczekuje realnej funkcji.

## 14) Kryteria "100% sprawne" (Definition of Done)

- Każdy nowy klient ma automatycznie aktywny plan Free.
- Limity działają i są widoczne użytkownikowi.
- Zamówienie planu przechodzi pełny cykl statusów bez ręcznych obejść.
- Po płatności plan aktywuje się automatycznie.
- Strona weselna ma własny, czytelny workflow i SLA.
- Każda ważna akcja ma notyfikację i wpis w logach.
- Admin ma jeden kokpit operacyjny i nie musi "szukać po systemie".
- Testy E2E obejmują krytyczne ścieżki (rejestracja, zamówienie, płatność, zmiana statusu).

## 15) Decyzje zamknięte (odpowiedzi na plan workflow)

1. **Plan Free:** co tydzień reset danych planera (goście, budżet itd.), konto bez zmian — patrz [3A.8](#3a8-ważność-dostępu-reset-planu-free-poprawki-wizytówki-ustalone).
2. **Limity Free:** goście **max 25**, stoły **max 3** (egzekwowane w planerze wg planu), **QR ograniczone**; galeria poza Free.
3. **Płatności:** **Przelewy24** i **PayU** (integracja kolejno; najpierw jeden pełny flow + webhook).
4. **Poprawki wizytówki:** szablony — **2** darmowe po akceptacji; projekt indywidualny — **2 duże** + drobne treści **gratis** — patrz [3A.8](#3a8-ważność-dostępu-reset-planu-free-poprawki-wizytówki-ustalone).
5. **Kolejność wdrożenia:** wszystko po kolei — **płatności i obieg zamówienia**, potem **testy**, potem kolejne funkcje (żeby nic nie blokowało). Formularz kontaktowy zapis + e-mail do admina jako wczesny, nieblokujący element.

## 15A) Stan wdrożenia w repozytorium (bieżący)

### Zrobione

- Model **profilu + subskrypcji + płatności + zapytań kontaktowych** w Prisma; seed **6 pakietów** (`prisma/seed.ts`).
- **Entitlements** (`src/lib/entitlements/resolve.ts`) + pasek planu w panelu klienta.
- **Aktywacja subskrypcji** przy przejściu zamówienia na status `APPROVED` (`activateSubscriptionFromPaidOrder`) oraz po **potwierdzeniu P24**.
- **Cron resetu Free** + endpoint chroniony `CRON_SECRET`.
- **Formularz kontaktowy** (`POST /api/contact`) + zapis + e-mail na `ADMIN_NOTIFY_EMAILS`.
- **Przelewy24 (pierwszy operator):** rejestracja transakcji, przycisk na `/dashboard/zamowienia/[id]`, webhook `/api/webhooks/przelewy24` + **verify** + zamknięcie zamówienia (`complete-paid-order.ts`). Wymaga zmiennych z `.env.example` (`PRZELEWY24_*`).
- **PayU (drugi operator):** OAuth + `POST /api/v2_1/orders`, przycisk na `/dashboard/zamowienia/[id]` (obok P24, jeśli oba skonfigurowane), webhook `/api/webhooks/payu` + podpis `OpenPayu-Signature` + `completeOrderAfterVerifiedPayment` z `PaymentProvider.PAYU`. Zmienne: `PAYU_*` w `.env.example`.
- **Workflow zamówienia — status `AWAITING_PAYMENT`:** nowe zamówienie płatne z panelu pary dostaje ten status zamiast jedynie `SUBMITTED`; Przelewy24/PayU akceptują też `SUBMITTED`/`PENDING_REVIEW`. Etykiety PL w `order-notify.ts`.
- **Panel admina rozszerzony:** `/admin/uzytkownicy`, edycja pary (e-mail, imię, profil z `infoJson`, **subskrypcje ręczne** — nowy wpis, zmiana `endsAt`, usunięcie), `/admin/kontakt` (`ContactInquiry`), `/admin/strony-weselne` (`WeddingPageRequest`), `/admin/powiadomienia` (`NotificationLog`), kokpit ze skrótami; **korekta zamówienia** (kwota PLN + pakiet) na `/admin/zamowienia/[id]`; nagłówek UI odświeżony.
- **Klient — „Mój pakiet” / „Wszystkie pakiety”:** treść pod `/dashboard/moje-konto/moj-pakiet` i `.../wszystkie-pakiety`. Paywall modułów: **`galeria`** / **`strona-weselna`** wg `ClientEntitlements`; banner limitów dla listy gości / planu stołów.
- **Powiadomienia:** tabela `NotificationLog` + wpis po wysłaniu maila; treść HTML minimalnie szablonowana w `send.ts`.
- **Migracja:** `20260504210000_admin_operational_layer` — checklista wdrożenia: [docs/wdrozenie-po-zmianach-admin-2026-05-04.md](./wdrozenie-po-zmianach-admin-2026-05-04.md).

### Do zrobienia (z całego planu — priorytet)

1. **Workflow zamówienia** — decyzja biznesowa: czy blokować płatność dopiero po akceptacji admina (`PENDING_REVIEW`) dla części produktów (w kodzie statusy są rozróżnione; logika „najpierw akceptacja” wymaga osobnej reguły).
2. **Baza informacji** — rozbudowa pól, walidacja schematu JSON per pakiet, ewent. diff w panelu (obecnie `infoJson` + edycja w adminie).
3. **Strona weselna jako usługa** — formularz zgłoszenia po stronie pary, SLA, limity poprawek (2 / 2 duże) — model `WeddingPageRequest` + admin jest; dalsza logika.
4. **E-maile transakcyjne HTML** — spójna szata graficzna, welcome (Google), rozbudowane szablony (obecnie prosty HTML + tekst).
5. **E2E** — pełne ścieżki: auth, zamówienie, P24/PayU sandbox, webhooks.
6. **Paywall narzędzi** — twarde limity przy dodawaniu gości/wydatków (API + UI), nie tylko banner.
7. **`NotificationLog`** — eksport / filtrowanie po szablonie (opcjonalnie).


## 16) Rekomendacja końcowa

Twoja koncepcja jest bardzo dobra i rynkowo sensowna: mocne freemium + dopłata za premium realizację.

Największy zysk da teraz:
1) formalizacja warstwy planów i uprawnień,  
2) porządny workflow statusów zamówień,  
3) model realizacji strony weselnej jako osobnej usługi,  
4) przebudowa panelu admina pod operacje dzienne.

Dzięki temu dołożysz kolejne moduły bez długu architektonicznego i bez "ręcznego spinania" logiki za każdym razem.
