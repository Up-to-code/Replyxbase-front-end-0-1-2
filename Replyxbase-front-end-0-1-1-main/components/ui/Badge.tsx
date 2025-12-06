import React, { HTMLAttributes, forwardRef } from "react";

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning';
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = "", variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[#005bbc]/10 text-[#005bbc] border-2 border-[#005bbc]/20 hover:bg-[#005bbc]/20",
      secondary: "bg-slate-50 text-slate-700 border-2 border-slate-200 hover:bg-slate-100",
      outline: "text-slate-900 border-2 border-slate-200",
      destructive: "bg-red-50 text-red-600 border-2 border-red-200 hover:bg-red-100",
      success: "bg-green-50 text-green-600 border-2 border-green-200 hover:bg-green-100",
      warning: "bg-[#ffd600]/10 text-[#ffd600] border-2 border-[#ffd600]/20 hover:bg-[#ffd600]/20",
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20 ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
