import React from "react";

interface SectionSkeletonProps {
  className?: string;
  height?: string;
}

const SectionSkeleton = ({ className = "", height = "h-96" }: SectionSkeletonProps) => {
  return (
    <div className={`w-full ${height} bg-slate-50/50 flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-4 w-full max-w-3xl px-6">
        <div className="h-8 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full w-1/3 mb-4 animate-shimmer bg-[length:200%_100%]"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full w-2/3 animate-shimmer bg-[length:200%_100%]"></div>
        <div className="h-4 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-full w-1/2 animate-shimmer bg-[length:200%_100%]"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mt-12">
            <div className="h-64 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 rounded-2xl animate-shimmer bg-[length:200%_100%]"></div>
            <div className="h-64 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 rounded-2xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.2s' }}></div>
            <div className="h-64 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 rounded-2xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default SectionSkeleton;
