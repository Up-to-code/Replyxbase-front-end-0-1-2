'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface GlassCardProps {
  title: string;
  description: string;
  image: string;
  category?: string;
  href?: string;
  className?: string;
}

export const GlassCard = ({ title, description, image, category, href, className }: GlassCardProps) => {
  return (
    <div className={cn("group relative overflow-hidden rounded-[2.5rem] bg-zinc-900/50 border border-white/5 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(16,185,129,0.15)]", className)}>
      <div className="relative z-10 p-8 flex flex-col h-full">
        {/* Header Content */}
        <div className="mb-6">
          {category && (
            <div className="inline-block px-3 py-1 bg-emerald-500/10 rounded-full text-xs font-mono text-emerald-300 border border-emerald-500/20 mb-4 backdrop-blur-md">
              {category}
            </div>
          )}
          <h3 className="text-2xl font-bold text-white mb-2 leading-tight group-hover:text-emerald-200 transition-colors">
            {title}
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-[95%] group-hover:text-gray-300 transition-colors">
            {description}
          </p>
        </div>

        {/* Circular Image Container */}
        <div className="mt-auto relative self-center w-full aspect-square max-w-[280px] my-4">
             {/* Glowing backing for image */}
             <div className="absolute inset-0 bg-emerald-500/20 blur-[60px] rounded-full scale-90 group-hover:scale-110 transition-transform duration-700" />
             
             {/* The Image Itself */}
             <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-white/5 group-hover:border-emerald-500/20 transition-colors shadow-2xl">
                <img 
                    src={image} 
                    alt={title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3"
                />
                
                {/* Overlay inside image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
             </div>
        </div>

        {/* Action Button (if href exists) */}
        {href && (
            <div className="absolute bottom-8 left-8 z-20">
                <Link href={href} className="flex items-center gap-2 text-white font-bold bg-white/5 hover:bg-emerald-500/20 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:border-emerald-500/30 transition-all group-hover:translate-x-1">
                    المزيد <ArrowLeft className="h-4 w-4" />
                </Link>
            </div>
        )}
      </div>

      {/* Decorative background elements */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/5 blur-[80px] rounded-full pointer-events-none" />
    </div>
  );
};
