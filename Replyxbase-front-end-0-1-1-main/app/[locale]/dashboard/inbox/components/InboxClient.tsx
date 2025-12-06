'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useRTL } from '@/hooks/useRTL';
import { useInbox } from '../hooks/useInbox';
import { useAutoReply } from '../hooks/useAutoReply';
import { SidebarHeader } from './Sidebar/SidebarHeader';
import { ConversationList } from './Sidebar/ConversationList';
import { ChatWindow } from './Chat/ChatWindow';

export const InboxClient: React.FC = () => {
  const searchParams = useSearchParams();
  const [isMobileListVisible, setIsMobileListVisible] = useState(true);
  const [isAIMode, setIsAIMode] = useState(true);
  const t = useTranslations("Dashboard.Inbox");
  const { isRTL } = useRTL();

  const {
    conversations,
    setConversations,
    selectedId,
    setSelectedId,
    searchTerm,
    setSearchTerm,
    isSending,
    isUploading,
    error,
    setError,
    sendMessage,
    deleteConversation,
    markAsDraft,
    retryMessage
  } = useInbox();

  useAutoReply(isAIMode, selectedId, conversations, setConversations);

  // Auto-select conversation based on query param
  useEffect(() => {
    const customerId = searchParams.get('customerId');
    if (customerId) {
      const conversation = conversations.find(c => c.customerId === customerId);
      if (conversation) {
        setSelectedId(conversation.id);
        setIsMobileListVisible(false);
      }
    }
  }, [searchParams, conversations, setSelectedId]);

  const selectedConversation = conversations.find(c => c.id === selectedId);

  const filteredConversations = conversations.filter(c => 
    c.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-full bg-white overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Sidebar */}
      <div className={`${isMobileListVisible ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-96 border-e-2 border-slate-200 bg-white`}>
        <SidebarHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ConversationList
          conversations={filteredConversations}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setIsMobileListVisible(false);
          }}
          onDelete={deleteConversation}
          onMarkAsDraft={markAsDraft}
        />
      </div>

      {/* Chat Window */}
      <div className={`${!isMobileListVisible ? 'flex' : 'hidden'} md:flex flex-col flex-1 bg-white relative`}>
        <ChatWindow
          conversation={selectedConversation}
          isAIMode={isAIMode}
          setIsAIMode={setIsAIMode}
          onBack={() => setIsMobileListVisible(true)}
          isSending={isSending}
          isUploading={isUploading}
          error={error}
          setError={setError}
          onSendMessage={sendMessage}
          onRetry={retryMessage}
        />
      </div>
    </div>
  );
};
