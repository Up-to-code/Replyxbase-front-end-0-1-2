"use client";
import React from "react";
import { MessageSquare, Check, Bell } from "lucide-react";
import { useTranslations } from "next-intl";

const FeatureInbox = () => {
  const t = useTranslations("Landing.Features.Inbox");

  const messages = [
    { channel: t("messages.msg1.sender"), time: "10:42 AM", preview: t("messages.msg1.text"), unread: true },
    { channel: t("messages.msg2.sender"), time: "10:38 AM", preview: t("messages.msg2.text"), unread: false },
    { channel: t("messages.msg3.sender"), time: "10:35 AM", preview: t("messages.msg3.text"), unread: true }
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005bbc]/10 text-[#005bbc] text-sm font-semibold mb-6 border-2 border-[#005bbc]/20">
              <MessageSquare className="w-4 h-4" />
              {t("badge")}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
              {t("title")}
            </h2>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              {t("description")}
            </p>
            
            <ul className="space-y-4">
              {[1, 2, 3].map((item) => (
                <li key={item} className="flex items-start gap-3 p-4 rounded-xl bg-white border-2 border-slate-200 hover:border-slate-300 transition-all">
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-[#005bbc]/10 flex items-center justify-center shrink-0 border-2 border-[#005bbc]/20">
                    <Check className="w-3.5 h-3.5 text-[#005bbc]" />
                  </div>
                  <span className="text-lg text-slate-700 font-medium">{t(`benefit${item}`)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden hover:border-slate-300 transition-all">
              <div className="h-12 bg-slate-50 border-b-2 border-slate-200 flex items-center justify-between px-4">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">{t("Mock.headerTitle")}</span>
                </div>
              </div>
              
              <div className="p-5 space-y-3">
                <div className="flex items-center gap-3 mb-4 pb-4 border-b-2 border-slate-200">
                  <div className="w-12 h-12 bg-[#005bbc] rounded-xl flex items-center justify-center text-white font-bold border-2 border-[#005bbc]">
                    R
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{t("Mock.statusTitle")}</div>
                    <div className="text-xs text-slate-500">{t("Mock.statusOnline")}</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {messages.map((msg, i) => (
                    <div 
                      key={i} 
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        msg.unread 
                          ? 'bg-[#005bbc]/5 border-[#005bbc]/20 hover:border-[#005bbc]/30' 
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="text-sm font-semibold text-slate-900">{msg.channel}</div>
                          {msg.unread && (
                            <div className="w-2 h-2 bg-[#005bbc] rounded-full" />
                          )}
                        </div>
                        <div className="text-xs text-slate-400">{msg.time}</div>
                      </div>
                      <div className="text-sm text-slate-600">{msg.preview}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FeatureInbox;
