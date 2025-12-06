import React from 'react';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Booking } from '../../types';

/**
 * Props for the StatusBadge component.
 */
interface StatusBadgeProps {
  /** The status of the booking */
  status: Booking['status'];
}

/**
 * Props for the PriorityBadge component.
 */
interface PriorityBadgeProps {
  /** The priority of the booking */
  priority: Booking['priority'];
}

/**
 * Displays a badge representing the booking status.
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const t = useTranslations("Dashboard.CRM.Status");

  const statusConfig: Record<Booking['status'], { icon: any; color: string }> = {
    pending: { icon: Clock, color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-2 border-[#F59E0B]/20' },
    confirmed: { icon: CheckCircle, color: 'bg-[#10B981]/10 text-[#10B981] border-2 border-[#10B981]/20' },
    completed: { icon: CheckCircle, color: 'bg-[#005bbc] text-white border-2 border-[#005bbc]' },
    cancelled: { icon: XCircle, color: 'bg-[#EF4444]/10 text-[#EF4444] border-2 border-[#EF4444]/20' },
    'no-show': { icon: AlertCircle, color: 'bg-slate-100 text-slate-800 border-2 border-slate-200' }
  };

  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      <Icon className="w-3 h-3" />
      {t(status)}
    </span>
  );
};

/**
 * Displays a badge representing the booking priority.
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const t = useTranslations("Dashboard.CRM.Priority");

  const priorityConfig: Record<Booking['priority'], { color: string }> = {
    normal: { color: 'bg-slate-100 text-slate-800 border-2 border-slate-200' },
    high: { color: 'bg-[#F59E0B]/10 text-[#F59E0B] border-2 border-[#F59E0B]/20' },
    urgent: { color: 'bg-[#EF4444]/10 text-[#EF4444] border-2 border-[#EF4444]/20' }
  };

  const config = priorityConfig[priority];

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {t(priority)}
    </span>
  );
};