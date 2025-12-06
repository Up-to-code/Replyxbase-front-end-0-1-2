"use client";
import React from "react";
import { useTranslations } from "next-intl";
import { Star, Quote } from "lucide-react";

const TestimonialsSection = () => {
  const t = useTranslations("Landing.Testimonials");

  const testimonials = [
    {
      quote: t("testimonial1.quote"),
      author: t("testimonial1.author"),
      role: t("testimonial1.role"),
      company: t("testimonial1.company"),
      rating: 5
    },
    {
      quote: t("testimonial2.quote"),
      author: t("testimonial2.author"),
      role: t("testimonial2.role"),
      company: t("testimonial2.company"),
      rating: 5
    },
    {
      quote: t("testimonial3.quote"),
      author: t("testimonial3.author"),
      role: t("testimonial3.role"),
      company: t("testimonial3.company"),
      rating: 5
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-slate-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
              {t("title")}
            </h2>
            <p className="text-lg text-slate-600 mb-6">
              {t("subtitle")}
            </p>
            <div className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-700">
              <span>{t("customers")}</span>
              <span className="text-slate-400">•</span>
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-[#ffd600] text-[#ffd600]" aria-hidden="true" />
                ))}
              </div>
              <span>{t("reviews")}</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <Quote className="w-8 h-8 text-[#005bbc]/20" aria-hidden="true" />
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 fill-[#ffd600] text-[#ffd600]" aria-hidden="true" />
                    ))}
                  </div>
                </div>
                <p className="text-base text-slate-700 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t-2 border-slate-200">
                  <div className="w-12 h-12 rounded-xl bg-[#005bbc]/10 flex items-center justify-center border-2 border-[#005bbc]/20">
                    <div className="w-6 h-6 bg-[#005bbc] rounded-lg" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-slate-900">{testimonial.author}</div>
                    <div className="text-xs text-slate-600">{testimonial.role}, {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
