import React, { useRef } from 'react';
import { Paperclip, Loader2, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRTL } from '@/hooks/useRTL';

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (msg: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSending: boolean;
  isUploading: boolean;
  isAIMode: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  newMessage,
  setNewMessage,
  onSendMessage,
  onFileUpload,
  isSending,
  isUploading,
  isAIMode
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations("Dashboard.Inbox");
  const { isRTL } = useRTL();

  return (
    <div className="p-4 sm:p-6 bg-white border-t-2 border-slate-200">
      <div className="flex items-center gap-3 sm:gap-4 max-w-5xl mx-auto">
        <input 
          type="file" 
          ref={fileInputRef}
          className="hidden" 
          onChange={onFileUpload}
          accept="image/*,.pdf,.doc,.docx"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading || isSending}
          className="p-2.5 sm:p-3 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors disabled:opacity-50 border-2 border-transparent hover:border-slate-200"
          title="Attach File or Image"
        >
          <Paperclip className={`w-5 h-5 sm:w-6 sm:h-6 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        
        <form onSubmit={onSendMessage} className="flex-1 flex items-center gap-3 sm:gap-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={isAIMode ? t("aiActive") : t("typeMessage")}
            disabled={isSending || isAIMode}
            className="flex-1 py-3 sm:py-4 px-4 sm:px-6 bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-[#005bbc] focus:ring-2 focus:ring-[#005bbc]/20 rounded-xl transition-all duration-200 outline-none text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed"
            dir="auto"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isSending || isAIMode}
            className="p-3 sm:p-4 bg-transparent text-[#005bbc] rounded-xl hover:bg-[#005bbc]/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 border-2 border-[#005bbc]/20 hover:border-[#005bbc] focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20"
            aria-label="Send message"
          >
            {isSending ? <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" /> : <Send className={`w-5 h-5 sm:w-6 sm:h-6 ${isRTL ? 'rotate-180' : ''}`} />}
          </button>
        </form>
      </div>
    </div>
  );
};
