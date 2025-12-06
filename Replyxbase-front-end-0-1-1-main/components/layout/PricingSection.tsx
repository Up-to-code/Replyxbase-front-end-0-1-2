"use client";
import React from "react";
import SectionHeader from "@/components/ui/SectionHeader";
import PricingCard from "@/components/ui/PricingCard";

const PricingSection: React.FC = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Perfect for getting started",
      features: [
        "1 AI Agent",
        "1,000 conversations/month",
        "Website integration",
        "Basic analytics",
        "Community support",
      ],
    },
    {
      name: "Starter",
      price: "$19",
      description: "For growing businesses",
      features: [
        "5 AI Agents",
        "10,000 conversations/month",
        "All integrations",
        "Advanced analytics",
        "Priority support",
        "Custom branding",
      ],
      highlight: true,
    },
    {
      name: "Pro",
      price: "$29",
      description: "For scaling teams",
      features: [
        "Unlimited Agents",
        "50,000 conversations/month",
        "Custom integrations",
        "Advanced CRM",
        "24/7 support",
        "White-label options",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: [
        "Unlimited everything",
        "Dedicated support",
        "Custom SLA",
        "On-premise deployment",
        "Advanced security",
        "Training & onboarding",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Pricing"
            title="Simple, transparent pricing"
            description="Choose the plan that fits your needs. All plans include a 14-day free trial."
            center
            className="mb-16"
          />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
            {plans.map((plan, index) => (
              <PricingCard
                key={index}
                name={plan.name}
                price={plan.price}
                description={plan.description}
                features={plan.features}
                highlight={plan.highlight}
                glow={plan.highlight}
                ctaText={plan.price === "Custom" ? "Contact Sales" : "Get Started"}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-slate-500 mb-3">
              All plans include a 14-day free trial. No credit card required.
            </p>
            <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
              <span>✓ Cancel anytime</span>
              <span>✓ No credit card required</span>
              <span>✓ 14-day money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;


