import React, { InputHTMLAttributes, forwardRef } from "react";

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = "", label, checked, ...props }, ref) => {
    return (
      <label className={`flex items-center gap-3 cursor-pointer group ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            role="switch"
            className="sr-only"
            checked={checked}
            {...props}
          />
          <div className={`w-11 h-6 rounded-full border-2 transition-all duration-200 ${
            checked 
              ? "bg-[#005bbc] border-[#005bbc]" 
              : "bg-slate-100 border-slate-200"
          }`}>
            <div className={`w-4 h-4 rounded-full bg-white border border-slate-200 translate-y-0.5 transition-transform duration-200 ${
              checked ? "translate-x-5" : "translate-x-0.5"
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

Switch.displayName = "Switch";

export { Switch };

