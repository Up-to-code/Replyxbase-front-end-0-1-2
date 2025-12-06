import React, { HTMLAttributes, forwardRef, ReactNode, useState } from "react";

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  children: ReactNode;
}

const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, side = "top", children, className = "", ...props }, ref) => {
    const [isVisible, setIsVisible] = useState(false);

    const positions = {
      top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
      bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
      left: "right-full top-1/2 -translate-y-1/2 mr-2",
      right: "left-full top-1/2 -translate-y-1/2 ml-2",
    };

    const arrows = {
      top: "top-full left-1/2 -translate-x-1/2 border-t-slate-900",
      bottom: "bottom-full left-1/2 -translate-x-1/2 border-b-slate-900",
      left: "left-full top-1/2 -translate-y-1/2 border-l-slate-900",
      right: "right-full top-1/2 -translate-y-1/2 border-r-slate-900",
    };

    return (
      <div
        ref={ref}
        className={`relative inline-block ${className}`}
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        {...props}
      >
        {children}
        {isVisible && (
          <div
            className={`absolute z-50 ${positions[side]} px-3 py-1.5 text-xs font-medium text-white bg-slate-900 rounded-lg whitespace-nowrap pointer-events-none`}
          >
            {content}
            <div
              className={`absolute w-0 h-0 border-4 border-transparent ${arrows[side]}`}
            />
          </div>
        )}
      </div>
    );
  }
);

Tooltip.displayName = "Tooltip";

export { Tooltip };

