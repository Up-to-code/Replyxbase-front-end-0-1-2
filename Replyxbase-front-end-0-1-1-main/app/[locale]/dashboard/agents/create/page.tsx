'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { CreateAgentForm } from '../components/CreateAgentForm';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CreateAgentPage() {
  const t = useTranslations("Dashboard.Agents.Create");

  return (
    <div className="min-h-screen bg-slate-50 animate-fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/dashboard/agents" 
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-[#005bbc] mb-6 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 rtl:hidden group-hover:-translate-x-0.5 transition-transform" />
            <ArrowRight className="w-4 h-4 ltr:hidden group-hover:translate-x-0.5 transition-transform" />
            {t("backToAgents")}
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">{t("title")}</h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-2xl">{t("subtitle")}</p>
          </div>
        </div>

        {/* Form */}
        <CreateAgentForm />
      </div>
    </div>
  );
}
