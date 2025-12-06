import React, { HTMLAttributes, forwardRef, ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from "lucide-react";

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "success" | "warning" | "error" | "info";
  title?: string;
  onClose?: () => void;
  children: ReactNode;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ variant = "default", title, onClose, children, className = "", ...props }, ref) => {
    const variants = {
      default: "bg-slate-50 border-2 border-slate-200 text-slate-900",
      success: "bg-green-50 border-2 border-green-200 text-green-800",
      warning: "bg-[#ffd600]/10 border-2 border-[#ffd600]/20 text-[#ffd600]",
      error: "bg-red-50 border-2 border-red-200 text-red-800",
      info: "bg-[#005bbc]/10 border-2 border-[#005bbc]/20 text-[#005bbc]",
    };

    const icons = {
      default: AlertCircle,
      success: CheckCircle2,
      warning: AlertTriangle,
      error: AlertCircle,
      info: Info,
    };

    const Icon = icons[variant];

    return (
      <div
        ref={ref}
        className={`flex items-start gap-3 p-4 rounded-xl ${variants[variant]} ${className}`}
        {...props}
      >
        <Icon className="w-5 h-5 shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          {title && <h4 className="font-semibold mb-1">{title}</h4>}
          <div className="text-sm">{children}</div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-black/5 rounded-lg text-current/60 hover:text-current transition-colors shrink-0"
            aria-label="Close alert"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = "Alert";

export { Alert };

