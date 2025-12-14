'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { Reveal } from '@/components/landing/Reveal';

export const About = () => {
  return (
    <section id="about" className="container mx-auto px-6 max-w-7xl mb-32 pt-16">
      <div className="grid md:grid-cols-2 gap-16 items-center">
         <Reveal width="100%">
            <div className="inline-block px-4 py-1.5 bg-emerald-500/10 rounded-full text-sm font-mono text-emerald-400 border border-emerald-500/20 mb-6 backdrop-blur-md">
               /// من_نحن
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 leading-tight text-white">
                شركة تقنية ناشئة سعودية، تركّز على بناء <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">برمجيات ذكية</span> تساعد المشاريع الصغيرة على النمو.
            </h2>
            <div className="space-y-6 text-gray-300 font-light leading-relaxed text-right md:text-right">
               <p className="text-lg">
                   لسنا شركة برمجة تقليدية، ولا نقدّم خدمات تطوير مخصصة لكل عميل. نحن نبني منتجات تقنية صغيرة (Micro-SaaS) تُستخدم مباشرة داخل الأعمال لتحسين الأداء، الأتمتة، وإدارة العمليات اليومية.
               </p>
               <p className="text-lg">
                   رؤيتنا تنطلق من إيماننا بأن المستقبل للشركات التي تستخدم التقنية بذكاء، لا بتعقيد. ولهذا نعمل على تطوير أدوات واضحة، سهلة، وقابلة للتوسع، تتماشى مع نمو السوق السعودي والتحول الرقمي الذي تقوده رؤية 2030.
               </p>
            </div>
         </Reveal>
         <Reveal delay={0.2} width="100%">
            <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl glass-blue aspect-square flex items-center justify-center group">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
                <Sparkles className="w-48 h-48 text-emerald-400 opacity-20 animate-pulse group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
         </Reveal>
      </div>
    </section>
  );
};
