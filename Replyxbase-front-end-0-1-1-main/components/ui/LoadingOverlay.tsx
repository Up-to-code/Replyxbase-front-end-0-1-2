"use client";

import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ 
  message = "Loading...", 
  fullScreen = false 
}) => {
  return (
    <div 
      className={`bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center ${
        fullScreen ? "fixed inset-0" : "absolute inset-0 rounded-xl"
      }`}
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <Loader2 className="w-10 h-10 animate-spin text-[#005bbc]" />
          <div className="absolute inset-0 w-10 h-10 animate-spin text-[#005bbc]/20" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        {message && (
          <p className="text-sm font-semibold text-slate-700 animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

