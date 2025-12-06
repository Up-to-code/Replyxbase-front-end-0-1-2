"use client";
import React from "react";
import { BarChart3, TrendingUp, Clock, CheckCircle2, Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";

const ChartComponent = dynamic(
  () => import('./FeatureAnalyticsChart'),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-xl border-2 border-slate-200">
        <div className="w-6 h-6 border-2 border-[#005bbc] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
);

const FeatureAnalytics = () => {
  const t = useTranslations("Landing.Features.Analytics");

  const stats = [
    { 
      icon: Clock, 
      label: t("Mock.responseTime"), 
      value: "1m 42s", 
      bg: "bg-[#005bbc]/10", 
      color: "text-[#005bbc]", 
      border: "border-[#005bbc]/20",
      trend: "+12%"
    },
    { 
      icon: CheckCircle2, 
      label: t("Mock.csatScore"), 
      value: "4.9/5", 
      bg: "bg-[#ffd600]/10", 
      color: "text-[#ffd600]", 
      border: "border-[#ffd600]/20",
      trend: "+5%"
    },
    { 
      icon: TrendingUp, 
      label: t("Mock.resolutionRate"), 
      value: "94%", 
      bg: "bg-slate-50", 
      color: "text-slate-600", 
      border: "border-slate-200",
      trend: "+8%"
    }
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="relative">
            <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 hover:border-slate-300 transition-all">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{t("Mock.performanceOverview")}</h3>
                  <p className="text-sm text-slate-500">{t("Mock.last7Days")}</p>
                </div>
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
              </div>

              <div className="h-64 w-full mb-6 bg-slate-50 rounded-xl border-2 border-slate-200 p-4">
                <ChartComponent />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {stats.map((stat, index) => (
                  <div key={index} className="p-4 rounded-xl bg-slate-50 border-2 border-slate-200 hover:border-slate-300 transition-all">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 border-2 ${stat.border} ${stat.bg}`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <p className="text-xs text-slate-400 font-medium mb-1">{stat.label}</p>
                    <div className="flex items-baseline gap-1.5">
                      <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                      <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5">
                        <Zap className="w-3 h-3" />
                        {stat.trend}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005bbc]/10 text-[#005bbc] text-sm font-semibold mb-6 border-2 border-[#005bbc]/20">
              <BarChart3 className="w-4 h-4" />
              {t("badge")}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t("title")}
            </h2>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
              {t("description")}
            </p>
            
            <div className="space-y-4">
              <div className="p-5 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 transition-all">
                <h4 className="text-xl font-bold text-slate-900 mb-2">{t("feature1Title")}</h4>
                <p className="text-slate-500 leading-relaxed">{t("feature1Desc")}</p>
              </div>
              <div className="p-5 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 transition-all">
                <h4 className="text-xl font-bold text-slate-900 mb-2">{t("feature2Title")}</h4>
                <p className="text-slate-500 leading-relaxed">{t("feature2Desc")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureAnalytics;
