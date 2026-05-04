import Link from "next/link";
import { notFound } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getFullAdminSession } from "@/lib/auth/session";
import {
  EditClientIdentityForm,
  EditClientProfileForm,
  CreateSubscriptionForm,
  SubscriptionRowEditor,
} from "@/components/admin/edit-client-user";

export const dynamic = "force-dynamic";

type P = { params: Promise<{ id: string }> };

export default async function AdminUserDetailPage({ params }: P) {
  const a = await getFullAdminSession();
  if (!a) {
    return null;
  }
  const { id } = await params;
  const [user, packages] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      include: {
        clientProfile: true,
        subscriptions: { include: { package: true }, orderBy: { endsAt: "desc" } },
        orders: { take: 5, orderBy: { createdAt: "desc" }, include: { package: true } },
      },
    }),
    prisma.package.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!user || user.role !== UserRole.CLIENT) {
    notFound();
  }
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
      <p>
        <Link className="text-sm font-medium text-amber-900 underline" href="/admin/uzytkownicy">
          ← Lista par
        </Link>
      </p>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{user.email}</h2>
        <p className="text-xs text-slate-500">ID: {user.id}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <EditClientIdentityForm userId={user.id} email={user.email} name={user.name} />
        <EditClientProfileForm
          userId={user.id}
          weddingDate={user.clientProfile?.weddingDate ?? null}
          infoJson={user.clientProfile?.infoJson ?? null}
        />
      </div>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-slate-900">Subskrypcje / dostęp</h3>
        {user.subscriptions.length === 0 ? (
          <p className="text-sm text-slate-500">Brak wpisów — możesz nadać plan ręcznie poniżej.</p>
        ) : (
          <ul className="space-y-2">
            {user.subscriptions.map((s) => (
              <SubscriptionRowEditor key={s.id} sub={s} />
            ))}
          </ul>
        )}
        <CreateSubscriptionForm userId={user.id} packages={packages} />
      </section>

      <section>
        <h3 className="text-sm font-semibold text-slate-900">Ostatnie zamówienia</h3>
        {user.orders.length === 0 ? (
          <p className="mt-1 text-sm text-slate-500">Brak.</p>
        ) : (
          <ul className="mt-2 space-y-1 text-sm">
            {user.orders.map((o) => (
              <li key={o.id}>
                <Link className="text-amber-900 underline" href={`/admin/zamowienia/${o.id}`}>
                  {o.package.name}
                </Link>
                <span className="text-slate-500"> · {o.createdAt.toLocaleDateString("pl-PL")}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
