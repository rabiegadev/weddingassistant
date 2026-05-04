"use client";

import type { ReactNode } from "react";
import { AuthModalProvider } from "@/components/auth/auth-modal-context";
import { AuthModalDialog } from "@/components/auth/auth-modal-dialog";
import type { RegisterPreflight } from "@/lib/captcha/register-preflight";

export function MarketingAuthWrapper({
  children,
  registrationPreflight,
  googleOAuthEnabled,
}: {
  children: ReactNode;
  registrationPreflight: RegisterPreflight;
  googleOAuthEnabled: boolean;
}) {
  return (
    <AuthModalProvider
      registrationPreflight={registrationPreflight}
      googleOAuthEnabled={googleOAuthEnabled}
    >
      {children}
      <AuthModalDialog />
    </AuthModalProvider>
  );
}
