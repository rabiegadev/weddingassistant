import { getAnyAdminSession, getClientSession, getFullAdminSession } from "@/lib/auth/session";
import { getAdmin2faEntryPath } from "@/lib/auth/mfa-routing";
import { SiteHeaderClient } from "./site-header.client";

export async function SiteHeader() {
  const [client, fullAdmin, anyAdmin] = await Promise.all([
    getClientSession(),
    getFullAdminSession(),
    getAnyAdminSession(),
  ]);

  const isAdminFull = Boolean(fullAdmin);
  const isAdmin2faPending = anyAdmin != null && !anyAdmin.mfaComplete;
  const isClient = Boolean(client) && !isAdminFull && !isAdmin2faPending;

  let twoFaHref: string | null = null;
  if (isAdmin2faPending && anyAdmin) {
    twoFaHref = await getAdmin2faEntryPath(anyAdmin.user.id);
  }

  return (
    <SiteHeaderClient
      isClient={isClient}
      isAdminFull={isAdminFull}
      isAdmin2faPending={isAdmin2faPending}
      twoFaHref={twoFaHref}
    />
  );
}
