import type { ReactNode } from "react";

/** Jednolite tło panelu obsługi (2FA + właściwy admin). */
export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-svh flex-1 bg-slate-100 text-slate-900 antialiased">
      {children}
    </div>
  );
}
