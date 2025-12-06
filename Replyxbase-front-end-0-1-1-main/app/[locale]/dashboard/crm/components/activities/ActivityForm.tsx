'use client';

import React, { useState } from 'react';
import { Phone, Mail, FileText, Users, Send } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Props for the ActivityForm component.
 */
interface ActivityFormProps {
  /** Callback when the form is submitted */
  onSubmit: (type: 'call' | 'email' | 'note' | 'meeting', content: string, scheduledAt?: Date) => Promise<void>;
  /** Whether the form is submitting */
  isLoading?: boolean;
}

/**
 * Form to add a new activity (call, email, note, meeting).
 */
export const ActivityForm: React.FC<ActivityFormProps> = ({ onSubmit, isLoading }) => {
  const [type, setType] = useState<'call' | 'email' | 'note' | 'meeting'>('note');
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const t = useTranslations("Dashboard.CRM.Activities.Form");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    
    let scheduledAt: Date | undefined;
    if ((type === 'call' || type === 'meeting') && date && time) {
        scheduledAt = new Date(`${date}T${time}`);
    }
    
    await onSubmit(type, content, scheduledAt);
    setContent('');
    setDate('');
    setTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded-xl border-2 border-slate-200">
      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setType('note')}
          className={`p-2 rounded-xl flex-1 flex justify-center items-center gap-2 text-sm transition-colors border-2 ${
            type === 'note' 
              ? 'bg-[#0ea5e9]/10 text-[#0ea5e9] border-[#0ea5e9]/20' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
          }`}
        >
          <FileText className="w-4 h-4" /> {t("note")}
        </button>
        <button
          type="button"
          onClick={() => setType('call')}
          className={`p-2 rounded-xl flex-1 flex justify-center items-center gap-2 text-sm transition-colors border-2 ${
            type === 'call' 
              ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
          }`}
        >
          <Phone className="w-4 h-4" /> {t("call")}
        </button>
        <button
          type="button"
          onClick={() => setType('email')}
          className={`p-2 rounded-xl flex-1 flex justify-center items-center gap-2 text-sm transition-colors border-2 ${
            type === 'email' 
              ? 'bg-[#005bbc]/10 text-[#005bbc] border-[#005bbc]/20' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
          }`}
        >
          <Mail className="w-4 h-4" /> {t("email")}
        </button>
        <button
          type="button"
          onClick={() => setType('meeting')}
          className={`p-2 rounded-xl flex-1 flex justify-center items-center gap-2 text-sm transition-colors border-2 ${
            type === 'meeting' 
              ? 'bg-[#005bbc]/10 text-[#005bbc] border-[#005bbc]/20' 
              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
          }`}
        >
          <Users className="w-4 h-4" /> {t("meeting")}
        </button>
      </div>

      {(type === 'call' || type === 'meeting') && (
        <div className="flex gap-2">
            <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 p-2 border-2 border-slate-200 rounded-xl text-sm"
            />
            <input 
                type="time" 
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="flex-1 p-2 border-2 border-slate-200 rounded-xl text-sm"
            />
        </div>
      )}

      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={t("placeholder", { type: t(type) })}
          className="w-full p-3 border-2 border-slate-200 rounded-xl focus:border-[#005bbc] focus:ring-0 min-h-[100px] resize-none transition-all"
          disabled={isLoading}
        />
        <div className="absolute bottom-3 right-3 rtl:right-auto rtl:left-3">
          <button
            type="submit"
            disabled={!content.trim() || isLoading}
            className="bg-[#005bbc] hover:bg-[#004a9f] text-white p-2 rounded-full border-2 border-[#005bbc] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </form>
  );
};
