'use client';

import React from 'react';
import Link from 'next/link';

interface NavbarProps {
    user: any;
    signOutAction: () => Promise<void>;
}

export const Navbar = ({ user, signOutAction }: NavbarProps) => {
  return (
    <nav className="fixed top-0 w-full z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto glass rounded-2xl px-6 py-4 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-white glow-text">اتجاه التقنية</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <Link href="#about" className="hover:text-white hover:scale-105 transition-all">عن الشركة</Link>
          <Link href="#services" className="hover:text-white hover:scale-105 transition-all">خدماتنا</Link>
          <Link href="#team" className="hover:text-white hover:scale-105 transition-all">فريق العمل</Link>
          <Link href="#vision" className="hover:text-white hover:scale-105 transition-all">الرؤية</Link>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
             <form action={signOutAction}>
             <button type="submit" className="text-sm font-medium hover:text-white text-gray-400 transition-colors">
               تسجيل الخروج
             </button>
           </form>
          ) : (
            <Link href="/auth/signup" className="text-sm font-medium bg-white text-black px-4 py-2 rounded-lg hover:bg-emerald-50 hover:shadow-[0_0_15px_rgba(255,255,255,0.4)] transition-all">
              ابدأ رحلتك
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
