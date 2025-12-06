'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { TrendingUp, TrendingDown, MessageSquare, Users, Clock, ThumbsUp } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon: Icon, color }) => {
  const isPositive = change >= 0;
  
  return (
    <div className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-[#005bbc]/30 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
          <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{Math.abs(change)}%</span>
        </div>
      </div>
      <h3 className="text-slate-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export const AgentStats: React.FC = () => {
  const t = useTranslations("Dashboard.Agents.Stats");

  const stats = [
    {
      title: t('totalConversations'),
      value: '1,234',
      change: 12.5,
      icon: MessageSquare,
      color: 'bg-primary text-primary'
    },
    {
      title: t('activeUsers'),
      value: '856',
      change: 8.2,
      icon: Users,
      color: 'bg-purple-500 text-purple-600'
    },
    {
      title: t('avgResponseTime'),
      value: '1.2s',
      change: -5.4, // Negative is good for time, but for simplicity in UI we might want to handle this differently or just show green
      icon: Clock,
      color: 'bg-orange-500 text-orange-600'
    },
    {
      title: t('satisfactionRate'),
      value: '98%',
      change: 2.1,
      icon: ThumbsUp,
      color: 'bg-green-500 text-green-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};
