'use client';

import React from 'react';
import { Reveal } from '@/components/landing/Reveal';
import { Target, Zap, Rocket, Globe2, ShieldCheck } from 'lucide-react';

export const WhyUs = () => {
    const reasons = [
        { icon: <Rocket className="w-6 h-6 text-emerald-400" />, title: "منتجات مصممة للنمو" },
        { icon: <Target className="w-6 h-6 text-emerald-400" />, title: "تركيز كامل على المشاريع الصغيرة" },
        { icon: <Zap className="w-6 h-6 text-emerald-400" />, title: "استخدام عملي للذكاء الاصطناعي" },
        { icon: <Globe2 className="w-6 h-6 text-emerald-400" />, title: "فهم عميق للسوق السعودي" },
        { icon: <ShieldCheck className="w-6 h-6 text-emerald-400" />, title: "رؤية طويلة المدى، لا حلول مؤقتة" },
    ];

  return (
    <section id="why-us" className="container mx-auto px-6 max-w-7xl mb-32 relative z-10">
      <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 md:p-16 backdrop-blur-sm overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
        
        <Reveal width="100%">
            <div className="text-right mb-12">
                <div className="inline-block mb-4 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-mono">
                    /// لماذا_نحن
                </div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">لماذا اتجاه التقنية؟</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {reasons.map((reason, i) => (
                    <div key={i} className="flex items-center gap-4 bg-black/40 p-6 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all hover:bg-white/5 group">
                        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            {reason.icon}
                        </div>
                        <span className="font-bold text-lg text-gray-200">{reason.title}</span>
                    </div>
                ))}
            </div>
        </Reveal>
      </div>
    </section>
  );
};
