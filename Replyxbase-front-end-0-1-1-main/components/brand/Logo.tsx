"use client";
import React from "react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-2xl",
    md: "w-16 h-16 text-3xl",
    lg: "w-24 h-24 text-5xl"
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        relative
        bg-[#0F172A]
        rounded-[20px]
        flex items-center justify-center
        border-2 border-[#005bbc]/20
        ${className}
      `}
    >
      {/* R without glow effects */}
      <span
        className="
          relative z-10
          font-bold
          text-[#ffd600]
          tracking-tight
        "
      >
        R
      </span>
    </div>
  );
};

export default Logo;

