import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import { PackageForm } from "@/components/admin/package-form";
import { savePackageAction } from "@/app/actions/packages";

export const dynamic = "force-dynamic";

export default async function AdminPakietyPage() {
  const s = await getFullAdminSession();
  if (!s) {
    return null;
  }
  const list = await prisma.package.findMany({ orderBy: { sortOrder: "asc" } });
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
      <h2 className="font-sans text-lg text-zinc-200">Pakiety (jeden katalog: cennik + wybór klienta)</h2>
      <p className="mt-1 text-sm text-amber-100/70">Opublikowane pakiety widoczne na /cennik i w panelu pary.</p>
      <div className="mt-8 space-y-10">
        {list.map((p) => (
          <div key={p.id} className="rounded-lg border border-amber-900/30 bg-zinc-900/40 p-4">
            <h3 className="text-sm font-medium text-amber-200">{p.name}</h3>
            <p className="text-xs text-zinc-500">slug: {p.slug}</p>
            <div className="mt-3">
              <PackageForm
                key={p.id}
                action={savePackageAction}
                initial={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  description: p.description,
                  priceCents: p.priceCents,
                  features: p.featuresJson,
                  sortOrder: p.sortOrder,
                  isPublished: p.isPublished,
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-10 rounded-lg border border-dashed border-amber-800/50 p-4">
        <h3 className="text-sm font-medium text-amber-200/90">Nowy pakiet</h3>
        <div className="mt-3">
          <PackageForm
            action={savePackageAction}
            initial={null}
          />
        </div>
      </div>
    </div>
  );
}
