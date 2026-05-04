import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth/session";
import { logoutClientAction } from "@/app/actions/auth";
import { DashboardShell } from "@/components/client/dashboard-shell";
import { ensureClientProfile } from "@/lib/client-profile/ensure";
import { getClientEntitlements } from "@/lib/entitlements/resolve";

export const dynamic = "force-dynamic";

/**
 * Tylko sesja typu `CLIENT` z ciasteczka `wa_s_client`. Sesja `wa_s_admin` nie otwiera tej strefy.
 */
export default async function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  const session = await getClientSession();
  if (!session) {
    redirect("/logowanie?k=client");
  }
  const userDisplayName = session.user.name?.trim() || session.user.email;
  await ensureClientProfile(session.user.id);
  const ent = await getClientEntitlements(session.user.id);
  const planStrip =
    ent == null
      ? undefined
      : {
          label: ent.labelPl,
          hasPaid: ent.hasActivePaidSubscription,
          endsLabel:
            ent.subscriptionEndsAt == null
              ? null
              : ent.subscriptionEndsAt.toLocaleString("pl-PL", { dateStyle: "medium", timeStyle: "short" }),
          freePlannerNote: !ent.hasActivePaidSubscription,
        };

  return (
    <DashboardShell
      userDisplayName={userDisplayName}
      logoutAction={logoutClientAction}
      planStrip={planStrip}
    >
      {children}
    </DashboardShell>
  );
}
