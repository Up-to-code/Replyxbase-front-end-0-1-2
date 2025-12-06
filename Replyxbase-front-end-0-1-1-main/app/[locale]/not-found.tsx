"use client";

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/navigation';
import { Home, Bot } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  const locale = useLocale();
  const t = useTranslations("Common");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Number with Animation */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#005bbc] via-[#004a9f] to-[#005bbc] animate-pulse">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Bot className="w-32 h-32 text-[#005bbc]/10 animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900">
            {t("notFound.title") || "Page Not Found"}
          </h2>
          <p className="text-lg text-slate-600 max-w-md mx-auto">
            {t("notFound.description") || "Oops! The page you're looking for seems to have wandered off. Let's get you back on track."}
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Link href="/dashboard">
            <Button variant="primary" size="md" className="w-full sm:w-auto">
              <Home className="w-4 h-4" />
              {t("notFound.goHome") || "Go to Dashboard"}
            </Button>
          </Link>
          <Link href="/dashboard/agents">
            <Button variant="outline" size="md" className="w-full sm:w-auto">
              <Bot className="w-4 h-4" />
              {t("notFound.viewAgents") || "View Agents"}
            </Button>
          </Link>
        </div>

        {/* Helpful Links */}
        <div className="pt-8 border-t-2 border-slate-200">
          <p className="text-sm text-slate-500 mb-4">
            {t("notFound.helpfulLinks") || "Or try one of these:"}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/dashboard"
              className="text-sm text-[#005bbc] hover:text-[#004a9f] font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link 
              href="/dashboard/inbox"
              className="text-sm text-[#005bbc] hover:text-[#004a9f] font-medium transition-colors"
            >
              Inbox
            </Link>
            <Link 
              href="/dashboard/agents"
              className="text-sm text-[#005bbc] hover:text-[#004a9f] font-medium transition-colors"
            >
              Agents
            </Link>
            <Link 
              href="/dashboard/crm"
              className="text-sm text-[#005bbc] hover:text-[#004a9f] font-medium transition-colors"
            >
              CRM
            </Link>
            <Link 
              href="/dashboard/settings"
              className="text-sm text-[#005bbc] hover:text-[#004a9f] font-medium transition-colors"
            >
              Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

