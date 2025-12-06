import React from 'react';
import { Activity } from '../../types';
import { Phone, Mail, FileText, Users, Clock } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';

/**
 * Props for the ActivityLog component.
 */
interface ActivityLogProps {
  /** List of activities to display */
  activities: Activity[];
}

/**
 * Displays a chronological log of activities (calls, emails, notes, meetings).
 */
export const ActivityLog: React.FC<ActivityLogProps> = ({ activities }) => {
  const t = useTranslations("Dashboard.CRM.Activities.Log");
  
  const getIcon = (type: Activity['type']) => {
    switch (type) {
      case 'call': return <Phone className="w-4 h-4 text-[#10B981]" />;
      case 'email': return <Mail className="w-4 h-4 text-[#005bbc]" />;
      case 'meeting': return <Users className="w-4 h-4 text-[#005bbc]" />;
      case 'note': return <FileText className="w-4 h-4 text-[#0ea5e9]" />;
    }
  };

  const format = useFormatter();

  if (!activities || activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-xl">
        <p>{t("noActivities")}</p>
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((activity) => (
        <div key={activity.id} className="relative group">
          {/* Timeline Dot */}
          <div className={`absolute -left-[29px] w-6 h-6 rounded-full border-4 border-white flex items-center justify-center bg-slate-100 shadow-sm z-10 transition-colors ${
             activity.type === 'call' ? 'group-hover:bg-emerald-100' :
             activity.type === 'email' ? 'group-hover:bg-blue-100' :
             activity.type === 'meeting' ? 'group-hover:bg-violet-100' :
             'group-hover:bg-sky-100'
          }`}>
             {getIcon(activity.type)}
          </div>
          
          <div className="bg-white rounded-xl border-2 border-slate-200 p-4 hover:border-slate-300 transition-colors shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                 <span className="font-semibold text-sm text-slate-900 capitalize">{activity.type}</span>
                 {activity.type === 'call' && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">Outbound</span>}
              </div>
              <div className="flex items-center text-xs text-slate-400 gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>
                    {format.dateTime(new Date(activity.createdAt), { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: 'numeric', 
                        minute: 'numeric' 
                    })}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{activity.content}</p>
            
            <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-100">
               <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600">
                      {activity.createdBy ? activity.createdBy.charAt(0) : 'U'}
                  </div>
                  <span>{t("loggedBy", { name: activity.createdBy || 'Unknown' })}</span>
               </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
