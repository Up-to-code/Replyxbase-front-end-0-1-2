"use client";
import React from "react";
import { Bot, Zap, CheckCircle2, Activity } from "lucide-react";
import { useTranslations } from "next-intl";

const FeatureAgents = () => {
  const t = useTranslations("Landing.Features.Agents");

  const agents = [
    { 
      name: t("Mock.salesBot"), 
      role: t("Mock.leadGen"), 
      conv: "1,240", 
      status: "active",
      color: "primary"
    },
    { 
      name: t("Mock.supportHelper"), 
      role: t("Mock.customerService"), 
      conv: "2,100", 
      status: "active",
      color: "accent"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="space-y-6">
            {agents.map((agent, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border-2 border-slate-200 hover:border-slate-300 transition-all group"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center border-2 transition-transform group-hover:scale-110 ${
                      agent.color === 'primary' 
                        ? 'bg-[#005bbc]/10 border-[#005bbc]/20' 
                        : 'bg-[#ffd600]/10 border-[#ffd600]/20'
                    }`}>
                      <Bot className={`w-7 h-7 ${
                        agent.color === 'primary' ? 'text-[#005bbc]' : 'text-[#ffd600]'
                      }`} />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-slate-900">{agent.name}</h3>
                      <p className="text-sm text-slate-500">{agent.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 text-green-700 text-xs font-semibold border-2 border-green-100">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                    {t("Mock.active")}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 pt-5 border-t-2 border-slate-200">
                  <div className="p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                    <p className="text-xs text-slate-400 uppercase font-medium mb-1">{t("Mock.conversations")}</p>
                    <p className="text-xl font-bold text-slate-900">{agent.conv}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                    <p className="text-xs text-slate-400 uppercase font-medium mb-1">{t("Card.status")}</p>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-500" />
                      <p className="text-xl font-bold text-slate-900">{t("Card.live")}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ffd600]/10 text-[#005bbc] text-sm font-semibold mb-6 border-2 border-[#ffd600]/20">
              <Zap className="w-4 h-4" />
              {t("badge")}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t("title")}
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t("description")}
            </p>
            
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex gap-4 p-4 rounded-xl bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all">
                  <div className="mt-0.5 w-7 h-7 rounded-full bg-[#ffd600]/10 flex items-center justify-center shrink-0 border-2 border-[#ffd600]/20">
                    <CheckCircle2 className="w-4 h-4 text-[#ffd600]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1.5">{t(`feature${item}Title`)}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{t(`feature${item}Desc`)}</p>
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

export default FeatureAgents;
