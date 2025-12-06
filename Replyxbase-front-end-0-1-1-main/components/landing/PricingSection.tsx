"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const PricingCard = ({
  name,
  price,
  description,
  features,
  highlight = false,
  tCommon,
  tPricing
}: {
  name: string;
  price: string;
  description: string;
  features: string[];
  highlight?: boolean;
  tCommon: any;
  tPricing: any;
}) => (
  <div className={`h-full p-8 rounded-2xl flex flex-col transition-all duration-300 relative border-2 ${highlight ? 'bg-[#005bbc] text-white border-[#005bbc] scale-105 z-10' : 'bg-white border-slate-200 text-slate-900 hover:border-slate-300'}`}>
        {highlight && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffd600] text-[#005bbc] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border-2 border-[#ffd600]">
                {tPricing("mostPopular")}
            </div>
        )}
        <div className="mb-6">
            <h3 className={`text-2xl font-bold mb-3 ${highlight ? 'text-white' : 'text-slate-900'}`}>{name}</h3>
            <div className="flex items-baseline gap-1 mb-3">
                <span className="text-5xl font-bold tracking-tight">{price}</span>
                <span className={`text-lg ${highlight ? 'text-white/80' : 'text-slate-500'}`}>/{tPricing("month")}</span>
            </div>
            <p className={`text-base ${highlight ? 'text-white/80' : 'text-slate-600'}`}>{description}</p>
        </div>
        
        <div className={`h-px mb-6 ${highlight ? 'bg-white/30' : 'bg-slate-200'}`} />
        
        <ul className="space-y-4 mb-8 flex-1">
            {features.map((f, i) => (
                <li key={i} className="flex items-start gap-3 text-base">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2 ${highlight ? 'bg-white/20 border-white/30' : 'bg-[#005bbc]/10 border-[#005bbc]/20'}`}>
                        <Check className={`w-3.5 h-3.5 ${highlight ? 'text-white' : 'text-[#005bbc]'}`} />
                    </div>
                    <span className={highlight ? 'text-white/90' : 'text-slate-700'}>{f}</span>
                </li>
            ))}
        </ul>
        <Link href="/signup" className="w-full">
          <Button 
              variant={highlight ? 'secondary' : 'outline'} 
              className={`w-full rounded-xl h-12 text-base font-semibold transition-all border-2 ${highlight ? 'bg-[#ffd600] text-[#005bbc] hover:bg-[#ffd600]/90 border-[#ffd600]' : 'border-slate-200 hover:border-[#005bbc] hover:bg-transparent text-slate-900 hover:text-[#005bbc]'}`}
          >
              {tCommon("getStarted")}
          </Button>
        </Link>
  </div>
);

export default function PricingSection() {
    const tCommon = useTranslations("Common");
    const tPricing = useTranslations("Landing.Pricing");

    const plans = [
        {
            name: tPricing("free"),
            price: "$0",
            description: tPricing("freeDesc"),
            features: [
                tPricing("features.1agent"),
                tPricing("features.1000conv"),
                tPricing("features.website"),
                tPricing("features.whatsapp"),
                tPricing("features.basicSupport")
            ]
        },
        {
            name: tPricing("starter"),
            price: "$19",
            description: tPricing("starterDesc"),
            features: [
                tPricing("features.5agents"),
                tPricing("features.10kconv"),
                tPricing("features.5members"),
                tPricing("features.allIntegrations"),
                tPricing("features.prioritySupport"),
                tPricing("features.advancedAnalytics")
            ],
            highlight: true
        },
        {
            name: tPricing("pro"),
            price: "$29",
            description: tPricing("proDesc"),
            features: [
                tPricing("features.unlimitedAgents"),
                tPricing("features.50kconv"),
                tPricing("features.unlimitedMembers"),
                tPricing("features.customIntegrations"),
                tPricing("features.support247"),
                tPricing("features.advancedCRM")
            ]
        },
        {
            name: tPricing("enterprise"),
            price: "$49",
            description: tPricing("enterpriseDesc"),
            features: [
                tPricing("features.unlimitedAgents"),
                tPricing("features.unlimitedConv"),
                tPricing("features.unlimitedMembers"),
                tPricing("features.whiteLabel"),
                tPricing("features.dedicatedSupport"),
                tPricing("features.customSLA")
            ]
        }
    ];

    return (
      <section id="pricing" className="py-20 lg:py-28 bg-slate-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{tPricing("title")}</h2>
            <p className="text-xl text-slate-600">{tPricing("subtitle")}</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {plans.map((plan, index) => (
                <PricingCard 
                    key={index}
                    name={plan.name}
                    price={plan.price}
                    description={plan.description}
                    features={plan.features}
                    highlight={plan.highlight}
                    tCommon={tCommon}
                    tPricing={tPricing}
                />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 mb-3">
              {tPricing("terms.text")} <a href="#" className="text-[#005bbc] hover:text-[#004a9f] underline">{tPricing("terms.viewTerms")}</a> {tPricing("terms.and")} <a href="#" className="text-[#005bbc] hover:text-[#004a9f] underline">{tPricing("terms.privacyPolicy")}</a>.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
              <span>✓ {tPricing("terms.noCreditCard")}</span>
              <span>✓ {tPricing("terms.cancelAnytime")}</span>
              <span>✓ {tPricing("terms.guarantee")}</span>
            </div>
          </div>
        </div>
      </section>
    );
}
