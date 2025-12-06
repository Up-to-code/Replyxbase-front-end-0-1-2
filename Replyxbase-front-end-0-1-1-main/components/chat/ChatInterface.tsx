import React, { useState, useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: string;
}

interface ChatInterfaceProps {
  initialMessages?: Message[];
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Simulate AI response
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isAi: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate network delay and AI typing
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I can help you with that! Replyxbase is designed to streamline your customer support. Would you like to see a demo?",
        isAi: true,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-6 custom-scrollbar">
        {messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            message={msg.text}
            isAi={msg.isAi}
            timestamp={msg.timestamp}
          />
        ))}
        
        {isTyping && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005bbc] to-[#004a9f] flex items-center justify-center shrink-0">
               <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-5 h-5 text-white"
              >
                <path d="M12 2a10 10 0 1 0 10 10 10 10 0 0 0-10-10Z" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
            </div>
            <div className="bg-slate-100 rounded-2xl rounded-tl-none px-4 py-3 border-2 border-slate-200">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t-2 border-slate-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-xl border-2 border-slate-200 focus:border-[#005bbc] focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isTyping}
            className="px-4 py-2 bg-[#005bbc] text-white rounded-xl font-medium hover:bg-[#004a9f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
