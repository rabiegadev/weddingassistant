import type { ReactNode } from "react";
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
      <div className="flex min-h-full flex-1 flex-col">
        <SiteHeader />
        <div className="pt-[var(--wa-sticky-offset)]">{children}</div>
        <SiteFooter />
      </div>
    </MarketingAuthWrapper>
  );
}
