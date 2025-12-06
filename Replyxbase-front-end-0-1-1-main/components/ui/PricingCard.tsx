"use client";
import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Button from "./Button";

interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  highlight?: boolean;
  glow?: boolean;
  ctaText?: string;
  onCtaClick?: () => void;
}

const PricingCard: React.FC<PricingCardProps> = ({
  name,
  price,
  period = "/month",
  description,
  features,
  highlight = false,
  ctaText = "Get Started",
  onCtaClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`relative h-full ${highlight ? "scale-105 z-10" : ""}`}
    >
      <div
        className={`
          h-full p-8 rounded-2xl border-2 flex flex-col
          transition-all duration-300
          ${
            highlight
              ? "bg-[#005bbc] text-white border-[#005bbc]"
              : "bg-white text-slate-900 border-slate-200 hover:border-[#005bbc]/20"
          }
        `}
      >
        {highlight && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#ffd600] text-[#005bbc] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border-2 border-[#ffd600]">
            Most Popular
          </div>
        )}
        
        <div className="mb-6">
          <h3 className={`text-2xl font-bold mb-3 ${highlight ? "text-white" : "text-slate-900"}`}>
            {name}
          </h3>
          <div className="flex items-baseline gap-1 mb-3">
            <span className="text-5xl font-bold tracking-tight">{price}</span>
            <span className={`text-lg ${highlight ? "text-white/80" : "text-slate-500"}`}>
              {period}
            </span>
          </div>
          <p className={`text-base ${highlight ? "text-white/80" : "text-slate-600"}`}>
            {description}
          </p>
        </div>
        
        <div className={`h-px mb-6 ${highlight ? "bg-white/30" : "bg-slate-200"}`} />
        
        <ul className="space-y-4 mb-8 flex-1">
          {features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3 text-base">
              <div
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 border-2
                  ${
                    highlight
                      ? "bg-white/20 border-white/30"
                      : "bg-[#005bbc]/10 border-[#005bbc]/20"
                  }
                `}
              >
                <Check
                  className={`w-3.5 h-3.5 ${highlight ? "text-white" : "text-[#005bbc]"}`}
                />
              </div>
              <span className={highlight ? "text-white/90" : "text-slate-700"}>
                {feature}
              </span>
            </li>
          ))}
        </ul>
        
        <Button
          variant={highlight ? "secondary" : "outline"}
          className={`w-full ${highlight ? "bg-[#ffd600] text-[#005bbc] hover:bg-[#ffd600]/90" : ""}`}
          onClick={onCtaClick}
        >
          {ctaText}
        </Button>
      </div>
    </motion.div>
  );
};

export default PricingCard;


