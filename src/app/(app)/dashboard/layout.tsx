import { redirect } from "next/navigation";
import { getClientSession } from "@/lib/auth/session";
import { logoutClientAction } from "@/app/actions/auth";
import { DashboardShell } from "@/components/client/dashboard-shell";

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

  return (
    <DashboardShell userDisplayName={userDisplayName} logoutAction={logoutClientAction}>
      {children}
    </DashboardShell>
  );
}
