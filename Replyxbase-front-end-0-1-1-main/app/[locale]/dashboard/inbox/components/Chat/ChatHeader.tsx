import React from 'react';
import { useRouter } from 'next/navigation';
import { Conversation } from '../../types';
import { ArrowLeft, Globe, MessageCircle, Smartphone, User, Bot, UserCheck } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRTL } from '@/hooks/useRTL';

interface ChatHeaderProps {
  conversation: Conversation;
  isAIMode: boolean;
  setIsAIMode: (mode: boolean) => void;
  onBack: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  conversation, 
  isAIMode, 
  setIsAIMode,
  onBack
}) => {
  const router = useRouter();
  const t = useTranslations("Dashboard.Inbox");
  const { isRTL } = useRTL();

  const getPlatformIcon = (platform: Conversation['platform']) => {
    switch (platform) {
      case 'whatsapp': return <MessageCircle className="w-5 h-5 text-[#ffd600]" />;
      case 'instagram': return <Smartphone className="w-5 h-5 text-pink-500" />;
      case 'website': return <Globe className="w-5 h-5 text-[#005bbc]" />;
      default: return <Globe className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 border-b-2 border-slate-200 flex justify-between items-center bg-white z-10">
      <div className="flex items-center gap-3 sm:gap-4">
        <button 
          onClick={onBack}
          className="md:hidden p-2 hover:bg-slate-50 rounded-xl transition-colors border-2 border-transparent hover:border-slate-200"
        >
          <ArrowLeft className={`w-5 h-5 sm:w-6 sm:h-6 text-slate-600 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-semibold text-base sm:text-lg border-2 border-slate-200">
          {conversation.customerName.charAt(0)}
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">{conversation.customerName}</h2>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500">
            <span className={`w-2 h-2 rounded-full ${
              conversation.customerStatus === 'online' ? 'bg-green-500' :
              conversation.customerStatus === 'away' ? 'bg-yellow-500' : 'bg-slate-400'
            }`} />
            {conversation.customerStatus === 'online' ? t("activeNow") : 
             conversation.customerStatus === 'away' ? t("away") : t("offline")}
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4">
        {/* CRM Profile Link */}
        <button
          onClick={() => router.push(`/dashboard/crm?customerId=${conversation.customerId}`)}
          className="p-2 text-slate-400 hover:text-[#005bbc] hover:bg-[#005bbc]/10 rounded-xl transition-colors border-2 border-transparent hover:border-[#005bbc]/20"
          title={t("goToCRM")}
        >
          <UserCheck className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* AI Switcher */}
        <div className="flex items-center bg-slate-100 rounded-full p-1 border-2 border-slate-200">
          <button
            onClick={() => setIsAIMode(false)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border-2 ${
              !isAIMode 
                ? 'bg-white text-slate-900 border-slate-200' 
                : 'text-slate-500 hover:text-slate-700 border-transparent'
            }`}
          >
            <User className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t("humanMode")}</span>
          </button>
          <button
            onClick={() => setIsAIMode(true)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all border-2 ${
              isAIMode 
                ? 'bg-[#005bbc] text-white border-[#005bbc]' 
                : 'text-slate-500 hover:text-slate-700 border-transparent'
            }`}
          >
            <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t("aiMode")}</span>
          </button>
        </div>

        <div className="h-6 sm:h-8 w-px bg-slate-200 mx-1 sm:mx-2" aria-hidden="true" />

        <div className="px-3 sm:px-4 py-2 bg-slate-50 rounded-full flex items-center gap-2 border-2 border-slate-200">
          <span className="text-xs sm:text-sm font-medium text-slate-500">{t("source")}:</span>
          {getPlatformIcon(conversation.platform)}
          <span className="text-xs sm:text-sm font-medium text-slate-900 capitalize">{conversation.platform}</span>
        </div>
      </div>
    </div>
  );
};
