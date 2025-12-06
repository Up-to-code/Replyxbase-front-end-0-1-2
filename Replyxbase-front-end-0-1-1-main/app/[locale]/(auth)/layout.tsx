'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = useTranslations('Auth.Branding');
  
  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row">
      {/* Left Side - Branding/Image */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundColor: '#005bbc' }}
      >
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#005bbc] via-[#004a9f] to-[#003d8a] opacity-90" />
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between px-8 py-12 lg:px-12 lg:py-16 text-white w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="Replyxbase Logo" 
              width={48} 
              height={48}
              className="object-contain"
            />
            <span className="font-bold text-2xl tracking-tight">Replyxbase</span>
          </Link>

          {/* Center Content */}
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              {t('welcome')}
            </h1>
            <p className="text-lg text-white/80 max-w-md">
              {t('description')}
            </p>
          </div>

          {/* Footer */}
          <div className="text-sm text-white/60">
            &copy; {new Date().getFullYear()} Replyxbase Inc. All rights reserved.
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 xl:px-12">
        {/* Mobile Logo */}
        <div className="lg:hidden mb-8">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo.png" 
              alt="Replyxbase Logo" 
              width={40} 
              height={40}
              className="object-contain"
            />
            <span className="font-bold text-2xl text-slate-900 tracking-tight">Replyxbase</span>
          </Link>
        </div>

        {/* Form Content */}
        <div className="w-full max-w-md mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
