import { notFound, redirect } from "next/navigation";
import {
  buildSubcategoryPath,
  findCategoryBySlug,
} from "@/lib/client-dashboard-menu";
import { DashboardWorkspace } from "@/components/client/dashboard-workspace";

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

  return <DashboardWorkspace category={category} />;
}
