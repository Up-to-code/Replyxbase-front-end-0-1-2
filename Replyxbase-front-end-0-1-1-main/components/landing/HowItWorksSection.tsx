"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Bot, CheckCircle2, TrendingUp, Users, BarChart3, ArrowRight } from "lucide-react";

const HowItWorksSection = () => {
  const t = useTranslations("Landing.HowItWorks");

  const steps = [
    {
      icon: Bot,
      title: t("step1.title"),
      desc: t("step1.desc"),
      number: "01",
      color: "bg-[#005bbc]/10",
      borderColor: "border-[#005bbc]/20",
      iconColor: "text-[#005bbc]"
    },
    {
      icon: CheckCircle2,
      title: t("step2.title"),
      desc: t("step2.desc"),
      number: "02",
      color: "bg-[#ffd600]/10",
      borderColor: "border-[#ffd600]/20",
      iconColor: "text-[#ffd600]"
    },
    {
      icon: TrendingUp,
      title: t("step3.title"),
      desc: t("step3.desc"),
      number: "03",
      color: "bg-[#005bbc]/10",
      borderColor: "border-[#005bbc]/20",
      iconColor: "text-[#005bbc]"
    },
    {
      icon: Users,
      title: t("step4.title"),
      desc: t("step4.desc"),
      number: "04",
      color: "bg-[#ffd600]/10",
      borderColor: "border-[#ffd600]/20",
      iconColor: "text-[#ffd600]"
    },
    {
      icon: BarChart3,
      title: t("step5.title"),
      desc: t("step5.desc"),
      number: "05",
      color: "bg-[#005bbc]/10",
      borderColor: "border-[#005bbc]/20",
      iconColor: "text-[#005bbc]"
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#005bbc_1px,transparent_1px),linear-gradient(to_bottom,#005bbc_1px,transparent_1px)] bg-[size:3rem_3rem]" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {t("title")}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="relative">
            <div className="hidden lg:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#005bbc]/20 to-transparent" />
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
              {steps.map((step, idx) => (
                <div
                  key={idx}
                  className="relative p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all group"
                >
                  <div className="absolute -top-4 -left-4 w-12 h-12 rounded-2xl bg-[#005bbc] text-white flex items-center justify-center text-sm font-bold border-2 border-white group-hover:scale-110 transition-transform">
                    {step.number}
                  </div>
                  
                  <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mb-4 border-2 ${step.borderColor} group-hover:scale-110 transition-transform mt-2`}>
                    <step.icon className={`w-8 h-8 ${step.iconColor}`} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{step.desc}</p>
                  
                  {idx < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-1/2 -right-3 translate-y-[-50%] z-10">
                      <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center border-2 border-slate-200">
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
