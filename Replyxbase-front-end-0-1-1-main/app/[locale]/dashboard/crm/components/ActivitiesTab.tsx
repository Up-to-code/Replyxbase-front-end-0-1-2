'use client';

import React from 'react';
import { useTranslations } from 'next-intl'; // Requires updating messages
import { Activity } from '../../types';
import { format } from 'date-fns';
import { Calendar, Phone, Mail, MessageSquare, Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ActivitiesTabProps {
  activities: (Activity & { booking?: { id: string; serviceType: string; date: Date; startTime: string }; customer?: { fullName: string } })[];
  onReschedule: (activity: any) => void; 
}

export const ActivitiesTab: React.FC<ActivitiesTabProps> = ({ activities, onReschedule }) => {
  const t = useTranslations("Dashboard.CRM.Activities");

  const getActivityIcon = (type: string) => {
    switch (type) {
        case 'call': return <Phone className="w-4 h-4 text-blue-600" />;
        case 'email': return <Mail className="w-4 h-4 text-orange-600" />;
        case 'meeting': return <Calendar className="w-4 h-4 text-purple-600" />;
        default: return <MessageSquare className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900 mb-6">{t('title')}</h2>
      
      <div className="relative border-l-2 border-slate-100 ml-3 space-y-8">
        {activities.map((activity) => (
            <div key={activity.id} className="relative pl-8">
                {/* Icon Dot */}
                <div className="absolute -left-[9px] top-1 w-5 h-5 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center">
                    <div className="scale-75">{getActivityIcon(activity.type)}</div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-900 capitalize">{t(`types.${activity.type}`)}</span>
                            <span className="text-xs text-slate-500">• {format(new Date(activity.createdAt), 'MMM d, h:mm a')}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-2">{activity.content}</p>
                        
                        {activity.customer && (
                            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 w-fit px-2 py-1 rounded-md">
                                <span>{t('with')} <span className="font-medium text-slate-700">{activity.customer.fullName}</span></span>
                            </div>
                        )}
                         {activity.booking && (
                             <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                 <span>{t('booking')} {activity.booking.serviceType}</span>
                             </div>
                         )}
                    </div>

                    {/* Quick Actions (Reschedule) */}
                     <div className="shrink-0">
                         <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-xs h-8 gap-2"
                            onClick={() => onReschedule(activity)}
                         >
                             <Clock className="w-3 h-3" />
                             {t('reschedule')}
                         </Button>
                     </div>
                </div>
            </div>
        ))}

        {activities.length === 0 && (
            <div className="pl-8 text-slate-500 text-sm italic">{t('noActivities')}</div>
        )}
      </div>
    </div>
  );
};
