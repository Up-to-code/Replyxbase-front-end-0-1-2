import React, { useState } from 'react';
import { Conversation } from '../../types';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { MessageCircle, AlertCircle, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';

interface ChatWindowProps {
  conversation?: Conversation;
  isAIMode: boolean;
  setIsAIMode: (mode: boolean) => void;
  onBack: () => void;
  isSending: boolean;
  isUploading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  onSendMessage: (content: string, type?: 'text' | 'image' | 'file', fileData?: any) => void;
  onRetry: (id: string, content: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  isAIMode,
  setIsAIMode,
  onBack,
  isSending,
  isUploading,
  error,
  setError,
  onSendMessage,
  onRetry
}) => {
  const [newMessage, setNewMessage] = useState('');
  const t = useTranslations("Dashboard.Inbox");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage(newMessage);
    setNewMessage('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImage = file.type.startsWith('image/');
    onSendMessage(
      isImage ? 'Image' : `File: ${file.name}`,
      isImage ? 'image' : 'file',
      {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        fileUrl: isImage ? `https://source.unsplash.com/random/800x600?sig=${Date.now()}` : undefined
      }
    );
  };

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-white">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 border-2 border-slate-200">
          <MessageCircle className="w-10 h-10 sm:w-12 sm:h-12 text-slate-300" />
        </div>
        <h3 className="text-xl sm:text-2xl font-semibold text-slate-900 mb-2">{t("emptyState.title")}</h3>
        <p className="text-sm sm:text-base text-slate-500">{t("emptyState.subtitle")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative">
      <ChatHeader
        conversation={conversation}
        isAIMode={isAIMode}
        setIsAIMode={setIsAIMode}
        onBack={onBack}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 sm:top-24 left-1/2 transform -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-xl border-2 border-red-200 flex items-center gap-2 z-20"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-2 hover:text-red-800 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <MessageList
        messages={conversation.messages}
        customerName={conversation.customerName}
        isSending={isSending}
        isUploading={isUploading}
        onRetry={onRetry}
      />

      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        isSending={isSending}
        isUploading={isUploading}
        isAIMode={isAIMode}
      />
    </div>
  );
};
