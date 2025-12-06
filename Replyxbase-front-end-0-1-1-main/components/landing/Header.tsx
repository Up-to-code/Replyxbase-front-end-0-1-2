"use client";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import LanguageSwitcher from "./LanguageSwitcher";

const Header = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const tCommon = useTranslations("Common");
  const { data: session } = authClient.useSession();

  const navItems = [
    { label: tCommon("pricing"), href: "#pricing" },
    { label: tCommon("integrations"), href: "#integrations" },
    { label: tCommon("docs"), href: "#docs" }
  ];

  return (
    <header className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b-2 border-slate-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
            <div className="w-9 h-9 bg-[#005bbc] rounded-xl flex items-center justify-center border-2 border-[#005bbc] group-hover:scale-110 transition-transform">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-bold text-lg text-slate-900 tracking-tight group-hover:text-[#005bbc] transition-colors">
              Replyxbase
            </span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-[#005bbc] transition-all rounded-xl hover:bg-[#005bbc]/5 border-2 border-transparent hover:border-[#005bbc]/10"
              >
                {item.label}
              </a>
            ))}
          </nav>
          
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            
            {session ? (
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 font-medium h-9 px-4 rounded-xl hover:bg-slate-50 border-2 border-transparent hover:border-slate-200">
                  {tCommon("dashboard")}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900 font-medium h-9 px-4 rounded-xl hover:bg-slate-50 border-2 border-transparent hover:border-slate-200">
                    {tCommon("logIn")}
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary" size="sm" className="rounded-xl px-6 h-9 bg-[#005bbc] hover:bg-[#004a9f] text-white font-semibold border-2 border-[#005bbc] transition-all flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    {tCommon("getStarted")}
                  </Button>
                </Link>
              </>
            )}
          </div>
          
          <div className="md:hidden flex items-center gap-3">
            <LanguageSwitcher />
            <button 
              className="p-2 text-slate-600 hover:bg-slate-50 rounded-xl transition-colors border-2 border-transparent hover:border-slate-200" 
              onClick={() => setMobileNavOpen(true)} 
              aria-label={tCommon("menu")}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      
      {mobileNavOpen && (
        <div className="fixed inset-0 bg-white z-50 p-6 flex flex-col">
          <div className="flex justify-between items-center mb-8 pb-6 border-b-2 border-slate-200">
            <span className="font-bold text-2xl text-slate-900">{tCommon("menu")}</span>
            <button 
              onClick={() => setMobileNavOpen(false)} 
              className="p-2 hover:bg-slate-50 rounded-xl border-2 border-transparent hover:border-slate-200 transition-all"
              aria-label={tCommon("menu")}
            >
              <X className="w-6 h-6 text-slate-900" />
            </button>
          </div>
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                onClick={() => setMobileNavOpen(false)} 
                className="text-lg font-medium text-slate-600 hover:text-[#005bbc] py-4 px-4 rounded-xl hover:bg-[#005bbc]/5 border-2 border-transparent hover:border-[#005bbc]/10 transition-all"
              >
                {item.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 w-full mt-8 pt-6 border-t-2 border-slate-200">
              <Link href="/login" className="w-full">
                <Button variant="outline" className="w-full h-11 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:border-slate-300">
                  {tCommon("logIn")}
                </Button>
              </Link>
              <Link href="/signup" className="w-full">
                <Button variant="primary" className="w-full h-11 rounded-xl bg-[#005bbc] hover:bg-[#004a9f] text-white font-semibold border-2 border-[#005bbc] flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {tCommon("getStarted")}
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
