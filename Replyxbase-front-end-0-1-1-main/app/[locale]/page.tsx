import React, { Suspense } from "react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/landing/hero/HeroSection";
import FeatureInbox from "@/components/landing/features/FeatureInbox";
import FeatureAgents from "@/components/landing/features/FeatureAgents";
import FeatureCRM from "@/components/landing/features/FeatureCRM";
import FeatureAnalytics from "@/components/landing/features/FeatureAnalytics";
import IntegrationsSection from "@/components/landing/IntegrationsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import SecuritySection from "@/components/landing/SecuritySection";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import PricingSection from "@/components/landing/PricingSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";
import ChatWidget from "@/components/landing/ChatWidget";
import Header from "@/components/landing/Header";
import SectionSkeleton from "@/components/ui/SectionSkeleton";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Landing" });

  return {
    title: t("Metadata.title"),
    description: t("Metadata.description"),
    openGraph: {
      title: t("Metadata.title"),
      description: t("Metadata.description"),
      type: "website",
      url: "https://replyxbase.com",
      images: [
        {
          url: "/assets/dashboard_hero.png",
          width: 1200,
          height: 630,
          alt: t("Metadata.title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("Metadata.title"),
      description: t("Metadata.description"),
      images: ["/assets/dashboard_hero.png"],
    },
  };
}

export default async function LandingPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Landing" });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Replyxbase",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": t("Metadata.description"),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "1250"
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden text-slate-900 selection:bg-[#005bbc]/20 selection:text-[#005bbc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Header />
      
      <main className="relative">
        {/* Hero Section */}
        <HeroSection session={null} /> 
        
        {/* Features Section */}
        <div id="features" className="scroll-mt-20">
          <FeatureInbox />
          <FeatureAgents />
          <FeatureCRM />
          <FeatureAnalytics />
        </div>
        
        {/* How It Works */}
        <HowItWorksSection />
        
        {/* Integrations */}
        <IntegrationsSection />
        
        {/* Social Proof */}
        <TestimonialsSection />
        
        {/* Security */}
        <SecuritySection />
        
        {/* Pricing */}
        <div id="pricing" className="scroll-mt-20">
          <PricingSection 
            starterPriceId={process.env.POLAR_PRODUCT_STARTER_ID || ""}
            proPriceId={process.env.POLAR_PRODUCT_PRO_ID || ""}
            enterprisePriceId={process.env.POLAR_PRODUCT_ENTERPRISE_ID || ""}
          />
        </div>
        
        {/* CTA Section */}
        <Suspense fallback={<SectionSkeleton height="h-[400px]" />}>
          <CTASection />
        </Suspense>
      </main>
      
      {/* Footer */}
      <Suspense fallback={<SectionSkeleton height="h-[400px]" />}>
        <Footer />
      </Suspense>
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  );
}
