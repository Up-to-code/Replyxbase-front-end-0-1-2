"use client";
import React from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { MessageSquare, Users, BarChart3, Settings, Sparkles } from "lucide-react";

const HeroVisual = () => {
  const t = useTranslations("Landing.Hero.Mock");

  return (

    <div className="relative w-full aspect-[16/9] select-none">
      {/* Main Dashboard Frame */}
      <div className="absolute inset-0 bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-none z-10">
        {/* Mock Sidebar */}
        <div className="absolute left-0 top-0 bottom-0 w-64 bg-slate-50 border-r-2 border-slate-200 p-6 hidden md:flex flex-col gap-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#005bbc]" />
            <div className="h-4 w-24 bg-slate-200 rounded-md" />
          </div>
          <div className="space-y-2">
            {[MessageSquare, Users, BarChart3, Settings].map((Icon, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${i === 0 ? 'bg-white border-2 border-slate-200 text-[#005bbc]' : 'text-slate-500'}`}>
                <Icon className="w-5 h-5" />
                <div className={`h-3 rounded-md ${i === 0 ? 'w-20 bg-slate-200' : 'w-16 bg-slate-200/50'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Mock Header */}
        <div className="absolute top-0 left-0 md:left-64 right-0 h-20 bg-white border-b-2 border-slate-200 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
              <div className="h-4 w-32 bg-slate-100 rounded-md" />
          </div>
          <div className="flex items-center gap-4">
              <div className="relative">
                  <div className="w-10 h-10 rounded-full border-2 border-slate-100" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-[#ffd600] rounded-full border-2 border-white" />
              </div>
              <div className="w-10 h-10 rounded-full bg-[#005bbc] text-white flex items-center justify-center font-bold">A</div>
          </div>
        </div>

        {/* Mock Content - Chat Interface */}
        <div className="absolute top-20 left-0 md:left-64 right-0 bottom-0 bg-slate-50/50 p-8 flex gap-6">
          {/* Chat List */}
          <div className="w-80 bg-white rounded-2xl border-2 border-slate-200 hidden lg:block overflow-hidden">
              <div className="p-4 border-b-2 border-slate-100">
                  <div className="h-4 w-20 bg-slate-100 rounded-md" />
              </div>
              {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border-b-2 border-slate-50 flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100" />
                      <div className="space-y-2">
                          <div className="h-3 w-24 bg-slate-100 rounded-md" />
                          <div className="h-2 w-32 bg-slate-50 rounded-md" />
                      </div>
                  </div>
              ))}
          </div>

          {/* Active Chat */}
          <div className="flex-1 bg-white rounded-2xl border-2 border-[#005bbc]/20 flex flex-col overflow-hidden relative shadow-sm">
              {/* Floating Elements Animation */}
              <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10"
              >
                  <div className="w-16 h-16 bg-[#005bbc]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-[#005bbc]/20">
                      <Sparkles className="w-8 h-8 text-[#005bbc]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{t("title")}</h3>
                  <p className="text-slate-500 max-w-xs mx-auto">{t("subtitle")}</p>
              </motion.div>

              {/* Simulated Chat Bubbles */}
              <div className="p-6 space-y-6 mt-auto mb-20 opacity-30 blur-[1px]">
                   <div className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-100" />
                      <div className="bg-slate-100 rounded-2xl rounded-tl-none p-4 w-64 h-16" />
                   </div>
                   <div className="flex gap-4 flex-row-reverse">
                      <div className="w-8 h-8 rounded-full bg-[#005bbc]" />
                      <div className="bg-[#005bbc]/10 border-2 border-[#005bbc]/20 rounded-2xl rounded-tr-none p-4 w-64 h-24" />
                   </div>
              </div>
          </div>
        </div>
      </div>

      {/* Floating SaaS Cards - Outside Main Frame */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute -right-4 top-20 bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xl shadow-slate-200/50 hidden lg:block z-20 max-w-[200px]"
      >
        <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-green-600" />
            </div>
            <div>
                <p className="text-xs font-bold text-slate-900">New Lead Captured</p>
                <p className="text-[10px] text-slate-500 mt-1">Sarah from TechCorp just started a chat</p>
            </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute -left-4 bottom-20 bg-white p-4 rounded-2xl border-2 border-slate-100 shadow-xl shadow-slate-200/50 hidden lg:block z-20"
      >
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#005bbc]/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-[#005bbc]" />
            </div>
            <div>
                <p className="text-xs text-slate-500">Response Time</p>
                <p className="text-sm font-bold text-slate-900 flex items-center gap-1">
                    0.8s 
                    <span className="text-[10px] text-green-500 bg-green-50 px-1.5 py-0.5 rounded-full">+12%</span>
                </p>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroVisual;
