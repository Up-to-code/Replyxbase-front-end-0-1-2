import { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from '../types';

// Mock Data
const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: '1',
    customerId: 'cust_1',
    customerName: 'Sarah Wilson',
    customerStatus: 'online',
    platform: 'website',
    lastMessage: 'That sounds great! When can I book?',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), // 5 mins ago
    unreadCount: 2,
    tags: ['New Lead', 'VIP'],
    messages: [
      {
        id: 'm1',
        content: 'Hi, I was looking at your premium package.',
        sender: 'customer',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: 'read',
        type: 'text'
      },
      {
        id: 'm2',
        content: 'Hello Sarah! Thanks for reaching out. What specific details would you like to know?',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        status: 'read',
        type: 'text'
      },
      {
        id: 'm3',
        content: 'Does it include the weekend support?',
        sender: 'customer',
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        status: 'read',
        type: 'text'
      },
      {
        id: 'm4',
        content: 'Yes, absolutely! 24/7 weekend support is included.',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 8),
        status: 'read',
        type: 'text'
      },
      {
        id: 'm5',
        content: 'That sounds great! When can I book?',
        sender: 'customer',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: 'delivered',
        type: 'text'
      }
    ]
  },
  {
    id: '2',
    customerId: 'cust_2',
    customerName: 'Michael Chen',
    customerStatus: 'offline',
    platform: 'whatsapp',
    lastMessage: 'Thanks for the update.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unreadCount: 0,
    tags: ['Existing Client'],
    messages: [
      {
        id: 'm1',
        content: 'Your appointment is confirmed for tomorrow at 2 PM.',
        sender: 'user',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
        status: 'read',
        type: 'text'
      },
      {
        id: 'm2',
        content: 'Thanks for the update.',
        sender: 'customer',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'read',
        type: 'text'
      }
    ]
  },
  {
    id: '3',
    customerId: 'cust_3',
    customerName: 'Emma Thompson',
    customerStatus: 'away',
    platform: 'instagram',
    lastMessage: 'I need to reschedule.',
    lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unreadCount: 1,
    tags: ['Urgent'],
    messages: [
      {
        id: 'm1',
        content: 'I need to reschedule.',
        sender: 'customer',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: 'delivered',
        type: 'text'
      }
    ]
  }
];

export function useInbox() {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string, type: 'text' | 'image' | 'file' = 'text', fileData?: { fileName: string, fileSize: string, fileUrl?: string }) => {
    if (!selectedId) return;
    setIsSending(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (Math.random() < 0.05) {
        throw new Error('Failed to send message. Please try again.');
      }

      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedId) {
          return {
            ...conv,
            lastMessage: type === 'text' ? content : type === 'image' ? 'Sent an image' : `Sent a file: ${fileData?.fileName}`,
            lastMessageTime: new Date(),
            messages: [
              ...conv.messages,
              {
                id: Date.now().toString(),
                content: content,
                sender: 'user' as const,
                timestamp: new Date(),
                status: 'sent' as const,
                type: type,
                ...fileData
              }
            ]
          };
        }
        return conv;
      });

      setConversations(updatedConversations);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      
      const updatedConversations = conversations.map(conv => {
        if (conv.id === selectedId) {
          return {
            ...conv,
            messages: [
              ...conv.messages,
              {
                id: Date.now().toString(),
                content: content,
                sender: 'user' as const,
                timestamp: new Date(),
                status: 'error' as const,
                type: type,
                ...fileData
              }
            ]
          };
        }
        return conv;
      });
      setConversations(updatedConversations);
    } finally {
      setIsSending(false);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const markAsDraft = (id: string) => {
    // Implement draft logic (e.g., add a tag or status)
    console.log('Mark as draft', id);
  };

  const retryMessage = (messageId: string, content: string) => {
    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedId) {
        return {
          ...conv,
          messages: conv.messages.filter(m => m.id !== messageId)
        };
      }
      return conv;
    });
    setConversations(updatedConversations);
    sendMessage(content);
  };

  return {
    conversations,
    setConversations,
    selectedId,
    setSelectedId,
    searchTerm,
    setSearchTerm,
    isSending,
    isUploading,
    setIsUploading,
    error,
    setError,
    sendMessage,
    deleteConversation,
    markAsDraft,
    retryMessage
  };
}
