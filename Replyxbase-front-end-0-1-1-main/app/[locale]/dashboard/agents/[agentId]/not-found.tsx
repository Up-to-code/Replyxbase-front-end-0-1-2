import React from 'react';
import { getTranslations } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default async function AgentNotFound() {
  const t = await getTranslations("Dashboard.Agents.Detail");

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-slate-900">404</h1>
          <h2 className="text-2xl font-bold text-slate-900">{t('notFoundTitle')}</h2>
          <p className="text-slate-600">{t('notFoundSubtitle')}</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard/agents"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] font-medium rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('backToAgents')}
          </Link>
        </div>
      </div>
    </div>
  );
}

