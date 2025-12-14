'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export const CardFlipWords = ({
  words,
  duration = 3000,
  className,
}: {
  words: string[];
  duration?: number;
  className?: string;
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length);
    }, duration);
    return () => clearInterval(timer);
  }, [duration, words.length]);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <motion.div
        layout
        transition={{ duration: 0.8, type: "spring", stiffness: 200, damping: 25 }}
        className="
            relative inline-flex items-center justify-center
            px-8 py-4 md:px-10 md:py-6 rounded-2xl
            bg-white/[0.03] border border-white/10 backdrop-blur-2xl
            shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
            overflow-hidden
            group
            min-w-[280px] md:min-w-[500px]
            w-full
        "
      >
        {/* Shiny Borders */}
        <div className="absolute inset-0 rounded-2xl p-[1px] bg-gradient-to-b from-white/20 via-white/5 to-transparent pointer-events-none" />
        
        {/* Internal Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 via-transparent to-cyan-500/10 opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={words[currentIndex]}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-100 to-emerald-300 font-extrabold whitespace-nowrap drop-shadow-lg pb-1 leading-normal"
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
