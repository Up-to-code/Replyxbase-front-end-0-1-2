'use client';

import React from 'react';
import { Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface TeamCardProps {
  name: string;
  role: string;
  image: string;
  description?: string;
  className?: string;
}

export const TeamCard = ({ name, role, image, description, className }: TeamCardProps) => {
  return (
    <div className={`relative w-full max-w-sm mx-auto group ${className}`}>
      {/* Upper Image Section */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-t-[2rem]">
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>

      {/* Curved Divider & Icon */}
      <div className="relative -mt-10 z-10">
        <div className="absolute left-1/2 -translate-x-1/2 -top-6 flex items-center justify-center">
            {/* The SVG curve shape would be complex to act as a mask, so we use an overlay approach or a specific shaped div. 
                Simple approach for "bump": A circle with box-shadow or border matching background. 
                Reference image shows a clean cut. Let's try a shaped SVG at the top of the content box. */}
        </div>
        
        {/* SVG Separator */}
        <div className="absolute bottom-0 w-full text-zinc-900 leading-none translate-y-[1px]">
             <svg viewBox="0 0 100 20" preserveAspectRatio="none" className="w-full h-12 fill-zinc-900">
                 {/* This path needs to create the hump. 
                     M0 20: Start bottom left
                     L0 20: (Already there)
                     L0 10: Go up
                     C...: Curve up and down for the hump
                     L100 10: Go to right
                     L100 20: Go bottom right
                     Z: Close
                 */}
                 <path d="M0,20 L0,12 Q40,12 50,0 Q60,12 100,12 L100,20 Z" />
             </svg>
             {/* Icon positioned in the hump */}
             <div className="absolute top-[-1.5rem] left-1/2 -translate-x-1/2">
                <motion.div 
                    whileHover={{ scale: 1.1, rotate: 180 }}
                    className="w-12 h-12 rounded-full border-[3px] border-zinc-900 flex items-center justify-center bg-zinc-800/50 backdrop-blur-md text-white shadow-lg overflow-hidden group-hover:bg-emerald-500 group-hover:text-black transition-colors"
                >
                    <Share2 className="w-5 h-5" />
                </motion.div>
             </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-zinc-900 pt-2 pb-10 px-6 text-center rounded-b-[2rem] relative z-0">
        <h3 className="text-2xl font-bold text-white mb-2">{name}</h3>
        <p className="text-emerald-400 text-sm font-medium tracking-wider uppercase mb-4">{role}</p>
        
        {description && (
          <p className="text-gray-400 text-sm leading-relaxed font-light opacity-0 group-hover:opacity-100 transition-opacity duration-300 absolute inset-x-6 top-full bg-black/90 p-4 rounded-b-xl border border-white/10 -mt-2 pointer-events-none group-hover:pointer-events-auto shadow-xl z-20">
             {description}
          </p>
        )}
      </div>
    </div>
  );
};
