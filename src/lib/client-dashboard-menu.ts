import menuConfig from "@/config/client-dashboard-menu.json";

export type DashboardIconKey =
  | "home"
  | "tools"
  | "dashboard"
  | "users"
  | "check"
  | "table"
  | "calendar"
  | "list"
  | "qr"
  | "spark"
  | "wallet"
  | "receipt"
  | "settings"
  | "gallery"
  | "timeline"
  | "globe"
  | "info"
  | "book"
  | "utensils"
  | "plus"
  | "user"
  | "id"
  | "bell"
  | "package"
  | "layers";

export type DashboardSubcategory = {
  id: string;
  label: string;
  slug: string;
  icon: DashboardIconKey;
};

export type DashboardCategory = {
  id: string;
  label: string;
  slug: string;
  icon: DashboardIconKey;
  description: string;
  subcategories?: DashboardSubcategory[];
};

type MenuConfig = { mainCategories: DashboardCategory[] };

const typedConfig = menuConfig as MenuConfig;

export const dashboardCategories: DashboardCategory[] = typedConfig.mainCategories;

export function findCategoryBySlug(slug: string | undefined): DashboardCategory | null {
  if (!slug) {
    return null;
  }
  return dashboardCategories.find((category) => category.slug === slug) ?? null;
}

export function findSubcategoryBySlug(
  category: DashboardCategory,
  subcategorySlug: string | undefined
): DashboardSubcategory | null {
  if (!subcategorySlug || !category.subcategories) {
    return null;
  }
  return category.subcategories.find((subcategory) => subcategory.slug === subcategorySlug) ?? null;
}

export function defaultDashboardPath(): string {
  return "/dashboard/start";
}

export function buildCategoryPath(category: DashboardCategory): string {
  if (!category.subcategories || category.subcategories.length === 0) {
    return `/dashboard/${category.slug}`;
  }
  return `/dashboard/${category.slug}/${category.subcategories[0].slug}`;
}

export function buildSubcategoryPath(categorySlug: string, subcategorySlug: string): string {
  return `/dashboard/${categorySlug}/${subcategorySlug}`;
}

export function getAllDashboardPaths(): string[] {
  return dashboardCategories.flatMap((category) => {
    if (!category.subcategories || category.subcategories.length === 0) {
      return [buildCategoryPath(category)];
    }
    return category.subcategories.map((subcategory) =>
      buildSubcategoryPath(category.slug, subcategory.slug)
    );
  });
}
