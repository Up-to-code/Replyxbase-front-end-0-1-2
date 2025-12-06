export default function SettingsLoading() {
  return (
    <div className="animate-fade-in space-y-8">
      {/* Title Skeleton */}
      <div className="mb-10">
        <div className="h-8 w-64 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg animate-shimmer bg-[length:200%_100%] mb-3" />
        <div className="h-5 w-96 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-lg animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: '0.2s' }} />
      </div>

      {/* Form Skeleton */}
      <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-5 w-32 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 rounded animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: `${i * 0.1}s` }} />
            <div className="h-14 bg-gradient-to-r from-slate-50 via-slate-100 to-slate-50 border-2 border-slate-200 rounded-xl animate-shimmer bg-[length:200%_100%]" style={{ animationDelay: `${i * 0.1 + 0.1}s` }} />
          </div>
        ))}
      </div>

      {/* Action Button Skeleton */}
      <div className="pt-8 border-t-2 border-slate-200">
        <div className="h-12 w-40 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded-xl animate-shimmer bg-[length:200%_100%]" />
      </div>
    </div>
  );
}

