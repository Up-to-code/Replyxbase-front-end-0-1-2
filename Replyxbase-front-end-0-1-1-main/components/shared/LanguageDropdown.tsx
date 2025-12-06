"use client";

import React, { useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/navigation";
import { ChevronDown, Globe, Check } from "lucide-react";

const languages = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "es", label: "Español", flag: "🇪🇸" },
];

function useClickOutside(callback: () => void) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [callback]);

  return ref;
}

export function LanguageDropdown() {
  const t = useTranslations("Common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const ref = useClickOutside(() => setIsOpen(false));

  const currentLanguage = languages.find((lang) => lang.code === locale) || languages[0];

  const switchLocale = (newLocale: string) => {
    if (newLocale !== locale) {
      router.replace(pathname, { locale: newLocale });
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-slate-200 active:scale-95"
        aria-label={t("languageSwitchLabel")}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4 text-slate-600" />
        <span className="text-sm font-medium text-slate-700 hidden sm:inline">
          {currentLanguage.flag} {currentLanguage.label}
        </span>
        <span className="text-sm font-medium text-slate-700 sm:hidden">
          {currentLanguage.flag}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
          isOpen ? 'rotate-180' : ''
        }`} />
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full mt-2 w-56 bg-white border-2 border-slate-200 rounded-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100 shadow-lg">
          <div className="p-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => switchLocale(lang.code)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 border-2 ${
                  locale === lang.code
                    ? "bg-[#005bbc]/10 text-[#005bbc] border-[#005bbc]/20"
                    : "hover:bg-slate-50 text-slate-700 border-transparent hover:border-slate-200"
                }`}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="flex-1 text-start font-medium text-sm">{lang.label}</span>
                {locale === lang.code && (
                  <Check className="w-4 h-4 text-[#005bbc] flex-shrink-0" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

