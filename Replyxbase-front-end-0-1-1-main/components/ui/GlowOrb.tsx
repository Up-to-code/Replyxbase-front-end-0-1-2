"use client";
import React from "react";
import { motion } from "framer-motion";

interface GlowOrbProps {
  size?: "sm" | "md" | "lg" | "xl";
  color?: "blue" | "yellow" | "purple";
  position?: "absolute" | "fixed" | "relative";
  className?: string;
}

const GlowOrb: React.FC<GlowOrbProps> = ({
  size = "md",
  color = "blue",
  position = "absolute",
  className = "",
}) => {
  const sizeClasses = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
    xl: "w-[500px] h-[500px]",
  };
  
  const colorClasses = {
    blue: "bg-[#005bbc]/20",
    yellow: "bg-[#ffd600]/20",
    purple: "bg-purple-500/20",
  };
  
  return (
    <motion.div
      className={`${position} ${sizeClasses[size]} ${colorClasses[color]} rounded-full blur-3xl ${className}`}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      aria-hidden="true"
    />
  );
};

export default GlowOrb;


