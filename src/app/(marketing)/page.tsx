import { Suspense } from "react";
import { HomeFaqSection } from "@/components/marketing/home-faq-section";
import { HomeFeaturesSection } from "@/components/marketing/home-features-section";
import { HomeHowItWorksSection } from "@/components/marketing/home-how-it-works-section";
import { HomeOfferSection } from "@/components/marketing/home-offer-section";
import { HomeToolDemoSection } from "@/components/marketing/home-tool-demo-section";
import { HomeWeddingSitesSection } from "@/components/marketing/home-wedding-sites-section";
import { MarketingHero } from "@/components/marketing/marketing-hero";
import { MarketingPreFooterCta } from "@/components/marketing/marketing-pre-footer-cta";
import { HomeContactSection } from "@/components/marketing/home-contact-section";

function OfferSectionFallback() {
  return (
    <div className="relative mx-auto min-h-[520px] max-w-[1500px] animate-pulse px-4 py-16 sm:px-8">
      <div className="absolute inset-0 bg-[#f6f1ea]" aria-hidden />
      <div className="relative mx-auto h-8 max-w-xl rounded-full bg-[#eae2d6]" />
      <div className="relative mx-auto mt-10 h-12 max-w-xl rounded-xl bg-[#e5ddd2]" />
      <div className="relative mx-auto mt-6 h-28 max-w-xl rounded-xl bg-[#e8dfd3]" />
      <div className="relative mx-auto mt-14 flex gap-6 overflow-hidden">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-[520px] min-w-[16rem] flex-1 rounded-3xl border border-[#e0d3c6] bg-[#f1e9df]" />
        ))}
      </div>
    </div>
  );
}

const SECTION_A = "bg-[#f7f1e7]"; // lekko beżowy
export default function HomePage() {
  return (
    <main className="relative">
      <MarketingHero />

      <section
        id="funkcje"
        className={`wa-marketing-section scroll-mt-wa border-b border-[#e1d2bc]/70 ${SECTION_A}`}
        aria-label="Sekcja funkcji Weddingassistant"
      >
        <HomeFeaturesSection />
      </section>

      <HomeHowItWorksSection />

      <HomeToolDemoSection />

      <HomeWeddingSitesSection />

      <section
        id="oferta"
        className="wa-marketing-section scroll-mt-wa overflow-hidden border-b border-[rgba(212,176,122,0.22)] bg-transparent"
        aria-label="Oferta i cennik"
      >
        <Suspense fallback={<OfferSectionFallback />}>
          <HomeOfferSection />
        </Suspense>
      </section>

      <HomeContactSection />

      <HomeFaqSection />

      <MarketingPreFooterCta />
    </main>
  );
}
