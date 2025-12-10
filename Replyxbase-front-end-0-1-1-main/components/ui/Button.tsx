"use client";
import React from "react";
import { Loader2, LucideIcon } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg" | "icon";
  loading?: boolean;
  icon?: LucideIcon;
  glow?: boolean;
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  loading = false,
  icon: Icon,
  glow = false,
  children,
  className = "",
  disabled,
  ...props
}) => {
  const baseClasses = "font-medium rounded-xl transition-all duration-200 flex items-center justify-center gap-2 border-2 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-[#005bbc] text-white hover:bg-[#004a9f] border-[#005bbc] hover:border-[#004a9f] focus:ring-[#005bbc]/20",
    secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200 hover:border-slate-300 focus:ring-slate-200",
    outline: "bg-transparent text-[#005bbc] hover:bg-[#005bbc]/10 border-[#005bbc]/20 hover:border-[#005bbc] focus:ring-[#005bbc]/20",
    ghost: "bg-transparent text-slate-700 hover:bg-slate-50 border-transparent hover:border-slate-200 focus:ring-slate-200",
  };
  
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
    icon: "p-2",
  };

  const glowClasses = glow && variant === "primary" ? "shadow-lg shadow-[#005bbc]/25" : "";
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${glowClasses} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Button;
export { Button };
export type { ButtonProps };
