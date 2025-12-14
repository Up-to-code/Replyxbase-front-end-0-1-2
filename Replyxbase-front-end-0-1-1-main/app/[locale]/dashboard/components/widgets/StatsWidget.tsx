'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { MessageSquare, Users, Bot, Clock, Calendar } from 'lucide-react';

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MessageSquare,
  Users,
  Bot,
  Clock,
  Calendar
};

interface Stat {
  id: string;
  label: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

interface StatsWidgetProps {
  stats: Stat[];
}

export const StatsWidget: React.FC<StatsWidgetProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = IconMap[stat.icon] || MessageSquare;
        return (
          <Card key={stat.id} className="p-5 hover:border-[#005bbc]/30 transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2.5 rounded-xl border-2 ${
                stat.color === 'blue' ? 'bg-[#005bbc]/10 border-[#005bbc]/20 text-[#005bbc]' :
                stat.color === 'green' ? 'bg-green-50 border-green-200 text-green-600' :
                stat.color === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-600' :
                'bg-orange-50 border-orange-200 text-orange-600'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wide">{stat.label}</h3>
              <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

