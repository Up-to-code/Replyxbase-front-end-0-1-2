import React, { HTMLAttributes, forwardRef } from "react";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = "", src, alt, fallback, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-8 w-8 text-xs",
      md: "h-10 w-10 text-sm",
      lg: "h-12 w-12 text-base"
    };

    return (
      <div
        ref={ref}
        className={`relative flex shrink-0 overflow-hidden rounded-full border-2 border-slate-200 ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || "Avatar"}
            className="aspect-square h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-100 text-gray-600 font-medium">
            {fallback || "?"}
          </div>
        )}
      </div>
    );
  }
);

Avatar.displayName = "Avatar";

export { Avatar };
