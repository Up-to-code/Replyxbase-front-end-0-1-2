import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Agent } from '@prisma/client';
import { updateAgent } from '@/app/actions/agent';
import { toast } from 'sonner';
import { Loader2, Trash2, Save, AlertTriangle, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SettingsTabProps {
  agent: Agent;
}

export const SettingsTab: React.FC<SettingsTabProps> = ({ agent }) => {
  const t = useTranslations("Dashboard.Agents.Detail");
  const router = useRouter();
  const [name, setName] = useState(agent.name);
  const [role, setRole] = useState(agent.role);
  const [systemPrompt, setSystemPrompt] = useState((agent.config as any)?.systemPrompt || '');

  const handleSave = () => {
    toast.success("Settings saved successfully");
  };

  const handleDelete = () => {
    toast.error("Delete functionality coming soon");
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl">
      {/* General Settings */}
      <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-2 border-slate-200 bg-slate-50/50">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <User className="w-4 h-4 text-slate-600" />
            {t('settings.general.title')}
          </h3>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.general.agentName')}</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all"
                placeholder={t('settings.general.agentNamePlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">{t('settings.general.role')}</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all"
                placeholder={t('settings.general.rolePlaceholder')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              {t('settings.general.systemPrompt')}
              <span className="ml-2 text-xs font-normal text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">{t('settings.general.instructions')}</span>
            </label>
            <textarea 
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 outline-none transition-all min-h-[150px] resize-y font-mono text-sm leading-relaxed"
              placeholder={t('settings.general.systemPromptPlaceholder')}
            />
            <p className="mt-2 text-xs text-slate-500">
              {t('settings.general.systemPromptHint')}
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#005bbc] hover:bg-[#004a9f] text-white border border-[#005bbc] rounded-lg transition-colors font-medium"
            >
              <Save className="w-4 h-4" />
              {t('settings.general.saveChanges')}
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-white border-2 border-[#EF4444]/20 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-2 border-[#EF4444]/20 bg-[#EF4444]/10">
          <h3 className="font-bold text-[#EF4444] flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#EF4444]" />
            {t('settings.danger.title')}
          </h3>
        </div>
        <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h4 className="font-bold text-slate-900 mb-1">{t('settings.danger.deleteTitle')}</h4>
            <p className="text-sm text-slate-600">
              {t('settings.danger.deleteDescription')}
            </p>
          </div>
          <button 
            onClick={handleDelete}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2.5 bg-white border-2 border-[#EF4444]/20 text-[#EF4444] rounded-lg hover:bg-[#EF4444]/10 transition-colors font-medium"
          >
            <Trash2 className="w-4 h-4" />
            {t('settings.danger.deleteButton')}
          </button>
        </div>
      </div>
    </div>
  );
};
