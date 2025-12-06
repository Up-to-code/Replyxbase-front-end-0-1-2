"use client";
import React from "react";
import { useTranslations } from "next-intl";

const TrustedBy = () => {
    const t = useTranslations("Landing.TrustedBy");
    const companies = [
        "Siemens", "Notion", "Salesforce", "Google", "Atlassian", 
        "Microsoft", "Amazon", "Meta", "Apple", "Netflix"
    ];

    return (
        <section className="py-12 bg-white" aria-label={t("title")}>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative w-full overflow-hidden" dir="ltr">
                    <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-white via-white to-transparent z-10 pointer-events-none" />
                    <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-white via-white to-transparent z-10 pointer-events-none" />
                    
                    <div className="flex w-max animate-marquee">
                        {[...Array(2)].map((_, i) => (
                            <div key={i} className="flex items-center gap-16 mx-8">
                                {companies.map((company, index) => (
                                    <div 
                                        key={`${i}-${index}`} 
                                        className="flex items-center gap-3 opacity-40 hover:opacity-100 transition-opacity cursor-pointer group"
                                    >
                                        <span className="text-lg font-bold text-slate-700 group-hover:text-[#005bbc] transition-colors">{company}</span>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustedBy;
