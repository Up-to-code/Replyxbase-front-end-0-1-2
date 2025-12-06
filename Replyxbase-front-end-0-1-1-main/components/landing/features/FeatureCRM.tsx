"use client";
import React from "react";
import { Users, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

const FeatureCRM = () => {
  const t = useTranslations("Landing.Features.CRM");

  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005bbc]/10 text-[#005bbc] text-sm font-semibold mb-6 border-2 border-[#005bbc]/20">
              <Users className="w-4 h-4" />
              {t("badge")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t("title")}
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              {t("description")}
            </p>
            
            <div className="space-y-4">
              {[
                { icon: CheckCircle2, text: t("feature1Title"), desc: t("feature1Desc") },
                { icon: CheckCircle2, text: t("feature2Title"), desc: t("feature2Desc") }
              ].map((feature, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                    <feature.icon className="w-3.5 h-3.5 text-[#005bbc]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 mb-1">{feature.text}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 max-w-md mx-auto relative hover:border-slate-300 transition-all">
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[#005bbc]/10 flex items-center justify-center border-2 border-[#005bbc]/20">
                    <Users className="w-8 h-8 text-[#005bbc]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{t("Mock.name")}</h3>
                    <p className="text-sm text-slate-500">{t("Mock.activeDeal")}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#005bbc]/10 flex items-center justify-center border-2 border-[#005bbc]/20">
                    <div className="w-4 h-4 bg-[#005bbc] rounded" />
                  </div>
                  <span className="text-slate-600">contact@example.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600 p-3 rounded-xl bg-slate-50 border-2 border-slate-200">
                  <div className="w-8 h-8 rounded-lg bg-[#ffd600]/10 flex items-center justify-center border-2 border-[#ffd600]/20">
                    <div className="w-4 h-4 bg-[#ffd600] rounded" />
                  </div>
                  <span className="text-slate-600">+1 (555) 000-0000</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 rounded-full bg-[#005bbc]/10 text-[#005bbc] text-xs font-semibold border-2 border-[#005bbc]/20">{t("Mock.vip")}</span>
                <span className="px-3 py-1.5 rounded-full bg-[#ffd600]/10 text-[#005bbc] text-xs font-semibold border-2 border-[#ffd600]/20">{t("Mock.activeDeal")}</span>
                <span className="px-3 py-1.5 rounded-full bg-slate-50 text-slate-600 text-xs font-semibold border-2 border-slate-200">{t("Mock.enterprise")}</span>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4">{t("Mock.recentActivity")}</h4>
                <div className="space-y-3">
                  <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                      <Calendar className="w-4 h-4 text-[#005bbc]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t("Mock.demoCall")}</p>
                      <p className="text-xs text-slate-500">{t("Mock.tomorrow2pm")}</p>
                    </div>
                  </div>
                  <div className="flex gap-3 p-3 rounded-xl bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all">
                    <div className="w-9 h-9 rounded-xl bg-[#ffd600]/10 flex items-center justify-center shrink-0 border-2 border-[#ffd600]/20">
                      <Clock className="w-4 h-4 text-[#ffd600]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{t("Mock.invoiceSent")}</p>
                      <p className="text-xs text-slate-500">{t("Mock.twoHoursAgo")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureCRM;
