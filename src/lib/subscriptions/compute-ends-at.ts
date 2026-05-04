/**
 * Końcowa data dostępu płatnego pakietu:
 * kotwica `weddingDate + postWeddingAccessMonths`, a gdy brak daty ślubu —
 * od daty zakupu ten sam horyzont miesięcy (tymczasowo do ustawienia daty w profilu).
 */
export function computeSubscriptionEndsAt(args: {
  weddingDate: Date | null;
  purchaseDate: Date;
  postWeddingAccessMonths: number | null;
}): Date {
  const months = args.postWeddingAccessMonths;
  if (months == null || months <= 0) {
    const end = new Date(args.purchaseDate);
    end.setMonth(end.getMonth() + 12);
    return end;
  }
  const base = args.weddingDate ?? args.purchaseDate;
  const end = new Date(base);
  end.setMonth(end.getMonth() + months);
  return end;
}
