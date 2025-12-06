"use client";
import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  glow?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  glow = false,
  className = "",
  ...props
}) => {
  const baseClasses = "w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 focus:outline-none focus:ring-4";
  const stateClasses = error
    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20"
    : "border-slate-200 focus:border-[#005bbc] focus:ring-[#005bbc]/20 hover:border-[#005bbc]/20";
  const glowClasses = glow ? "shadow-lg shadow-[#005bbc]/10" : "";
  
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          {label}
        </label>
      )}
      <input
        className={`${baseClasses} ${stateClasses} ${glowClasses} ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-[#EF4444]">{error}</p>
      )}
    </div>
  );
};

export default Input;
export type { InputProps };
