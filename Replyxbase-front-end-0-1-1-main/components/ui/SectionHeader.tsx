"use client";
import React from "react";
import GradientText from "./GradientText";

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  center?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  center = false,
  className = "",
}) => {
  return (
    <div className={`${center ? "text-center" : ""} ${className}`}>
      {badge && (
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#005bbc]/10 text-[#005bbc] text-sm font-semibold mb-6 border-2 border-[#005bbc]/20">
          {badge}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 mb-4">
        <GradientText gradient="blue">{title}</GradientText>
      </h2>
      {description && (
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
};

export default SectionHeader;


