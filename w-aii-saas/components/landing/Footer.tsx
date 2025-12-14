'use client';

import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="border-t border-white/5 py-12 bg-black relative z-10">
      <div className="container mx-auto px-6 mb-12 text-right">
         <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">نحن لا نبني برمجيات فقط،</h2>
         <p className="text-xl text-emerald-400">نحن نبني أدوات تساعد الأعمال على النمو</p>
      </div>
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6 border-t border-white/5 pt-8">
         <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <div className="text-sm text-gray-500 font-medium">
              © 2024 اتجاه التقنية. جميع الحقوق محفوظة.
            </div>
         </div>
         
         <div className="flex gap-8 text-sm text-gray-400">
           <Link href="#" className="hover:text-emerald-400 transition-colors relative group">
             سياسة الخصوصية
             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
           </Link>
           <Link href="#" className="hover:text-emerald-400 transition-colors relative group">
             الشروط والأحكام
             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
           </Link>
           <Link href="#" className="hover:text-emerald-400 transition-colors relative group">
             تويتر
             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
           </Link>
           <Link href="#" className="hover:text-emerald-400 transition-colors relative group">
             لينكد إن
             <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-emerald-500 transition-all group-hover:w-full"></span>
           </Link>
         </div>
      </div>
    </footer>
  );
};
