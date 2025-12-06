"use client";
import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import GlowOrb from "@/components/ui/GlowOrb";
import GradientText from "@/components/ui/GradientText";

const HeroSection: React.FC = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white pt-20">
      {/* Background Glow Effects */}
      <GlowOrb size="xl" color="blue" className="top-20 left-10 opacity-30" />
      <GlowOrb size="lg" color="yellow" className="bottom-20 right-10 opacity-20" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16 lg:py-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005bbc]/10 text-[#005bbc] text-sm font-semibold border-2 border-[#005bbc]/20">
                <Sparkles className="w-4 h-4" />
                <span>AI-Powered Customer Experience</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                <span className="text-slate-900">AI agents for </span>
                <GradientText gradient="blue">magical</GradientText>
                <span className="text-slate-900"> customer experiences</span>
              </h1>

              <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed max-w-2xl">
                Replyxbase is the complete platform for building & deploying AI support agents for your business.
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-4 pt-4">
                <Button variant="primary" size="lg" glow>
                  Build Your Agent
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <p className="text-sm text-slate-500 font-medium pt-3">
                  No credit card required • 14-day free trial
                </p>
              </div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative bg-white rounded-2xl border-2 border-slate-200 p-8 shadow-[0_0_40px_rgba(0,91,188,0.15)]">
                {/* AI Chat Interface Mockup */}
                <div className="space-y-4">
                  <div className="h-12 bg-gradient-to-r from-[#005bbc] to-[#004a9f] rounded-xl flex items-center justify-between px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">AI Customer Support</div>
                        <div className="text-xs text-white/80">Answering questions automatically</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                      <span className="text-xs text-white/90 font-medium">Live</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3 p-4 bg-slate-50 rounded-xl">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005bbc] to-[#004a9f] flex items-center justify-center text-white text-xs font-bold">
                        C
                      </div>
                      <div className="flex-1">
                        <div className="bg-white p-3 rounded-2xl rounded-tl-none border-2 border-slate-200">
                          <p className="text-sm text-slate-700">I want to book a demo. Can you help?</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <div className="max-w-[80%]">
                        <div className="bg-[#005bbc] p-3 rounded-2xl rounded-tr-none flex items-start gap-2 border-2 border-[#005bbc]">
                          <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5" />
                          <p className="text-sm text-white">Great! I can help you book a demo. Available times: Today 2:00 PM • Tomorrow 10:00 AM</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;


