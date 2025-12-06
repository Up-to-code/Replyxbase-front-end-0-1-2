import React, { HTMLAttributes, forwardRef } from "react";

export interface SeparatorProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const Separator = forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className = "", orientation = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={`shrink-0 bg-gray-200 ${
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"
        } ${className}`}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };
