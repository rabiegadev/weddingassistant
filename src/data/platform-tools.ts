/**
 * Narzędzia platformy — opisy draftowe pod roadmapę; bullet „–” renderowany w UI.
 */
export type PlatformToolTier = {
  bullets: string[];
};

export type PlatformTool = {
  id: string;
  title: string;
  summary: string;
  free: PlatformToolTier;
  mid: PlatformToolTier;
  premium: PlatformToolTier;
};

export const platformTools: PlatformTool[] = [
  {
    id: "guests",
    title: "Lista i baza gości",
    summary:
      "Jedna lista nazwisk, kontaktów i statusów — żeby nie dublować arkuszy ani wersji w kilku miejscach.",
    free: {
      bullets: [
        "ręczne dodawanie gości do ustalonego limitu miejsc",
        "prosty podgląd tabeli i wyszukiwarka po imieniu",
        "notatka przy osobie (np. dieta, wymóg parkingu)",
      ],
    },
    mid: {
      bullets: [
        "import / eksport CSV, kolumny zgodne z szablonem",
        "grupy (np. rodzina, znajomi) i szybkie filtry",
        "statusy: zaproszony, potwierdzony, odmowa",
      ],
    },
    premium: {
      bullets: [
        "przypisanie do sali / strefy bez ręcznego kopiowania",
        "podgląd dla pary + uprawnienia dla floretów / rodziców",
        "historia zmian przy osobie (kto i kiedy)",
      ],
    },
  },
  {
    id: "rsvp",
    title: "RSVP online",
    summary:
      "Potwierdzenia od gości w jednym widoku zamiast rozproszenia po Messengerze i SMS.",
    free: {
      bullets: [
        "jeden publiczny link do potwierdzenia „tak / nie”",
        "zbiór odpowiedzi w tabeli bez automatycznych przypomnień",
        "podstawowy komunikat powitalny przy formularzu",
      ],
    },
    mid: {
      bullets: [
        "limit osób +1, pytania dodatkowe (np. transport)",
        "przypomnienia e-mail po zdefiniowanych dniach",
        "powiadomienie pary o nowej odpowiedzi",
      ],
    },
    premium: {
      bullets: [
        "logowanie gościa tokenem / QR bez pełnej rejestracji",
        "szablony wiadomości pod kampanie przypomnień",
        "eksport do listy gości i harmonogramu bez ręcznego przepisywania",
      ],
    },
  },
  {
    id: "check",
    title: "Checklisty przygotowań",
    summary:
      "Lista kroków od formalności po florystkę — żeby nic nie „wyszło” w ostatniej chwili.",
    free: {
      bullets: [
        "gotowy szablon listy startowej do odhaczania",
        "terminy „na sztywno” w kalendarzu zewnętrznym tylko ręcznie",
        "brak własnych etapów — tylko predefiniowane pozycje",
      ],
    },
    mid: {
      bullets: [
        "własne kategorie i daty przypomnień w aplikacji",
        "załączniki (umowa, faktura) przy pozycji",
        "udział drugiej osoby z pary w tym samym planie",
      ],
    },
    premium: {
      bullets: [
        "szablony branżowe (fotograf, DJ, sala) z domyślnymi krokami",
        "priorytety i widok „tylko zaległe”",
        "integracja z listą płatności / budżetem w jednym miejscu",
      ],
    },
  },
  {
    id: "qr",
    title: "Kody QR i szybki dostęp",
    summary:
      "Linki i kody do wydarzenia, harmonogramu lub galerii — mniej tłumaczenia po telefonie.",
    free: {
      bullets: [
        "generacja jednego kodu kierującego na stronę wydarzenia",
        "statyczny plakat do wydruku (PDF podstawowy)",
        "brak ograniczeń czasowych na sam kod",
      ],
    },
    mid: {
      bullets: [
        "kilka kodów (np. parking, wejście, strefa VIP) z etykietą",
        "proste statystyki skanów dziennie / łącznie",
        "podmiana docelowego linku bez druku nowego plakatu (gdy technicznie możliwe)",
      ],
    },
    premium: {
      bullets: [
        "kody z ważnością i językiem strony gościa",
        "biała etykieta (logo pary) na stronie docelowej",
        "wsparcie dla wielu wydarzeń (np. poprawiny) w ramach jednej pary",
      ],
    },
  },
  {
    id: "budget",
    title: "Budżet i koszty",
    summary:
      "Szacunki, raty i podsumowania — choćby tylko żeby porównać dwa warianty sali.",
    free: {
      bullets: [
        "ręczna tabela pozycji i suma na dole",
        "jedno konto pary, brak wielu scenariuszy obok siebie",
        "eksport do skopiowania do arkusza",
      ],
    },
    mid: {
      bullets: [
        "kategorie (sala, catering, fotograf) i procent udziału w całości",
        "dwa warianty budżetu do porównania",
        "przypomnienia o ratach w kalendarzu",
      ],
    },
    premium: {
      bullets: [
        "rezerwa awaryjna + alert przy przekroczeniu progu",
        "powiązanie pozycji z checklistą i umowami",
        "eksport PDF dla rodziców / sponsora",
      ],
    },
  },
];
