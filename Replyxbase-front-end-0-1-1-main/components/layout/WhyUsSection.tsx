"use client";
import React from "react";
import { CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";

const WhyUsSection: React.FC = () => {
  const benefits = [
    "Purpose-built for LLMs with reasoning capabilities",
    "Designed for simplicity - no technical skills required",
    "Engineered for security with robust encryption",
    "Complete platform - everything you need in one place",
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                badge="Why Replyxbase"
                title="Built for the future of customer support"
                className="mb-8"
              />
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                With Replyxbase, your customers can effortlessly find answers, resolve issues, and take meaningful actions through seamless AI-driven conversations.
              </p>
            </div>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border-2 border-slate-200 hover:border-[#005bbc]/20 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                    <CheckCircle2 className="w-4 h-4 text-[#005bbc]" />
                  </div>
                  <span className="text-slate-700 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;

