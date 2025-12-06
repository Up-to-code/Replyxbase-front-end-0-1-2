"use client";
import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  glow?: boolean;
  delay?: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  glow = false,
  delay = 0,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group"
    >
      <div
        className={`
          p-6 bg-white rounded-2xl border-2 border-slate-200
          hover:border-[#005bbc]/20
          transition-all duration-300 h-full
        `}
      >
        <div className="w-14 h-14 rounded-xl bg-[#005bbc]/10 flex items-center justify-center mb-4 border-2 border-[#005bbc]/20 group-hover:scale-110 transition-transform">
          <Icon className="w-7 h-7 text-[#005bbc]" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default FeatureCard;


