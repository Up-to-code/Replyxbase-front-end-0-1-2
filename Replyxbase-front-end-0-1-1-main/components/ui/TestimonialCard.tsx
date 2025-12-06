"use client";
import React from "react";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  quote: string;
  author: string;
  role: string;
  company: string;
  rating?: number;
  delay?: number;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  author,
  role,
  company,
  rating = 5,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-[#005bbc]/20 transition-all duration-300 h-full"
    >
      <div className="flex items-start justify-between mb-4">
        <Quote className="w-8 h-8 text-[#005bbc]/20" />
        <div className="flex gap-0.5">
          {Array.from({ length: rating }).map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-[#ffd600] text-[#ffd600]" />
          ))}
        </div>
      </div>
      
      <p className="text-base text-slate-700 mb-6 leading-relaxed">
        "{quote}"
      </p>
      
      <div className="flex items-center gap-3 pt-4 border-t-2 border-slate-200">
        <div className="w-12 h-12 rounded-xl bg-[#005bbc]/10 flex items-center justify-center border-2 border-[#005bbc]/20">
          <div className="w-6 h-6 bg-[#005bbc] rounded-lg" />
        </div>
        <div>
          <div className="text-sm font-bold text-slate-900">{author}</div>
          <div className="text-xs text-slate-600">
            {role}, {company}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;


