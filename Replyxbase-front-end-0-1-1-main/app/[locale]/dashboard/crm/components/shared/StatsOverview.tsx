import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, CheckCheck, UserX, Hash } from 'lucide-react';
import { useTranslations } from 'next-intl';

/**
 * Props for the StatsOverview component.
 */
interface StatsOverviewProps {
  /** Stats object with counts */
  stats: Record<string, number>;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Current active filter */
  currentFilter?: string;
  /** Callback to change filter */
  onFilterChange?: (filter: string) => void;
  /** Available columns from Kanban settings */
  columns?: { id: string; title: string }[];
}

const STATUS_CONFIG: Record<string, any> = {
  pending: { icon: Clock, color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', border: 'border-[#F59E0B]' },
  confirmed: { icon: CheckCircle, color: 'text-[#10B981]', bg: 'bg-[#10B981]/10', border: 'border-[#10B981]' },
  cancelled: { icon: AlertCircle, color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', border: 'border-[#EF4444]' },
  completed: { icon: CheckCheck, color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', border: 'border-[#3B82F6]' },
  'no-show': { icon: UserX, color: 'text-slate-500', bg: 'bg-slate-500/10', border: 'border-slate-500' },
};

/**
 * Displays key statistics about bookings as interactive premium tabs.
 */
export const StatsOverview: React.FC<StatsOverviewProps> = ({ 
  stats,
  isLoading,
  currentFilter,
  onFilterChange,
  columns = []
}) => {
  const t = useTranslations("Dashboard.CRM.Stats");

  const statItems = React.useMemo(() => {
    // 1. Total Card
    const items = [{
      id: 'all',
      key: 'all',
      title: t("totalBookings"),
      value: stats.all || 0,
      icon: Calendar,
      color: 'text-[#005bbc]',
      bg: 'bg-[#005bbc]/10',
      activeBorder: 'border-[#005bbc]',
      activeBg: 'bg-[#005bbc]/5'
    }];

    // 2. Column Cards
    // If no columns provided, fallback to default set (though likely columns will be passed)
    const activeColumns = columns.length > 0 ? columns : [
        { id: 'pending', title: t("pending") },
        { id: 'confirmed', title: t("confirmed") },
        { id: 'completed', title: t("completed") },
        { id: 'cancelled', title: t("cancelled") },
        { id: 'no-show', title: t("noShow") }
    ];

    activeColumns.forEach(col => {
        // Determine the key used in stats object
        // User requested "based on column name".
        // Custom columns: status = Title.
        // Default columns: status = ID (legacy/safe).
        const statsKey = col.id.startsWith('custom-') ? col.title : col.id;
        
        // Get Config
        const config = STATUS_CONFIG[col.id] || { 
            icon: Hash, 
            color: 'text-slate-600', 
            bg: 'bg-slate-600/10', 
            border: 'border-slate-600' 
        };

        items.push({
            id: statsKey, // Filter ID
            key: col.id, // React Key (Unique)
            title: col.title, // Display Title (responsive to renaming)
            value: stats[statsKey] || 0,
            icon: config.icon,
            color: config.color,
            bg: config.bg,
            activeBorder: config.border,
            activeBg: config.bg.replace('/10', '/5')
        });
    });

    return items;
  }, [stats, t, columns]);

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
            key={stat.key}
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
