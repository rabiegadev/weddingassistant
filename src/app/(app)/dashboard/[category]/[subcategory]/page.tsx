import { notFound } from "next/navigation";
import {
  findCategoryBySlug,
  findSubcategoryBySlug,
} from "@/lib/client-dashboard-menu";
import { DashboardWorkspace } from "@/components/client/dashboard-workspace";

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

  return <DashboardWorkspace category={category} subcategory={subcategory} />;
}
