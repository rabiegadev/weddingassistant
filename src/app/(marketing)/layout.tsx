import type { ReactNode } from "react";
import { MarketingAmbientBackdrop } from "@/components/marketing/marketing-ambient-backdrop";
import { SiteFooter } from "@/components/marketing/site-footer";
import { SiteHeader } from "@/components/marketing/site-header";
import { MarketingAuthWrapper } from "@/components/auth/marketing-auth-wrapper";
import { getRegisterPreflight } from "@/lib/captcha/register-preflight";
import { isGoogleClientOAuthEnabled } from "@/lib/auth/google-config";

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const registrationPreflight = getRegisterPreflight();
  const googleOAuthEnabled = isGoogleClientOAuthEnabled();

  return (
    <MarketingAuthWrapper
      registrationPreflight={registrationPreflight}
      googleOAuthEnabled={googleOAuthEnabled}
    >
      <div className="relative flex w-full min-h-svh flex-col">
        <MarketingAmbientBackdrop />
        <SiteHeader />
        {/* Bez min-h-0 — inaczej flex-1 ściska slot do wysokości viewportu i treść scrolluje się WEWNĄTRZ wrapera (stopka „wpina się” pod ten slot zamiast na koniec strony). */}
        <div className="relative z-[1] flex w-full flex-1 flex-col pt-[var(--wa-sticky-offset)]">{children}</div>
        <SiteFooter />
      </div>
    </MarketingAuthWrapper>
  );
}
