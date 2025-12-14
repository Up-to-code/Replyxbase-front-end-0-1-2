'use client';

import React from 'react';

export const Background = () => {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505] overflow-hidden">
        {/* Deep Atmospheric Glows */}
      <div className="absolute top-[-20%] right-[-10%] w-[800px] h-[800px] bg-emerald-500/10 blur-[120px] rounded-full animate-pulse-slow mix-blend-screen" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 blur-[100px] rounded-full animate-pulse-slow delay-1000 mix-blend-screen" />
      <div className="absolute top-[40%] left-[20%] w-[400px] h-[400px] bg-white/5 blur-[80px] rounded-full animate-pulse-slow delay-500" />
      
      {/* Perspective Grid Floor */}
      <div className="absolute inset-0 perspective-[1000px]">
          <div className="absolute inset-0 transform rotate-x-[60deg] scale-150 origin-top">
             <div className="w-full h-[200%] absolute top-[-50%] left-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:linear-gradient(to_top,rgba(0,0,0,0)_0%,rgba(0,0,0,1)_40%,rgba(0,0,0,0)_80%)] animate-grid-flow" />
          </div>
      </div>

       {/* Floating Particles (Static CSS) */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.05),transparent_70%)]" />
    </div>
  );
};
