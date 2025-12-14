'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { Reveal } from '@/components/landing/Reveal';
import { SpotlightCard } from '@/components/landing/SpotlightCard';

export const Testimonials = () => {
  return (
    <section id="testimonials" className="relative py-32 bg-black overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -translate-y-1/2" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[100px] translate-y-1/2" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="mb-20 text-right">
          <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-md">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                   <span className="text-emerald-400 font-mono text-xs tracking-wider uppercase">شركاء النجاح</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white leading-tight">
                قصص نجاح <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">نعتز بها</span>
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl ml-auto mr-0 font-light leading-relaxed">
                نحن لا نبني مشاريع فقط، بل نبني علاقات مستدامة تساعد شركائنا على النمو والازدهار في العصر الرقمي.
              </p>
          </Reveal>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            { text: "أدوات اتجاه التقنية ساعدتنا على تنظيم عملنا والنمو بدون تعقيد تقني.", author: "محمد العتيبي", role: "مؤسس متجر إلكتروني" },
            { text: "حلول بسيطة لكنها مؤثرة، وفّرت علينا وقتًا وجهدًا كبيرين.", author: "سارة الأحمد", role: "مديرة عمليات" },
            { text: "منتجات مبنية بفهم حقيقي لاحتياجات المشاريع الصغيرة.", author: "فهد الدوسري", role: "رائد أعمال" }
          ].map((t, i) => (
            <Reveal key={i} delay={i * 0.2}>
              <SpotlightCard className="p-8 rounded-3xl flex flex-col justify-between h-full bg-white/[0.03] border-white/10 hover:border-emerald-500/30 transition-all group">
                  <div className="mb-8">
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex gap-1">
                            {[1,2,3,4,5].map(s => <Star key={s} className="h-4 w-4 fill-emerald-500 text-emerald-500" />)}
                        </div>
                        <Quote className="h-8 w-8 text-white/10 group-hover:text-emerald-500/20 transition-colors" />
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg font-light">"{t.text}"</p>
                  </div>
                  
                  <div className="flex items-center gap-4 pt-6 border-t border-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-black font-bold text-lg">
                        {t.author.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-white text-base">{t.author}</div>
                        <div className="text-sm text-gray-500">{t.role}</div>
                    </div>
                  </div>
              </SpotlightCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
