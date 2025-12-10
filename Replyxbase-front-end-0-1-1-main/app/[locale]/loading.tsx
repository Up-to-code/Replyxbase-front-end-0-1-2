import React from "react";
import Logo from "@/components/brand/Logo";
import { Loader2 } from "lucide-react";
import * as motion from "framer-motion/client";

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-blue-50/50 to-transparent" />
        <div className="absolute bottom-0 w-full h-[40vh] bg-gradient-to-t from-slate-50 to-transparent" />
      </div>

      <div className="relative flex flex-col items-center z-10 p-8">
        {/* Logo Container */}
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
        >
          {/* Pulse Effect */}
          <div className="absolute inset-0 rounded-2xl bg-blue-100/50 animate-ping [animation-duration:2s]" />
          
          <div className="relative bg-white p-4 rounded-2xl shadow-xl shadow-blue-100 border border-blue-50">
            <Logo size="lg" className="relative z-10" />
          </div>
        </motion.div>
        
        {/* Loading Indicator */}
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-5 h-5 text-[#005bbc] animate-spin" />
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
             <h3 className="text-lg font-bold text-slate-900">Loading website...</h3>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
