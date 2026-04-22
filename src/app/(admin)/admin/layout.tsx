import type { ReactNode } from "react";

/** Wspólna strefa ciemna dla obsługi (2FA + panel właściwy). */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <div className="min-h-svh flex-1 bg-zinc-950 text-zinc-100">{children}</div>;
}
