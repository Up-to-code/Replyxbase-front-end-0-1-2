"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Shield, Lock, Database } from "lucide-react";

const SecuritySection = () => {
  const t = useTranslations("Landing.Security");

  const features = [
    {
      icon: Database,
      title: t("dataOwnership.title"),
      desc: t("dataOwnership.desc"),
      color: "bg-[#005bbc]/10",
      borderColor: "border-[#005bbc]/20",
      iconColor: "text-[#005bbc]"
    },
    {
      icon: Lock,
      title: t("encryption.title"),
      desc: t("encryption.desc"),
      color: "bg-[#ffd600]/10",
      borderColor: "border-[#ffd600]/20",
      iconColor: "text-[#ffd600]"
    },
    {
      icon: Shield,
      title: t("integrations.title"),
      desc: t("integrations.desc"),
      color: "bg-[#005bbc]/10",
      borderColor: "border-[#005bbc]/20",
      iconColor: "text-[#005bbc]"
    },
  ];

  const badges = ["GDPR", "SOC 2", "ISO 27001"];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-6">
                {t("title")}
              </h2>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                {t("description")}
              </p>
              
              <div className="flex flex-wrap gap-3 mb-8">
                {badges.map((badge) => (
                  <div
                    key={badge}
                    className="px-5 py-2.5 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-slate-300 text-sm font-semibold text-slate-700 transition-all"
                  >
                    {badge}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-all group"
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 ${feature.color} rounded-xl flex items-center justify-center shrink-0 border-2 ${feature.borderColor} group-hover:scale-110 transition-transform`}>
                      <feature.icon className={`w-7 h-7 ${feature.iconColor}`} aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{feature.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecuritySection;
