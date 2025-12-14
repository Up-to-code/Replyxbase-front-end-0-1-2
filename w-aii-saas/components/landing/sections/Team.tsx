import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowLeft } from 'lucide-react';
import { Reveal } from '@/components/landing/Reveal';
import { TeamCard } from '@/components/landing/TeamCard';
import { SpotlightCard } from '@/components/landing/SpotlightCard';

export const Team = () => {
  return (
    <section id="team" className="container mx-auto px-6 max-w-7xl mb-32 relative z-10">
      <div className="text-right mb-20">
        <Reveal>
          <div className="inline-block mb-4">
             <span className="text-emerald-400 font-mono text-sm tracking-wider uppercase">/// TEAM</span>
          </div>
          <h2 className="text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">فريقنا</h2>
          <p className="text-gray-400 text-lg max-w-2xl ml-auto mr-0">خبراء يجمعهم الشغف بالتقنية والنجاح، يعملون يداً بيد لتحقيق رؤيتكم.</p>
        </Reveal>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto items-start">
         {/* Ahmed Profile */}
         <Reveal delay={0.2}>
            <TeamCard 
                name="أحمد"
                role="الشريك المؤسس & CTO"
                image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
                description="مسؤول عن الرؤية التقنية، بناء الأنظمة، وهندسة المنتجات الذكية. يركّز على تحويل الأفكار التقنية إلى أدوات عملية تخدم النمو الحقيقي للأعمال."
            />
         </Reveal>

         {/* Abdelmonem Profile */}
         <Reveal delay={0.3}>
            <TeamCard 
                name="عبد المنعم"
                role="الشريك المؤسس - التسويق"
                image="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop"
                description="مسؤول عن التسويق، نمو المنتجات، وبناء تجربة مستخدم قوية. يركّز على فهم السوق، احتياجات العملاء، وربط التقنية بالقيمة التجارية."
            />
         </Reveal>
      </div>
    </section>
  );
};
