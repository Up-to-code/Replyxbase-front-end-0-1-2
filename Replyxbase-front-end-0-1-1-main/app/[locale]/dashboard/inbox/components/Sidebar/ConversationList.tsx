import React from 'react';
import { Conversation } from '../../types';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAsDraft: (id: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({ 
  conversations, 
  selectedId, 
  onSelect,
  onDelete,
  onMarkAsDraft
}) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map(conversation => (
        <ConversationItem
          key={conversation.id}
          conversation={conversation}
          isSelected={selectedId === conversation.id}
          onClick={() => onSelect(conversation.id)}
          onDelete={onDelete}
          onMarkAsDraft={onMarkAsDraft}
        />
      ))}
    </div>
  );
};
