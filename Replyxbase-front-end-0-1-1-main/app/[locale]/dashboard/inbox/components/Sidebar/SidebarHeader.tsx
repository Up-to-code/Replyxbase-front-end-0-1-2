import React from 'react';
import { Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRTL } from '@/hooks/useRTL';

interface SidebarHeaderProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({ searchTerm, setSearchTerm }) => {
  const t = useTranslations("Dashboard.Inbox");
  const { isRTL } = useRTL();

  return (
    <div className="px-4 sm:px-6 pb-4 pt-4">
      <div className="relative">
        <Search className={`absolute top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 ${isRTL ? 'right-3' : 'left-3'}`} />
        <input
          type="text"
          placeholder={t("searchPlaceholder")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full py-3 bg-slate-50 border-2 border-slate-200 focus:bg-white focus:border-[#005bbc] focus:ring-2 focus:ring-[#005bbc]/20 rounded-xl transition-all duration-200 text-base ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
        />
      </div>
    </div>
  );
};
