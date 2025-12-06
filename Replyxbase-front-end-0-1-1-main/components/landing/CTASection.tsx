import React from "react";
import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { ArrowRight, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const CTASection = async () => {
    const t = await getTranslations("Landing.CTA");
    const tCommon = await getTranslations("Common");
    
    const benefits = [
        "No credit card required",
        "14-day free trial",
        "Cancel anytime"
    ];
    
    return (
        <section className="py-24 lg:py-32 bg-gradient-to-b from-white via-slate-50/50 to-white relative overflow-hidden">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[700px] h-[700px] bg-[#005bbc]/5 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[700px] h-[700px] bg-[#ffd600]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>
            
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-3xl border-2 border-slate-200 p-12 lg:p-16 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-[#005bbc]/5 rounded-full blur-3xl" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#ffd600]/5 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 text-center">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005bbc]/10 text-[#005bbc] text-sm font-semibold mb-6 border-2 border-[#005bbc]/20">
                                <Sparkles className="w-4 h-4" />
                                <span>{t("badge")}</span>
                            </div>
                            
                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 tracking-tight leading-tight">
                                {t("title")}
                            </h2>
                            <p className="text-xl lg:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
                                {t("subtitle")}
                            </p>
                            
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
                                <Link href="/signup" className="group w-full sm:w-auto">
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="w-full sm:w-auto h-14 px-10 rounded-2xl text-base font-semibold bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] flex items-center justify-center gap-2 transition-all"
                                        aria-label={tCommon("getStarted")}
                                    >
                                        <span>{tCommon("getStarted")}</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Link href="/demo" className="w-full sm:w-auto">
                                    <Button 
                                        variant="outline" 
                                        size="lg"
                                        className="w-full sm:w-auto h-14 px-10 rounded-2xl text-base font-semibold border-2 border-slate-200 hover:border-[#005bbc] text-slate-700 hover:text-[#005bbc] transition-all"
                                        aria-label={tCommon("watchDemo")}
                                    >
                                        {tCommon("watchDemo")}
                                    </Button>
                                </Link>
                            </div>
                            
                            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#005bbc]" />
                                    <span>{t("noCreditCard")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#005bbc]" />
                                    <span>{t("freeTrial")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-[#005bbc]" />
                                    <span>{t("cancelAnytime")}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
