import { useEffect } from 'react';
import { Conversation } from '../types';

export function useAutoReply(
  isAIMode: boolean,
  selectedId: string | null,
  conversations: Conversation[],
  setConversations: (conversations: Conversation[]) => void
) {
  useEffect(() => {
    if (!isAIMode || !selectedId) return;

    const conversation = conversations.find(c => c.id === selectedId);
    if (!conversation) return;

    const lastMessage = conversation.messages[conversation.messages.length - 1];
    
    if (lastMessage.sender === 'customer') {
      const timer = setTimeout(() => {
        const aiResponses = [
          "I can certainly help with that! Let me check our schedule.",
          "Thanks for reaching out. A human agent will be with you shortly if I can't resolve this.",
          "Could you please provide more details?",
          "I've updated your booking information as requested."
        ];
        const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];

        const updatedConversations = conversations.map(conv => {
          if (conv.id === selectedId) {
            return {
              ...conv,
              lastMessage: randomResponse,
              lastMessageTime: new Date(),
              messages: [
                ...conv.messages,
                {
                  id: Date.now().toString(),
                  content: randomResponse,
                  sender: 'ai' as const,
                  timestamp: new Date(),
                  status: 'sent' as const,
                  type: 'text' as const
                }
              ]
            };
          }
          return conv;
        });
        setConversations(updatedConversations);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isAIMode, selectedId, conversations, setConversations]);
}
