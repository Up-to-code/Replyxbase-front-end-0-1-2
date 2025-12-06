import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Share2, MessageSquare, Globe, MessageCircle, Slack, Plus, ExternalLink, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { WebsiteIntegration } from './integrations/WebsiteIntegration';
import { WhatsAppIntegration } from './integrations/WhatsAppIntegration';

import { Agent } from '@prisma/client';

interface IntegrationsTabProps {
  agent: Agent;
}

export const IntegrationsTab: React.FC<IntegrationsTabProps> = ({ agent }) => {
  const t = useTranslations("Dashboard.Agents.Detail");
  const [selectedIntegration, setSelectedIntegration] = useState<string | null>(null);

  const handleConnect = (integration: string) => {
    if (integration === 'Website Widget' || integration === 'WhatsApp') {
      setSelectedIntegration(integration);
    } else {
      toast.info(`${integration} integration coming soon!`);
    }
  };

  if (selectedIntegration === 'Website Widget') {
    return <WebsiteIntegration agent={agent} onBack={() => setSelectedIntegration(null)} />;
  }

  if (selectedIntegration === 'WhatsApp') {
    return <WhatsAppIntegration agent={agent} onBack={() => setSelectedIntegration(null)} />;
  }

  const integrations = [
    { 
      name: 'WhatsApp', 
      icon: MessageCircle, 
      color: 'bg-green-100 text-green-600', 
      status: 'connected',
      description: t('integrations.whatsapp.description')
    },
    { 
      name: 'Website Widget', 
      icon: Globe, 
      color: 'bg-blue-100 text-blue-600', 
      status: 'connected',
      description: t('integrations.website.description')
    },
    { 
      name: 'Messenger', 
      icon: MessageSquare, 
      color: 'bg-purple-100 text-purple-600', 
      status: 'available',
      description: t('integrations.messenger.description')
    },
    { 
      name: 'Slack', 
      icon: Slack, 
      color: 'bg-orange-100 text-orange-600', 
      status: 'available',
      description: t('integrations.slack.description')
    },
    { 
      name: 'Telegram', 
      icon: Share2, 
      color: 'bg-sky-100 text-sky-600', 
      status: 'available',
      description: t('integrations.telegram.description')
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="font-bold text-slate-900">{t("integrations.title")}</h3>
          <p className="text-sm text-slate-600">{t("integrations.subtitle")}</p>
        </div>
        <button 
          onClick={() => handleConnect("New")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#005bbc] hover:bg-[#004a9f] border border-[#005bbc] rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t("integrations.add")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((item) => (
          <div key={item.name} className="flex flex-col p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-[#005bbc]/30 transition-all group">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              {item.status === 'connected' ? (
                <span className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-xs font-medium border-2 border-[#10B981]/20">
                  <CheckCircle2 className="w-3 h-3" />
                  {t('integrations.status.active')}
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-full bg-slate-50 text-slate-600 text-xs font-medium border-2 border-slate-200">
                  {t('integrations.status.available')}
                </span>
              )}
            </div>
            
            <h4 className="font-bold text-slate-900 mb-2 text-lg">{item.name}</h4>
            <p className="text-sm text-slate-600 mb-6 flex-1 leading-relaxed">{item.description}</p>
            
            <button 
              onClick={() => handleConnect(item.name)}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 border-2 ${
                item.status === 'connected' 
                  ? 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900' 
                  : 'bg-[#005bbc] hover:bg-[#004a9f] text-white border-[#005bbc]'
              }`}
            >
              {item.status === 'connected' ? (
                <>
                  {t('integrations.manage')}
                  <ExternalLink className="w-3 h-3" />
                </>
              ) : (
                t('integrations.connect')
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
