"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Building, ShoppingBag, HeartPulse, Cpu, Banknote, MessageCircle, Send, Globe } from "lucide-react";

const Marquee = () => {
    const t = useTranslations("Landing.Marquee");
    
    const items = [
        { icon: MessageCircle, label: "whatsapp", color: "text-[#005bbc]" },
        { icon: Send, label: "telegram", color: "text-[#ffd600]" },
        { icon: Globe, label: "website", color: "text-[#005bbc]" },
        { icon: Building, label: "realEstate", color: "text-slate-600" },
        { icon: ShoppingBag, label: "ecommerce", color: "text-slate-600" },
        { icon: HeartPulse, label: "healthcare", color: "text-slate-600" },
        { icon: Cpu, label: "technology", color: "text-slate-600" },
        { icon: Banknote, label: "finance", color: "text-slate-600" },
    ];

    return (
        <div className="w-full py-12 bg-white border-b-2 border-slate-200 overflow-hidden relative" dir="ltr">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>
            
            <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
                {[...Array(10)].map((_, i) => (
                    <div key={i} className="flex items-center gap-16 mx-8">
                        {items.map((item, index) => (
                            <div key={index} className={`flex items-center gap-3 text-lg font-bold transition-all duration-300 hover:scale-110 cursor-default group ${item.color === 'text-slate-600' ? 'text-slate-600 hover:text-[#005bbc]' : item.color}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border-2 ${item.color === 'text-slate-600' ? 'bg-slate-50 group-hover:bg-white group-hover:border-[#005bbc]/20 border-slate-200' : 'bg-white border-slate-200 group-hover:border-[#005bbc]/20'} transition-all`}>
                                    <item.icon className={`w-6 h-6 ${item.color === 'text-slate-600' ? 'group-hover:text-[#005bbc]' : ''}`} />
                                </div>
                                <span>{t(item.label)}</span>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Marquee;
