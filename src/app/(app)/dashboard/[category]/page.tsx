import { notFound, redirect } from "next/navigation";
import { OrderStatus } from "@prisma/client";
import {
  buildSubcategoryPath,
  findCategoryBySlug,
} from "@/lib/client-dashboard-menu";
import { DashboardWorkspace } from "@/components/client/dashboard-workspace";
import { getClientSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { orderStatusPl } from "@/lib/orders/order-status-pl";

type PageProps = {
  params: Promise<{ category: string }>;
};

export default async function DashboardCategoryPage({ params }: PageProps) {
  const { category: categorySlug } = await params;
  const category = findCategoryBySlug(categorySlug);

  if (!category) {
    notFound();
  }

  if (category.subcategories?.length) {
    redirect(buildSubcategoryPath(category.slug, category.subcategories[0].slug));
  }

  if (category.slug === "start") {
    const session = await getClientSession();
    if (!session) {
      redirect("/logowanie?k=client");
    }

    const [orderInProgress, profile] = await Promise.all([
      prisma.order.findFirst({
        where: {
          userId: session.user.id,
          status: {
            in: [
              OrderStatus.SUBMITTED,
              OrderStatus.AWAITING_PAYMENT,
              OrderStatus.PENDING_REVIEW,
              OrderStatus.APPROVED,
              OrderStatus.IN_PROGRESS,
            ],
          },
        },
        include: { package: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.clientProfile.findUnique({
        where: { userId: session.user.id },
        select: { weddingDate: true },
      }),
    ]);

    const now = new Date();
    const weddingDate = profile?.weddingDate ?? null;
    const diffMs = weddingDate ? weddingDate.getTime() - now.getTime() : null;
    const daysLeft = diffMs == null ? null : Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const countdownLabel =
      weddingDate == null
        ? "Dodaj datę ślubu w Bazie informacji, aby uruchomić odliczanie."
        : daysLeft != null && daysLeft >= 0
          ? `Do ślubu pozostało ${daysLeft} ${daysLeft === 1 ? "dzień" : daysLeft < 5 ? "dni" : "dni"}.`
          : "Data ślubu już minęła — możesz zaktualizować ją w Bazie informacji.";

    return (
      <div className="space-y-4">
        <header className="rounded-xl border border-[var(--wa-dash-border)] bg-[#f7f9ff] p-4">
          <h1 className="text-lg font-semibold text-[var(--wa-dash-navy)] sm:text-xl">Start</h1>
          <p className="mt-1 text-sm text-[var(--wa-dash-muted)]">
            Najważniejsze informacje o Twoim zamówieniu i szybki podgląd terminu ślubu.
          </p>
        </header>

        <div className="grid gap-3 lg:grid-cols-2">
          <article className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-4 shadow-[0_8px_20px_rgba(56,72,120,0.08)]">
            <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Zamówienie w toku</h2>
            {orderInProgress ? (
              <div className="mt-2 space-y-1.5 text-sm text-[var(--wa-dash-muted)]">
                <p>
                  Pakiet: <span className="font-medium text-[var(--wa-dash-text)]">{orderInProgress.package.name}</span>
                </p>
                <p>
                  Status:{" "}
                  <span className="font-medium text-amber-800">{orderStatusPl(orderInProgress.status)}</span>
                </p>
                <p>
                  Ostatnia aktualizacja:{" "}
                  <span className="font-medium text-[var(--wa-dash-text)]">
                    {orderInProgress.updatedAt.toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" })}
                  </span>
                </p>
              </div>
            ) : (
              <p className="mt-2 text-sm text-[var(--wa-dash-muted)]">
                Brak aktywnego zamówienia w toku. Możesz utworzyć nowe w sekcji „Zamówienia”.
              </p>
            )}
          </article>

          <article className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-4 shadow-[0_8px_20px_rgba(56,72,120,0.08)]">
            <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Odliczanie do wesela</h2>
            <p className="mt-2 text-sm text-[var(--wa-dash-muted)]">{countdownLabel}</p>
            {weddingDate ? (
              <p className="mt-2 text-sm">
                Data ślubu:{" "}
                <span className="font-medium text-[var(--wa-dash-text)]">
                  {weddingDate.toLocaleString("pl-PL", { dateStyle: "full", timeStyle: "short" })}
                </span>
              </p>
            ) : null}
          </article>
        </div>
      </div>
    );
  }

  return <DashboardWorkspace category={category} />;
}
