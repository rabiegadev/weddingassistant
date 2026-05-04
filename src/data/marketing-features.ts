/**
 * Funkcje marketingowe strony głównej — krótkie opisy + grafiki z /public/images.
 * (Plik memberslist.png — w briefie „memberlist”; w repozytorium nazwa z „s”.)
 */
export type MarketingFeature = {
  id: string;
  title: string;
  description: string;
  imageSrc: `/${string}`;
};

export const marketingFeatures: MarketingFeature[] = [
  {
    id: "wedding-web",
    title: "Strona wesela",
    description:
      "Wizytówka online dla gości: licznik do wesela, harmonogram, menu, nocleg i poprawiny, kontakt oraz lokalizacja — i więcej w jednym miejscu.",
    imageSrc: "/images/weddingweb.png",
  },
  {
    id: "domain",
    title: "Twoja własna domena",
    description: "Adres pod własną domeną zamiast generycznego linku — spójnie z Waszą marką i zaproszeniami.",
    imageSrc: "/images/domain2.png",
  },
  {
    id: "planner",
    title: "Planer weselny",
    description:
      "Zadania rozłożone w czasie, podstawowe kroki do odhaczenia i zbiór informacji weselnych w jednym widoku.",
    imageSrc: "/images/dziennik.png",
  },
  {
    id: "guests",
    title: "Lista gości",
    description:
      "Grupy, status przekazania zaproszenia, potwierdzenie obecności, udział w poprawinach i informacja o usadzeniu przy stole w planerze — przy każdej osobie.",
    imageSrc: "/images/memberslist.png",
  },
  {
    id: "rsvp",
    title: "RSVP online",
    description:
      "Goście potwierdzają przez stronę wesela po zeskanowaniu kodu QR lub po wejściu w link — bez lawiny wiadomości prywatnych.",
    imageSrc: "/images/rsvp.png",
  },
  {
    id: "checklists",
    title: "Checklisty",
    description: "Gotowe listy zadań, własne listy, edycja i wydruk — żeby nic nie umknęło w pośpiechu.",
    imageSrc: "/images/checklista.png",
  },
  {
    id: "stats",
    title: "Statystyki",
    description:
      "Liczba gości i podział na grupy (np. rodziny, znajomi, usługodawcy), dni do wesela, checklisty, RSVP i postęp spraw — w przejrzystych liczbach.",
    imageSrc: "/images/stats.png",
  },
  {
    id: "tables",
    title: "Plan stołów",
    description:
      "Usadzenie gości z listy przy stołach według liczby stolików, kształtu stołu i miejsc przy każdym.",
    imageSrc: "/images/table1.png",
  },
  {
    id: "support",
    title: "Kontakt z administracją",
    description: "Prośby o zmianę, zgłoszenie błędu lub doprecyzowanie funkcji — bezpośredni kanał do zespołu.",
    imageSrc: "/images/chat.png",
  },
  {
    id: "inspiration",
    title: "Inspiracje",
    description: "Notatki ze zdjęciami, pomysłami, usługodawcami i linkami — Wasza prywatna tablica inspiracji.",
    imageSrc: "/images/inspiration.png",
  },
  {
    id: "budget",
    title: "Budżet i koszty",
    description: "Szacunki, planowanie wydatków i podsumowania — porządek finansowy obok reszty przygotowań.",
    imageSrc: "/images/wallet.png",
  },
  {
    id: "qr",
    title: "Kody QR",
    description: "Spersonalizowany kod QR na stronę weselną i na potwierdzenia obecności online dla gości.",
    imageSrc: "/images/qr.png",
  },
];
