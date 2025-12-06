"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Globe, MessageCircle, Database, ArrowRight, Zap, Plug } from "lucide-react";

const IntegrationsSection = () => {
  const t = useTranslations("Landing.Integrations");
  const tCommon = useTranslations("Common");

  const integrations = [
    {
      icon: Globe,
      name: "Website",
      desc: t("website.desc"),
      color: "bg-[#005bbc]/10",
      borderColor: "border-[#005bbc]/20",
      iconColor: "text-[#005bbc]",
      stats: t("stats.website")
    },
    {
      icon: MessageCircle,
      name: "WhatsApp",
      desc: t("whatsapp.desc"),
      color: "bg-[#ffd600]/10",
      borderColor: "border-[#ffd600]/20",
      iconColor: "text-[#ffd600]",
      stats: t("stats.whatsapp")
    },
    {
      icon: Database,
      name: "CRM",
      desc: t("crm.desc"),
      color: "bg-[#005bbc]/10",
      borderColor: "border-[#005bbc]/20",
      iconColor: "text-[#005bbc]",
      stats: t("stats.crm")
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#005bbc_1px,transparent_1px),linear-gradient(to_bottom,#005bbc_1px,transparent_1px)] bg-[size:4rem_4rem]" />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005bbc]/10 text-[#005bbc] text-sm font-semibold mb-6 border-2 border-[#005bbc]/20">
              <Zap className="w-4 h-4" />
              <span>{tCommon("integrations")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {t("title")}
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              {t("description")}
            </p>
          </div>

          <div className="mb-12 p-8 bg-gradient-to-r from-[#005bbc] to-[#004a9f] rounded-2xl border-2 border-[#005bbc] text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-10" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center border-2 border-white/30">
                  <Plug className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-1">{t("features.title")}</h3>
                  <p className="text-white/80">{t("features.description")}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="px-6 py-3 bg-white/10 rounded-xl border-2 border-white/20 backdrop-blur-sm">
                  <div className="text-3xl font-bold">200+</div>
                  <div className="text-xs text-white/80">{tCommon("integrations")}</div>
                </div>
                <div className="px-6 py-3 bg-white/10 rounded-xl border-2 border-white/20 backdrop-blur-sm">
                  <div className="text-3xl font-bold">{t("all")}</div>
                  <div className="text-xs text-white/80">{t("inOne")}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {integrations.map((integration, idx) => (
              <div
                key={idx}
                className="relative p-8 bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all group overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-[#005bbc]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="relative z-10">
                  <div className={`w-18 h-18 ${integration.color} rounded-2xl flex items-center justify-center mb-6 border-2 ${integration.borderColor} group-hover:scale-110 transition-transform`}>
                    <integration.icon className={`w-9 h-9 ${integration.iconColor}`} aria-hidden="true" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{integration.name}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4">{integration.desc}</p>
                  
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-semibold text-slate-500">{integration.stats}</span>
                  </div>
                  
                  <a 
                    href="#" 
                    className="text-sm font-semibold text-[#005bbc] hover:text-[#004a9f] transition-colors inline-flex items-center gap-2 group/link"
                  >
                    {t("learnMore")}
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" aria-hidden="true" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationsSection;
