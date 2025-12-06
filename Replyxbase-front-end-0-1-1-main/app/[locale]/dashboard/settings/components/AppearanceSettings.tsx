"use client";

import React from 'react';
import { useTranslations } from 'next-intl';
import { Globe } from 'lucide-react';
import { LanguageDropdown } from '@/components/shared/LanguageDropdown';

export const AppearanceSettings: React.FC = () => {
  const t = useTranslations("Dashboard.Settings.Appearance");

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900">{t("title")}</h2>
        <p className="text-base text-slate-500 mt-2">{t("description")}</p>
      </div>

      <div className="space-y-8">
        {/* Language Selection */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#005bbc]/10 flex items-center justify-center border-2 border-[#005bbc]/20">
              <Globe className="w-5 h-5 text-[#005bbc]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t("language.title")}</h3>
              <p className="text-sm text-slate-500">{t("language.description")}</p>
            </div>
          </div>
          <div className="flex items-center justify-start">
            <LanguageDropdown />
          </div>
          <p className="text-sm text-slate-500 mt-4">
            {t("language.note") || "Changes will apply immediately and refresh the page."}
          </p>
        </div>
      </div>
    </div>
  );
};
