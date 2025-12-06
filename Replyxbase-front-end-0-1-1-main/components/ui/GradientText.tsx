"use client";
import React from "react";

interface GradientTextProps {
  children: React.ReactNode;
  gradient?: "blue" | "yellow" | "purple";
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  gradient = "blue",
  className = "",
}) => {
  const gradientClasses = {
    blue: "bg-gradient-to-r from-[#005bbc] to-[#004a9f]",
    yellow: "bg-gradient-to-r from-[#ffd600] to-[#e6c200]",
    purple: "bg-gradient-to-r from-purple-500 to-purple-700",
  };
  
  return (
    <span
      className={`${gradientClasses[gradient]} bg-clip-text text-transparent ${className}`}
    >
      {children}
    </span>
  );
};

export default GradientText;


