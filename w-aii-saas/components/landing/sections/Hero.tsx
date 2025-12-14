'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronDown, ArrowRight, Play } from 'lucide-react';
import { Reveal } from '@/components/landing/Reveal';
import { CardFlipWords } from '@/components/landing/CardFlipWords';

export const Hero = () => {
  const words = ["خطوة ذكية", "تقنية بسيطة", "أثر فوري", "قرار صائب", "تجربة مختلفة"];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-32">
      
      {/* Dynamic 3D Grid Background */}
      <div className="absolute inset-0 preserve-3d">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:4rem_4rem] [transform:perspective(1000px)_rotateX(60deg)] origin-[50%_0%] h-[200%] pointer-events-none" />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent pointer-events-none" />
         <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.15),transparent_50%)]" />
      </div>

      <div className="container mx-auto px-6 text-center relative z-20 flex flex-col items-center justify-center">
        <Reveal width="100%">
          
          {/* Animated Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)] hover:border-emerald-500/30 hover:bg-white/10 transition-all duration-300 cursor-default mb-10 group">
             <span className="relative flex h-2.5 w-2.5">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 box-shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
             </span>
             <span className="text-sm font-medium text-emerald-100/90 tracking-wide group-hover:text-white transition-colors">
                رؤيتنا / النمو / التقنية
             </span>
          </div>
          
          <h1 className="flex flex-col items-center justify-center gap-6 mb-10 relative z-10 perspective-text">
             <span className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight drop-shadow-2xl leading-tight">
               نموك، يبدأ بـ
             </span>
             
             <div className="relative mt-2">
                 <div className="absolute inset-0 bg-emerald-500/30 blur-[60px] rounded-full animate-pulse-slow mix-blend-screen" />
                 <CardFlipWords words={words} className="text-5xl md:text-8xl lg:text-9xl" />
             </div>
          </h1>

          <div className="max-w-4xl mx-auto space-y-6 mb-14">
            <p className="text-xl md:text-2xl text-gray-300/90 leading-relaxed font-light tracking-wide">
              برمجيات ذكية، صُممت لتنمو معك بلا تعقيد.
            </p>
            <p className="text-lg md:text-xl text-emerald-400/80 font-medium">
              نبتكر التقنية التي تخدمك، لا ترهقك.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
            
            <Link href="/auth/signup" className="group relative px-8 py-4 bg-white text-black rounded-xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(255,255,255,0.5)] transition-all hover:scale-105 hover:shadow-[0_0_60px_-10px_rgba(255,255,255,0.7)] overflow-hidden">
               <span className="relative z-10 flex items-center gap-2">
                  ابدأ رحلتك مجاناً <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-emerald-100 via-white to-cyan-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
            
            <Link href="#demo" className="group relative px-8 py-4 bg-white/5 text-white rounded-xl font-medium text-lg border border-white/10 hover:bg-white/10 backdrop-blur-sm transition-all hover:scale-105 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 group-hover:bg-white/20 transition-colors">
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
              </span>
              شاهد العرض التجريبي
            </Link>

          </div>
        </Reveal>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-30 animate-bounce-slow">
         <span className="text-[10px] uppercase tracking-[0.3em] text-white/70 font-light">تصفح المزيد</span>
         <ChevronDown className="w-5 h-5 text-white" />
      </div>
    </section>
  );
};
