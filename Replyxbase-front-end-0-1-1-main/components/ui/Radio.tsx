import React, { InputHTMLAttributes, forwardRef } from "react";

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ className = "", label, checked, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="radio"
            className="sr-only"
            checked={checked}
            {...props}
          />
          <div className={`w-5 h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
            checked 
              ? "border-[#005bbc]" 
              : "border-slate-200 bg-slate-50 group-hover:border-[#005bbc]/50"
          }`}>
            <div className={`w-2.5 h-2.5 rounded-full bg-[#005bbc] transition-opacity ${
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

Radio.displayName = "Radio";

export { Radio };

