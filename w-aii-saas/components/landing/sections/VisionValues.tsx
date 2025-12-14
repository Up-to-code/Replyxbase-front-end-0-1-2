'use client';

import React from 'react';
import { Reveal } from '@/components/landing/Reveal';
import { Check, Lightbulb, Users, BarChart3, TrendingUp, Zap } from 'lucide-react';

export const VisionValues = () => {
  return (
    <section className="container mx-auto px-6 max-w-7xl mb-32 space-y-32">
        {/* Vision Section */}
        <Reveal width="100%">
            <div className="relative rounded-[3rem] p-10 md:p-16 overflow-hidden border border-white/10 bg-gradient-to-br from-emerald-900/20 to-black backdrop-blur-md">
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                
                <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-mono">
                            /// رؤيتنا
                        </div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight text-white">
                            أن نصبح منصة تقنية رائدة تدعم <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">نمو المشاريع الصغيرة</span> في المملكة والعالم العربي.
                        </h2>
                        <p className="text-gray-300 text-lg leading-relaxed mb-8">
                            عبر برمجيات ذكية تُمكّن أصحاب الأعمال من التركيز على النمو بدل التفاصيل التشغيلية.
                        </p>
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                        <h3 className="text-xl font-bold text-white mb-6">نرى مستقبلًا تُدار فيه الأعمال:</h3>
                        <ul className="space-y-4">
                            {[
                                { text: "بقرارات مبنية على البيانات", icon: <BarChart3 className="w-5 h-5 text-emerald-400" /> },
                                { text: "بعمليات مؤتمتة وذكية", icon: <Zap className="w-5 h-5 text-emerald-400" /> },
                                { text: "بحلول تقنية بسيطة ولكن فعّالة", icon: <Lightbulb className="w-5 h-5 text-emerald-400" /> }
                            ].map((item, i) => (
                                <li key={i} className="flex items-center gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        {item.icon}
                                    </div>
                                    <span className="text-gray-200 font-medium">{item.text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Reveal>

        {/* How We Think Section */}
        <Reveal width="100%">
            <div className="text-right mb-16">
                 <h2 className="text-3xl md:text-5xl font-bold mb-6">كيف نفكر؟</h2>
                 <p className="text-gray-400 text-lg max-w-2xl ml-auto mr-0">فلسفتنا في بناء المنتجات تبدأ من فهم عميق للاحتياجات الحقيقية.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                 {[
                    { title: "التقنية أداة، لا عبئًا", desc: "نؤمن بأن التقنية وجدت لتسهل العمل، لا لتضيف تعقيدات جديدة." },
                    { title: "أفضل الحلول هي الأبسط", desc: "نسعى دائماً لتبسيط العمليات المعقدة إلى خطوات بديهية." },
                    { title: "النمو المستدام يبدأ بذكاء", desc: "الأنظمة الذكية هي الأساس الذي يُبنى عليه النجاح طويل المدى." },
                    { title: "قوة الكبار للصغار", desc: "المشاريع الصغيرة تستحق أدوات قوية ومتطورة مثل الشركات الكبرى." }
                 ].map((item, i) => (
                    <div key={i} className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-colors group text-right">
                        <Check className="w-8 h-8 text-emerald-500 mb-4 group-hover:scale-110 transition-transform" />
                        <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                        <p className="text-gray-400 font-light leading-relaxed">{item.desc}</p>
                    </div>
                 ))}
            </div>
        </Reveal>
    </section>
  );
};
