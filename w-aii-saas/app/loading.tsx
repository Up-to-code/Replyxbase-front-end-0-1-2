export default function Loading() {
  console.log('[Loading] System initializing...')
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-black text-white font-mono z-[100]">
      <div className="flex flex-col items-center gap-6">
        <div className="relative h-16 w-16">
          <div className="absolute inset-0 rounded-full border-2 border-white/10"></div>
          <div className="absolute inset-0 rounded-full border-t-2 border-emerald-500 animate-[spin_1s_linear_infinite]"></div>
          <div className="absolute inset-4 rounded-full border-2 border-white/10"></div>
          <div className="absolute inset-4 rounded-full border-b-2 border-emerald-500 animate-[spin_1.5s_linear_infinite_reverse]"></div>
        </div>
        <div className="flex flex-col items-center gap-1">
          <div className="text-sm tracking-[0.2em] text-emerald-500 animate-pulse font-bold">
            SYSTEM_INITIALIZING
          </div>
          <div className="text-[10px] text-gray-500 tracking-widest">
            ESTABLISHING_SECURE_LINK
          </div>
        </div>
      </div>
    </div>
  )
}

