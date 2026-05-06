import { OrderStatus } from "@prisma/client";

/** Etykiety statusu zamówienia (UI + maile). Importuj stąd z komponentów klienckich — nie z `order-notify`. */
export function orderStatusPl(s: OrderStatus): string {
  const m: Record<OrderStatus, string> = {
    DRAFT: "Szkic",
    SUBMITTED: "Złożone (w kolejce administratora)",
    AWAITING_PAYMENT: "Oczekuje na płatność",
    PENDING_REVIEW: "Oczekuje na decyzję administratora",
    APPROVED: "Zatwierdzone / opłacone",
    IN_PROGRESS: "W trakcie realizacji",
    COMPLETED: "Zamknięte",
    CANCELLED: "Anulowane",
  };
  return m[s] ?? s;
}
