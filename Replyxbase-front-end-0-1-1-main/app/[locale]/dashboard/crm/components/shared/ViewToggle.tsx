import React from 'react';
import { List, CalendarDays, Layout } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MainView } from '../../types';

/**
 * Props for the ViewToggle component.
 */
interface ViewToggleProps {
  /** Current active view */
  mainView: MainView;
  /** Callback to change the view */
  setMainView: (view: MainView) => void;
}

/**
 * Component to toggle between different views (Table, Calendar, Kanban).
 */
export const ViewToggle: React.FC<ViewToggleProps> = ({ mainView, setMainView }) => {
  const t = useTranslations("Dashboard.CRM.ViewToggle");

  return (
    <div className="flex gap-2">
      <button
        onClick={() => setMainView('table')}
        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border-2 ${
          mainView === 'table' 
            ? 'bg-[#005bbc] text-white border-[#005bbc]' 
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <List className="w-4 h-4 rtl:ml-2" />
        {t("table")}
      </button>
      <button
        onClick={() => setMainView('calendar')}
        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border-2 ${
          mainView === 'calendar' 
            ? 'bg-[#005bbc] text-white border-[#005bbc]' 
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <CalendarDays className="w-4 h-4 rtl:ml-2" />
        {t("calendar")}
      </button>
      <button
        onClick={() => setMainView('kanban')}
        className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 border-2 ${
          mainView === 'kanban' 
            ? 'bg-[#005bbc] text-white border-[#005bbc]' 
            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
        }`}
      >
        <Layout className="w-4 h-4 rtl:ml-2" />
        {t("kanban")}
      </button>
    </div>
  );
};