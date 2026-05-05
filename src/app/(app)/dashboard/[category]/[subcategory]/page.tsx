import { notFound, redirect } from "next/navigation";
import {
  findCategoryBySlug,
  findSubcategoryBySlug,
} from "@/lib/client-dashboard-menu";
import { DashboardWorkspace } from "@/components/client/dashboard-workspace";
import { MojPakietView, WszystkiePakietyView } from "@/components/client/moj-pakiet-views";
import { getClientSession } from "@/lib/auth/session";
import { getClientEntitlements } from "@/lib/entitlements/resolve";
import { getModuleGateForPath, planLimitsBanner } from "@/lib/dashboard/module-gate";
import { prisma } from "@/lib/db";
import { BasicInfoForm } from "@/components/client/basic-info-form";
import {
  countBasicInfoProgress,
  parseBasicInfoFromInfoJson,
} from "@/lib/client-profile/basic-info";

type PageProps = {
  params: Promise<{ category: string; subcategory: string }>;
};

export default async function DashboardSubcategoryPage({ params }: PageProps) {
  const { category: categorySlug, subcategory: subcategorySlug } = await params;
  const category = findCategoryBySlug(categorySlug);

  if (!category || !category.subcategories?.length) {
    notFound();
  }

  const subcategory = findSubcategoryBySlug(category, subcategorySlug);
  if (!subcategory) {
    notFound();
  }

  const session = await getClientSession();
  if (!session) {
    redirect("/logowanie?k=client");
  }

  if (categorySlug === "moje-konto" && subcategorySlug === "moj-pakiet") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <MojPakietView userId={session.user.id} />
      </div>
    );
  }

  if (categorySlug === "moje-konto" && subcategorySlug === "wszystkie-pakiety") {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
        <WszystkiePakietyView />
      </div>
    );
  }

  if (categorySlug === "baza-informacji" && subcategorySlug === "widok-glowny") {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
      select: { infoJson: true },
    });
    const basic = parseBasicInfoFromInfoJson(profile?.infoJson);
    const progress = countBasicInfoProgress(basic);
    const tips: string[] = [];
    if (basic.weddingDate.trim() === "") {
      tips.push("ustaw datę ślubu");
    }
    if (basic.ceremonyTime.trim() === "") {
      tips.push("uzupełnij godzinę ślubu");
    }
    if (basic.weddingPartyTime.trim() === "") {
      tips.push("uzupełnij godzinę wesela");
    }
    if (basic.weddingVenueName.trim() === "" || basic.weddingVenueAddress.trim() === "") {
      tips.push("uzupełnij lokalizację wesela");
    }

    return (
      <div className="space-y-4">
        <header className="rounded-xl border border-[var(--wa-dash-border)] bg-[#f7f9ff] p-4">
          <h1 className="text-lg font-semibold text-[var(--wa-dash-navy)] sm:text-xl">Baza informacji</h1>
          <p className="mt-1 text-sm text-[var(--wa-dash-muted)]">
            Tu docelowo zobaczysz statystyki kompletności formularzy informacyjnych oraz podsumowanie braków.
          </p>
        </header>
        <div className="grid gap-3 lg:grid-cols-3">
          <article className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-4 shadow-[0_8px_20px_rgba(56,72,120,0.08)]">
            <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Wypełnienie formularzy</h2>
            <p className="mt-2 text-2xl font-semibold text-[var(--wa-dash-text)]">{progress.percent}%</p>
            <p className="mt-1 text-sm text-[var(--wa-dash-muted)]">
              Wypełniono {progress.filled} z {progress.total} kluczowych pól.
            </p>
          </article>
          <article className="rounded-xl border border-[var(--wa-dash-border)] bg-white p-4 shadow-[0_8px_20px_rgba(56,72,120,0.08)] lg:col-span-2">
            <h2 className="text-sm font-semibold text-[var(--wa-dash-navy)]">Co pozostało</h2>
            {progress.remaining > 0 ? (
              <p className="mt-2 text-sm text-[var(--wa-dash-muted)]">
                Pozostało do uzupełnienia około {progress.remaining} pól. Najbliższe kroki:{" "}
                <span className="font-medium text-[var(--wa-dash-text)]">{tips.join(", ") || "przejdź do informacji podstawowych"}</span>.
              </p>
            ) : (
              <p className="mt-2 text-sm text-emerald-700">
                Świetnie — podstawowe informacje są kompletne. Możesz przejść do kolejnych sekcji i doprecyzować szczegóły.
              </p>
            )}
          </article>
        </div>
      </div>
    );
  }

  if (categorySlug === "baza-informacji" && subcategorySlug === "informacje-podstawowe") {
    const profile = await prisma.clientProfile.findUnique({
      where: { userId: session.user.id },
      select: { infoJson: true },
    });
    const basic = parseBasicInfoFromInfoJson(profile?.infoJson);
    const hasSavedData = profile?.infoJson != null && profile.infoJson.trim() !== "";
    return <BasicInfoForm initialData={basic} hasSavedData={hasSavedData} />;
  }

  const ent = await getClientEntitlements(session.user.id);
  if (!ent) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-rose-700">
        Nie udało się odczytać uprawnień konta.
      </div>
    );
  }

  const gate = getModuleGateForPath(categorySlug, subcategorySlug, ent);
  const limitBanner = planLimitsBanner(categorySlug, subcategorySlug, ent);

  return (
    <DashboardWorkspace
      category={category}
      subcategory={subcategory}
      gate={gate}
      limitBanner={limitBanner}
    />
  );
}
