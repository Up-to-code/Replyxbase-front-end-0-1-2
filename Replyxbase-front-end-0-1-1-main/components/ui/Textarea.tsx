import React, { TextareaHTMLAttributes, forwardRef } from "react";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = "", error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={`
          flex min-h-[80px] w-full rounded-xl border-2 bg-slate-50 px-4 py-3 text-sm text-slate-900
          placeholder:text-slate-400
          focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20 focus:bg-white
          disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200 resize-y
          ${error ? "border-red-500 focus:border-red-500 focus:ring-red-200" : "border-slate-200 focus:border-[#005bbc]"}
          ${className}
        `}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };

