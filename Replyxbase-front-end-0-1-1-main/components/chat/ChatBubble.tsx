import React from "react";
import { Avatar } from "@/components/ui/Avatar";
import { Bot, User } from "lucide-react";

interface ChatBubbleProps {
  message: string;
  isAi: boolean;
  avatarSrc?: string;
  timestamp?: string;
}

export default function ChatBubble({ message, isAi, avatarSrc, timestamp }: ChatBubbleProps) {
  return (
    <div className={`flex gap-3 max-w-[80%] ${isAi ? "self-start" : "self-end flex-row-reverse"}`}>
      {/* Avatar */}
      <div className="flex-shrink-0 mt-1">
        {isAi ? (
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#005bbc] to-[#004a9f] flex items-center justify-center text-white shadow-sm">
            <Bot className="w-4 h-4" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 border border-slate-200">
            {avatarSrc ? (
              <Avatar src={avatarSrc} alt="User" size="sm" />
            ) : (
              <User className="w-4 h-4" />
            )}
          </div>
        )}
      </div>

      {/* Message Bubble */}
      <div className="flex flex-col gap-1">
        <div
          className={`p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isAi
              ? "bg-white border-2 border-slate-200 text-slate-700 rounded-ss-none"
              : "bg-[#005bbc] text-white rounded-se-none"
          }`}
        >
          {message}
        </div>
        {timestamp && (
          <span className={`text-xs text-slate-400 ${isAi ? "text-start" : "text-end"}`}>
            {timestamp}
          </span>
        )}
      </div>
    </div>
  );
}
