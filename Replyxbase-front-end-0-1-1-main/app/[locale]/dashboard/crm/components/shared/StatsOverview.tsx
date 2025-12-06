import React from 'react';
import { TrendingUp, Users, Calendar, AlertCircle, CheckCircle, Clock, CheckCheck, UserX } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Props for the StatsOverview component.
 */
interface StatsOverviewProps {
  /** Stats object with counts */
  stats: {
    all: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    noshow: number;
  };
  /** Whether data is loading */
  isLoading?: boolean;
  /** Current active filter */
  currentFilter?: string;
  /** Callback to change filter */
  onFilterChange?: (filter: string) => void;
}

/**
 * Displays key statistics about bookings as interactive premium tabs.
 */
export const StatsOverview: React.FC<StatsOverviewProps> = ({ 
  stats,
  isLoading,
  currentFilter,
  onFilterChange
}) => {
  const t = useTranslations("Dashboard.CRM.Stats");

  const statItems = React.useMemo(() => {
    return [
      {
        id: 'all',
        title: t("totalBookings"),
        value: stats.all,
        icon: Calendar,
        color: 'text-[#005bbc]',
        bg: 'bg-[#005bbc]/10',
        activeBorder: 'border-[#005bbc]',
        activeBg: 'bg-[#005bbc]/5'
      },
      {
        id: 'pending',
        title: t("pending"),
        value: stats.pending,
        icon: Clock,
        color: 'text-[#F59E0B]',
        bg: 'bg-[#F59E0B]/10',
        activeBorder: 'border-[#F59E0B]',
        activeBg: 'bg-[#F59E0B]/5'
      },
      {
        id: 'confirmed',
        title: t("confirmed"),
        value: stats.confirmed,
        icon: CheckCircle,
        color: 'text-[#10B981]',
        bg: 'bg-[#10B981]/10',
        activeBorder: 'border-[#10B981]',
        activeBg: 'bg-[#10B981]/5'
      },
      {
        id: 'cancelled',
        title: t("cancelled"),
        value: stats.cancelled,
        icon: AlertCircle,
        color: 'text-[#EF4444]',
        bg: 'bg-[#EF4444]/10',
        activeBorder: 'border-[#EF4444]',
        activeBg: 'bg-[#EF4444]/5'
      },
      {
        id: 'completed',
        title: t("completed") || 'Completed',
        value: stats.completed,
        icon: CheckCheck,
        color: 'text-[#3B82F6]',
        bg: 'bg-[#3B82F6]/10',
        activeBorder: 'border-[#3B82F6]',
        activeBg: 'bg-[#3B82F6]/5'
      },
      {
        id: 'no-show',
        title: t("noShow") || 'No Show',
        value: stats.noshow,
        icon: UserX,
        color: 'text-slate-500',
        bg: 'bg-slate-500/10',
        activeBorder: 'border-slate-500',
        activeBg: 'bg-slate-500/5'
      }
    ];
  }, [stats, t]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border-2 border-slate-200 animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-slate-100 rounded"></div>
                <div className="h-6 w-12 bg-slate-100 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
      {statItems.map((stat) => {
        const isActive = currentFilter === stat.id;
        return (
          <button
            key={stat.id}
            onClick={() => onFilterChange?.(stat.id)}
            className={`
              relative p-5 rounded-2xl border-2 transition-all duration-200 text-left group
              ${isActive 
                ? `bg-white ${stat.activeBorder} ring-1 ring-inset ${stat.activeBorder.replace('border-', 'ring-')}` 
                : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }
            `}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`text-sm font-medium transition-colors ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-700'}`}>
                {stat.title}
              </span>
              <div className={`p-2 rounded-lg ${stat.bg} ${isActive ? '' : 'opacity-80 group-hover:opacity-100'}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-slate-900">
                {stat.value}
              </span>
            </div>
            {isActive && (
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 rounded-b-[14px] ${stat.bg.replace('/10', '')}`} />
            )}
          </button>
        );
      })}
    </div>
  );
};
