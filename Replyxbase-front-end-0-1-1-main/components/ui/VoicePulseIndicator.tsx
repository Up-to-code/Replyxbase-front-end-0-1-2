"use client";
import React from "react";
import { motion } from "framer-motion";

interface VoicePulseIndicatorProps {
  active?: boolean;
  size?: "sm" | "md" | "lg";
}

const VoicePulseIndicator: React.FC<VoicePulseIndicatorProps> = ({
  active = false,
  size = "md",
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };
  
  return (
    <div className="relative flex items-center justify-center">
      <motion.div
        className={`
          ${sizeClasses[size]} rounded-full
          ${active ? "bg-[#1D75FF]" : "bg-[#CBD5E1]"}
        `}
        animate={active ? {
          scale: [1, 1.5, 1],
          opacity: [1, 0.5, 1],
        } : {}}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      {active && (
        <motion.div
          className={`absolute ${sizeClasses[size]} rounded-full bg-[#1D75FF]`}
          animate={{
            scale: [1, 2, 2],
            opacity: [0.5, 0, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
      )}
    </div>
  );
};

export default VoicePulseIndicator;


