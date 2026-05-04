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
