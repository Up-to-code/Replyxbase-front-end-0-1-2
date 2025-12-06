"use client";

import React from "react";
import { Menu } from "lucide-react";
import type { Translator } from "./types";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { OrganizationSwitcher } from "./OrganizationSwitcher";
import { UserMenu } from "./UserMenu";
import { Notifications } from "./Notifications";
import { ErrorBanner } from "./ErrorBanner";

/**
 * Header Actions Component
 * Groups Notifications and Language Switcher together
 */
function HeaderActions({ t }: { t: Translator }) {
  return (
    <div className="flex items-center gap-2">
      <LanguageSwitcher />
      <Notifications t={t} />
    </div>
  );
}

/**
 * Main Header Component
 * Contains mobile menu toggle, organization switcher, notifications, language, and user menu
 */
export function Header({
  onSidebarToggle,
  t,
}: {
  onSidebarToggle: () => void;
  t: Translator;
}) {
  return (
    <>
      <ErrorBanner />
    <header 
      className="h-16 bg-white border-b-2 border-slate-200 flex items-center sticky top-0 z-50 backdrop-blur-sm bg-white/95"
      role="banner"
    >
      <div className="w-full">
        <div className="w-full px-4 sm:px-6 flex items-center justify-between gap-4">
          {/* Left: Mobile menu button */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <button
              type="button"
              onClick={onSidebarToggle}
              className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200 lg:hidden border-2 border-transparent hover:border-slate-200 active:scale-95"
              aria-label="Toggle sidebar"
              aria-expanded="false"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* Right: Organization Switcher + Actions + User Menu */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="hidden sm:block">
              <OrganizationSwitcher t={t} />
            </div>
            <HeaderActions t={t} />
            <UserMenu t={t} align="end" />
          </div>
        </div>
      </div>
    </header>
    </>
  );
}
