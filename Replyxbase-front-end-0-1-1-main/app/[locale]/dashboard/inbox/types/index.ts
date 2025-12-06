export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'customer' | 'ai';
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read' | 'error';
  type: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileSize?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  customerStatus: 'online' | 'offline' | 'away';
  platform: 'whatsapp' | 'website' | 'instagram';
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  messages: Message[];
  tags: string[];
}
