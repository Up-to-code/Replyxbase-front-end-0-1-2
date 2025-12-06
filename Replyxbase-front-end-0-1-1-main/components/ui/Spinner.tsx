import React, { HTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ size = "md", className = "", ...props }, ref) => {
    const sizes = {
      sm: "w-5 h-5",
      md: "w-7 h-7",
      lg: "w-10 h-10",
    };

    return (
      <div
        ref={ref}
        className={`inline-flex items-center justify-center ${className}`}
        {...props}
      >
        <div className="relative">
          <Loader2 className={`${sizes[size]} animate-spin text-[#005bbc]`} />
          <div className={`absolute inset-0 ${sizes[size]} animate-spin text-[#005bbc]/20`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
      </div>
    );
  }
);

Spinner.displayName = "Spinner";

export { Spinner };

