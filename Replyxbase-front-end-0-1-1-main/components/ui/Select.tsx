import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  options?: Array<{ value: string; label: string }>;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", error, options, children, ...props }, ref) => {
    // Extract width classes from className
    const widthMatch = className.match(/\bw-(?:auto|full|screen|\d+|\[.*?\])\b/);
    const hasWidth = widthMatch !== null;
    const baseClasses = className.split(/\s+/).filter(c => !c.startsWith('w-')).join(' ');
    
    return (
      <div className={`relative ${hasWidth ? '' : 'w-full'}`}>
        <select
          ref={ref}
          className={`
            flex h-10 rounded-xl border-2 bg-slate-50 px-4 py-2 pr-10 text-sm text-slate-900
            appearance-none cursor-pointer
            focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20 focus:bg-white
            disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200
            ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-slate-200 focus:border-[#005bbc]"}
            ${hasWidth ? className : 'w-full ' + baseClasses}
          `}
          {...props}
        >
          {options
            ? options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))
            : children}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };

