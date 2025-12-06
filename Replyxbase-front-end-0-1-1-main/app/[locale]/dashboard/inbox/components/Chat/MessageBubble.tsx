import React from 'react';
import { Message } from '../../types';
import { Bot, RefreshCw, Image as ImageIcon, FileText, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRTL } from '@/hooks/useRTL';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  isAI: boolean;
  showAvatar: boolean;
  customerName: string;
  onRetry: (id: string, content: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isUser, 
  isAI, 
  showAvatar, 
  customerName,
  onRetry
}) => {
  const isError = message.status === 'error';
  const { isRTL } = useRTL();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser || isAI ? 'justify-end' : 'justify-start'} items-end gap-3 sm:gap-4`}
    >
      {(!isUser && !isAI) && (
        <div className="w-10 h-10 flex-shrink-0">
          {showAvatar && (
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 text-sm font-medium border-2 border-slate-200">
              {customerName.charAt(0)}
            </div>
          )}
        </div>
      )}
      
      <div className={`max-w-[70%] sm:max-w-[75%] group ${isUser || isAI ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`p-4 sm:p-5 rounded-2xl text-sm sm:text-base border-2 ${
            isError
              ? `bg-red-50 border-red-200 text-red-800 ${isRTL ? 'rounded-bl-none' : 'rounded-br-none'}`
              : isUser 
              ? `bg-[#005bbc] text-white border-[#005bbc] ${isRTL ? 'rounded-bl-none' : 'rounded-br-none'}` 
              : isAI
              ? `bg-gradient-to-r from-[#005bbc] to-[#004a9f] text-white border-[#005bbc] ${isRTL ? 'rounded-bl-none' : 'rounded-br-none'}`
              : `bg-slate-100 text-slate-800 border-slate-200 ${isRTL ? 'rounded-br-none' : 'rounded-bl-none'}`
          }`}
        >
          {message.type === 'image' ? (
            <div className="space-y-2">
              <div className="relative aspect-video w-48 sm:w-64 bg-slate-200 rounded-lg overflow-hidden border-2 border-slate-200">
                {/* Mock Image - In real app use message.fileUrl */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-slate-400">
                  <ImageIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
              </div>
              <p className="text-xs sm:text-sm opacity-90">Image Attachment</p>
            </div>
          ) : message.type === 'file' ? (
            <div className="flex items-center gap-3 p-2 bg-black/10 rounded-lg border-2 border-black/10">
              <div className="p-2 bg-white/20 rounded-lg">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate text-sm">{message.fileName || 'Document'}</p>
                <p className="text-xs opacity-70">{message.fileSize || 'Unknown size'}</p>
              </div>
              <button className="p-2 hover:bg-black/10 rounded-full transition-colors">
                <Download className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <span dir="auto">{message.content}</span>
          )}
        </div>
        
        <div className="flex items-center gap-2 mt-2 px-1">
          {isAI && <Bot className="w-3 h-3 text-[#ffd600]" />}
          {isError && (
            <button 
              onClick={() => onRetry(message.id, message.content)}
              className="flex items-center gap-1 text-red-500 hover:text-red-600 text-xs font-medium transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
          <span className="text-xs text-slate-400">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {(isUser || isAI) && !isError && (
            <span className="text-xs text-slate-400">
              {message.status === 'read' ? 'Read' : 
               message.status === 'delivered' ? 'Delivered' : 
               'Sent'}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};
