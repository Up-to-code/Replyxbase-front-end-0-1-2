import React from "react";
import Logo from "@/components/brand/Logo";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-100 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Simple Brand Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-[#005bbc]/5 to-transparent" />
        <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-[#ffd600]/5 to-transparent" />
      </div>

      <div className="relative flex flex-col items-center z-10">
        {/* Brand Logo with Scaling Animation */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-[20px] bg-[#005bbc]/10 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="animate-[scale_1.5s_ease-in-out_infinite]">
            <Logo size="lg" className="relative z-10" />
          </div>
        </div>
        
        {/* Simple Text */}
        <div className="text-center">
          <div className="text-base font-bold text-[#005bbc] mb-1">
            Loading...
          </div>
          <div className="text-xs text-slate-500">
            Please wait
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scale {
          0%, 100% { 
            transform: scale(1);
            opacity: 1;
          }
          50% { 
            transform: scale(1.1);
            opacity: 0.9;
          }
        }
      `}</style>
    </div>
  );
}
