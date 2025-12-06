"use client";
import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import GlowOrb from "@/components/ui/GlowOrb";

const AIShowcaseSection: React.FC = () => {
  const stats = [
    { label: "Response Time", value: "< 1s", icon: Zap },
    { label: "Accuracy", value: "98%", icon: TrendingUp },
    { label: "Uptime", value: "99.9%", icon: Sparkles },
  ];

  return (
    <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-50 to-white relative overflow-hidden">
      <GlowOrb size="lg" color="blue" className="top-0 right-0 opacity-20" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeader
            badge="AI Showcase"
            title="See AI in action"
            description="Watch how our AI agents handle customer inquiries with speed and precision."
            center
            className="mb-16"
          />

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-[#005bbc]/20 hover:shadow-lg transition-all text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-[#005bbc]/10 flex items-center justify-center mx-auto mb-4 border-2 border-[#005bbc]/20">
                  <stat.icon className="w-7 h-7 text-[#005bbc]" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-[0_0_40px_rgba(0,91,188,0.15)]">
            <div className="aspect-video bg-gradient-to-br from-[#005bbc]/10 to-[#ffd600]/10 rounded-xl flex items-center justify-center border-2 border-slate-200">
              <div className="text-center">
                <Sparkles className="w-16 h-16 text-[#005bbc] mx-auto mb-4" />
                <p className="text-slate-600 font-medium">AI Agent Demo Video</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIShowcaseSection;


