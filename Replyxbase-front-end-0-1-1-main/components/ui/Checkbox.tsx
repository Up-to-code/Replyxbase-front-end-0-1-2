import React, { InputHTMLAttributes, forwardRef } from "react";
import { Check } from "lucide-react";

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, checked, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only"
            checked={checked}
            {...props}
          />
          <div className={`w-5 h-5 rounded-lg border-2 transition-all duration-200 flex items-center justify-center ${
            checked 
              ? "bg-[#005bbc] border-[#005bbc]" 
              : "bg-slate-50 border-slate-200 group-hover:border-[#005bbc]/50"
          }`}>
            <Check className={`w-3.5 h-3.5 text-white transition-opacity ${
              checked ? "opacity-100" : "opacity-0"
            }`} />
          </div>
        </div>
        {label && (
          <span className="text-sm text-slate-700 group-hover:text-slate-900 transition-colors">
            {label}
          </span>
        )}
      </label>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };

