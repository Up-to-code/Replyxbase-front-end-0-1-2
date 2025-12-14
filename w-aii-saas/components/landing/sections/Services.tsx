'use client';

import React from 'react';
import { Reveal } from '@/components/landing/Reveal';
import { GlassCard } from '@/components/landing/GlassCard';

export const Services = () => {
  return (
    <section id="services" className="container mx-auto px-6 max-w-7xl mb-32 relative z-10">
      <div className="text-right mb-16">
        <Reveal>
          <div className="inline-block mb-4">
             <span className="text-emerald-400 font-mono text-sm tracking-wider uppercase">/// ماذا_نبني</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">برمجيات ذكية للمستقبل</h2>
          <p className="text-gray-400 text-xl max-w-2xl ml-auto mr-0 font-light leading-relaxed">
            نطوّر أدوات تقنية متخصصة تعالج مشاكل حقيقية تواجه المشاريع الصغيرة وتدعم نموها.
          </p>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        <Reveal delay={0.1}>
            <GlassCard
                title="برمجيات صغيرة ذكية"
                description="حلول متخصصة لإدارة العمليات، التواصل مع العملاء، وتنظيم البيانات بكفاءة عالية."
                image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2426&auto=format&fit=crop"
                category="Smart Micro-SaaS"
                className="h-full border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.1)]"
            />
        </Reveal>
        <Reveal delay={0.2}>
            <GlassCard
                title="حلول تعتمد على AI"
                description="نستخدم الذكاء الاصطناعي لجعل الأعمال أسرع في الاستجابة، أدق في التحليل، وأذكى في القرار."
                image="https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2532&auto=format&fit=crop"
                category="AI Solutions"
                className="h-full border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.1)]"
            />
        </Reveal>
        <Reveal delay={0.3}>
            <GlassCard
                title="أدوات للنمو"
                description="كل منتج نطوّره هدفه الأساسي هو مساعدة المشروع على النمو بثبات دون الحاجة لفرق تقنية كبيرة."
                image="https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2670&auto=format&fit=crop"
                category="Growth Tools"
                className="h-full border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(16,185,129,0.1)]"
            />
        </Reveal>
      </div>
    </section>
  );
};
