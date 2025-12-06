import React, { useState } from 'react';
import { Conversation } from '../../types';
import { MessageCircle, Smartphone, Globe } from 'lucide-react';
import { useRTL } from '@/hooks/useRTL';
import { ContextMenu } from './ContextMenu';

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
  onMarkAsDraft: (id: string) => void;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ 
  conversation, 
  isSelected, 
  onClick,
  onDelete,
  onMarkAsDraft
}) => {
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { isRTL } = useRTL();

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const getPlatformIcon = (platform: Conversation['platform']) => {
    switch (platform) {
      case 'whatsapp': return <MessageCircle className="w-5 h-5 text-[#ffd600]" />;
      case 'instagram': return <Smartphone className="w-5 h-5 text-pink-500" />;
      case 'website': return <Globe className="w-5 h-5 text-[#005bbc]" />;
      default: return <Globe className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <>
      <div
        onClick={onClick}
        onContextMenu={handleContextMenu}
        className={`p-4 sm:p-6 cursor-pointer hover:bg-slate-50 transition-all duration-200 border-b-2 border-slate-200 ${
          isSelected 
            ? `bg-[#005bbc]/10 ${isRTL ? 'border-r-4 border-r-[#005bbc]' : 'border-l-4 border-l-[#005bbc]'}` 
            : conversation.unreadCount > 0
            ? `bg-slate-50/30 ${isRTL ? 'border-r-4 border-r-slate-200' : 'border-l-4 border-l-slate-200'}`
            : `${isRTL ? 'border-r-4' : 'border-l-4'} border-transparent`
        }`}
      >
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-base sm:text-lg transition-colors border-2 ${isSelected ? 'bg-[#005bbc] text-white border-[#005bbc]' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {conversation.customerName.charAt(0)}
              </div>
              <div className={`absolute bottom-0 ${isRTL ? 'left-0' : 'right-0'} w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border-2 border-white ${
                conversation.customerStatus === 'online' ? 'bg-green-500' :
                conversation.customerStatus === 'away' ? 'bg-yellow-500' : 'bg-slate-400'
              }`} />
            </div>
            <div>
              <h3 className={`text-sm sm:text-base ${isSelected ? 'text-[#005bbc]' : 'text-slate-900'} ${conversation.unreadCount > 0 ? 'font-bold' : 'font-semibold'}`}>
                {conversation.customerName}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                {getPlatformIcon(conversation.platform)}
                <span className="text-xs text-slate-400 capitalize">{conversation.platform}</span>
              </div>
            </div>
          </div>
          <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap">
            {conversation.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className={`flex justify-between items-center mt-2 gap-2 ${isRTL ? 'pr-12 sm:pr-16' : 'pl-12 sm:pl-16'}`}>
          <p className={`text-sm sm:text-base truncate flex-1 min-w-0 ${isSelected ? 'text-slate-700' : conversation.unreadCount > 0 ? 'text-slate-900 font-medium' : 'text-slate-500'}`} dir="auto">
            {conversation.lastMessage}
          </p>
          {conversation.unreadCount > 0 && (
            <span className="w-5 h-5 sm:w-6 sm:h-6 bg-[#005bbc] text-white text-xs font-medium flex items-center justify-center rounded-full border-2 border-white shrink-0">
              {conversation.unreadCount}
            </span>
          )}
        </div>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDelete={() => onDelete(conversation.id)}
          onMarkAsDraft={() => onMarkAsDraft(conversation.id)}
        />
      )}
    </>
  );
};
