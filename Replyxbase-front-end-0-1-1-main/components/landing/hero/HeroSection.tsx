"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, Play } from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import HeroVisual from "./HeroVisual";
import TrustedBy from "../TrustedBy";

const HeroSection = React.memo(({ session: initialSession }: { session?: any }) => {
  const { data: session } = authClient.useSession();
  const t = useTranslations("Landing.Hero");

  return (
    <section className="relative pt-32 pb-12 overflow-hidden bg-white">
      {/* Background Gradients & Grid */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#005bbc]/10 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-20 right-0 w-[800px] h-[600px] bg-[#ffd600]/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto mb-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005bbc]/10 text-[#005bbc] text-sm font-medium mb-8 border border-[#005bbc]/20">
            <Sparkles className="w-4 h-4" />
            <span>{t("badge.text")}</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 mb-8 leading-[1.1]">
            {t("heading.line1")}
          </h1>

          {/* Description */}
          <p className="text-xl text-slate-600 leading-relaxed max-w-2xl mb-10">
            {t("description")}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href={session ? "/dashboard" : "/signup"}>
              <button className="h-14 px-8 text-lg font-semibold rounded-2xl bg-[#005bbc] text-white hover:bg-[#004a9f] transition-all flex items-center gap-2 border-2 border-[#005bbc] shadow-none">
                {t("cta.buildAgent")}
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <button className="h-14 px-8 text-lg font-semibold rounded-2xl bg-white text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 border-2 border-slate-200">
              <Play className="w-5 h-5 fill-current" />
              {t("cta.watchDemo.text")}
            </button>
          </div>
          
          <div className="mt-6 text-sm text-slate-500 font-medium">
            {t("cta.noCreditCard")}
          </div>
        </div>

        {/* Visual */}
        <div className="relative max-w-6xl mx-auto mb-20">
           <HeroVisual />
        </div>

        {/* Trusted By */}
        <TrustedBy />
      </div>
    </section>
  );
});

HeroSection.displayName = "HeroSection";
export default HeroSection;
