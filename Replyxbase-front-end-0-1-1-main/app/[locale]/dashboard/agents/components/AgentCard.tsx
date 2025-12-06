import React from 'react';
import { useTranslations } from 'next-intl';
import { MoreHorizontal, MessageSquare, Users, Activity, ArrowRight, Globe, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { Agent } from '@/components/layout/AppLayout/types';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  const t = useTranslations("Dashboard.Agents.Card");

  // Mock stats for now as they are not in the database yet
  const stats = {
    conversations: 0,
    users: 0,
    satisfaction: 100
  };

  const statusColors = {
    active: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
    training: 'bg-[#005bbc]/10 text-[#005bbc] border-[#005bbc]/20'
  };

  return (
    <div className="group bg-white border-2 border-slate-200 rounded-2xl p-6 hover:border-[#005bbc]/30 transition-all duration-300">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-xl border-2 border-slate-200 group-hover:scale-105 transition-transform overflow-hidden">
             {agent.avatar ? (
                <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
             ) : (
                agent.name.charAt(0)
             )}
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">{agent.name}</h3>
            <p className="text-sm text-slate-600 capitalize">{agent.role}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[agent.status as keyof typeof statusColors] || statusColors.active}`}>
            {agent.status}
          </span>
          <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Platforms */}
      <div className="flex gap-2 mb-4">
        {agent.isWebsiteEnabled && (
          <div className="p-1.5 bg-[#005bbc]/10 text-[#005bbc] rounded-lg border border-[#005bbc]/20" title="Website Widget">
            <Globe className="w-4 h-4" />
          </div>
        )}
        {agent.isWhatsappEnabled && (
          <div className="p-1.5 bg-[#10B981]/10 text-[#10B981] rounded-lg border border-[#10B981]/20" title="WhatsApp">
            <MessageCircle className="w-4 h-4" />
          </div>
        )}
        {agent.isDmEnabled && (
          <div className="p-1.5 bg-[#ffd600]/10 text-[#ffd600] rounded-lg border border-[#ffd600]/20" title="Direct Message">
            <MessageSquare className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6 py-6 border-y border-slate-200">
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
            <MessageSquare className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-900">{stats.conversations}</p>
          <p className="text-xs text-slate-500">{t('conversations')}</p>
        </div>
        <div className="text-center border-x border-slate-200">
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
            <Users className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-900">{stats.users}</p>
          <p className="text-xs text-slate-500">{t('users')}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1 text-slate-400 mb-1">
            <Activity className="w-4 h-4" />
          </div>
          <p className="font-bold text-slate-900">{stats.satisfaction}%</p>
          <p className="text-xs text-slate-500">{t('satisfaction')}</p>
        </div>
      </div>

      <Link 
        href={`/dashboard/agents/${agent.id}`}
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-50 text-slate-900 font-medium hover:bg-[#005bbc] hover:text-white border-2 border-slate-200 hover:border-[#005bbc] transition-all group-hover:bg-[#005bbc] group-hover:text-white group-hover:border-[#005bbc]"
      >
        {t('viewDashboard')}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
};
