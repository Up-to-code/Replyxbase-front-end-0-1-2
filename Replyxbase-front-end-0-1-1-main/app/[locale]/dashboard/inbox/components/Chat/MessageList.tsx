import React, { useRef, useEffect } from 'react';
import { Message } from '../../types';
import { MessageBubble } from './MessageBubble';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface MessageListProps {
  messages: Message[];
  customerName: string;
  isSending: boolean;
  isUploading: boolean;
  onRetry: (id: string, content: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  customerName, 
  isSending, 
  isUploading,
  onRetry
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending, isUploading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 bg-white">
      {messages.map((message, index) => {
        const isUser = message.sender === 'user';
        const isAI = message.sender === 'ai';
        const showAvatar = (!isUser && !isAI) && (index === 0 || messages[index - 1].sender === 'user' || messages[index - 1].sender === 'ai');

        return (
          <MessageBubble
            key={message.id}
            message={message}
            isUser={isUser}
            isAI={isAI}
            showAvatar={showAvatar}
            customerName={customerName}
            onRetry={onRetry}
          />
        );
      })}
      {isSending && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end items-center gap-2 text-slate-400 text-sm p-4">
          <Loader2 className="w-4 h-4 animate-spin text-[#005bbc]" />
          Sending...
        </motion.div>
      )}
      {isUploading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-end items-center gap-2 text-slate-400 text-sm p-4">
          <Loader2 className="w-4 h-4 animate-spin text-[#005bbc]" />
          Uploading file...
        </motion.div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};
