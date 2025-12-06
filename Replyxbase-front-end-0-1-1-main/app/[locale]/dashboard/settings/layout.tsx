import React from "react";
import { getTranslations } from "next-intl/server";
import { SettingsSidebar } from "./components/SettingsSidebar";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations("Dashboard.Settings");

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-12 py-10 border-b-2 border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
        <p className="text-lg text-slate-500 mt-2">{t("subtitle")}</p>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-12 py-12">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Sidebar */}
          <div className="shrink-0 w-72">
            <SettingsSidebar />
          </div>

          {/* Content Area */}
          <div className="flex-1 max-w-4xl">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

