import React from 'react';
import { useTranslations } from 'next-intl';
import { MessageSquare, Users, Clock, ThumbsUp, TrendingUp, TrendingDown, MoreHorizontal, Phone, Mail, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const OverviewTab = () => {
  const t = useTranslations("Dashboard.Agents.Detail");

  const stats = [
    { 
      label: t('overview.stats.totalConversations'), 
      value: "1,234", 
      change: "+12.5%", 
      trend: "up",
      icon: MessageSquare,
      color: "text-[#005bbc]",
      bg: "bg-[#005bbc]/10"
    },
    { 
      label: t('overview.stats.avgResponseTime'), 
      value: "1m 30s", 
      change: "-5.2%", 
      trend: "down", // down is good for response time
      icon: Clock,
      color: "text-[#ffd600]",
      bg: "bg-[#ffd600]/10"
    },
    { 
      label: t('overview.stats.satisfactionRate'), 
      value: "98%", 
      change: "+2.1%", 
      trend: "up",
      icon: ThumbsUp,
      color: "text-[#10B981]",
      bg: "bg-[#10B981]/10"
    },
    { 
      label: t('overview.stats.activeUsers'), 
      value: "856", 
      change: "+8.4%", 
      trend: "up",
      icon: Users,
      color: "text-[#005bbc]",
      bg: "bg-[#005bbc]/10"
    },
  ];

  const activityData = [
    { name: 'Mon', value: 40 },
    { name: 'Tue', value: 30 },
    { name: 'Wed', value: 60 },
    { name: 'Thu', value: 45 },
    { name: 'Fri', value: 70 },
    { name: 'Sat', value: 20 },
    { name: 'Sun', value: 35 },
  ];

  const recentActivity = [
    { id: 1, type: 'message', content: t('overview.activity.replied'), time: t('overview.activity.time2min'), icon: MessageSquare, color: 'bg-blue-100 text-blue-600' },
    { id: 2, type: 'booking', content: t('overview.activity.booked'), time: t('overview.activity.time15min'), icon: Calendar, color: 'bg-purple-100 text-purple-600' },
    { id: 3, type: 'status', content: t('overview.activity.statusChanged'), time: t('overview.activity.time1hour'), icon:  Clock, color: 'bg-green-100 text-green-600' },
    { id: 4, type: 'call', content: t('overview.activity.handledCall'), time: t('overview.activity.time2hours'), icon: Phone, color: 'bg-orange-100 text-orange-600' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl border-2 border-slate-200 hover:border-[#005bbc]/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border-2 ${
                stat.trend === 'up' ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' : 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
              }`}>
                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-600">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border-2 border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900">{t('overview.chart.title')}</h3>
              <p className="text-sm text-slate-600">{t('overview.chart.subtitle')}</p>
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '8px', border: '2px solid #e2e8f0', backgroundColor: 'white' }}
                />
                <Bar dataKey="value" fill="#005bbc" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-2xl border-2 border-slate-200">
          <h3 className="font-bold text-slate-900 mb-6">{t('overview.activity.title')}</h3>
          <div className="space-y-6">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="relative pl-6 pb-6 last:pb-0 border-l border-2 border-slate-200 last:border-0">
                <div className={`absolute -left-3 top-0 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-3 h-3" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-900">{activity.content}</p>
                  <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
