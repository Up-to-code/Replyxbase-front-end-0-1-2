"use client";
import React from "react";
import { motion } from "framer-motion";

interface CardProps {
  children: React.ReactNode;
  hover?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "primary" | "accent" | "gradient";
}

const Card: React.FC<CardProps> = ({
  children,
  hover = true,
  className = "",
  onClick,
  variant = "default",
}) => {
  const variantClasses = {
    default: "bg-white border-slate-200 hover:border-[#005bbc]/20",
    primary: "bg-[#005bbc]/10 border-[#005bbc]/20 hover:border-[#005bbc] hover:bg-[#005bbc]/15",
    accent: "bg-[#ffd600]/10 border-[#ffd600]/20 hover:border-[#ffd600] hover:bg-[#ffd600]/15",
    gradient: "bg-gradient-to-br from-[#005bbc]/10 to-[#ffd600]/10 border-[#005bbc]/20 hover:border-[#005bbc]",
  };
  
  const baseClasses = `rounded-2xl border-2 transition-all duration-300 ${variantClasses[variant]}`;
  const hoverClasses = hover ? "hover:border-[#005bbc]/40 cursor-pointer" : "";
  
  const Component = onClick ? motion.div : "div";
  const motionProps = onClick ? {
    whileHover: { scale: 1.02, y: -2 },
    whileTap: { scale: 0.98 },
    onClick,
  } : {};
  
  return (
    <Component
      className={`${baseClasses} ${hoverClasses} ${className}`}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex flex-col space-y-1.5 p-6 ${className}`}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={`p-6 pt-0 ${className}`} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={`flex items-center p-6 pt-0 ${className}`}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardContent };
export default Card;
