/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  MessageSquare,
  Users,
  Bot,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Calendar,
  FileText,
  Phone,
  Globe,
  Send,
  Instagram,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';

// ============================================
// ICON MAPPING
// ============================================
const IconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  MessageSquare,
  TrendingUp,
  CheckCircle2,
  Clock,
  Phone,
  Globe,
  Send,
  Instagram,
  Users,
  FileText,
  Calendar,
  Zap,
};

// ============================================
// MOCK DATA - SAAS SPECIFIC
// ============================================
// Mock data removed - passed via props

// ============================================
// COMPONENTS
// ============================================

const StatCard = ({ stat }: { stat: any }) => {
  const t = useTranslations("Dashboard.Home");
  const Icon = IconMap[stat.icon] || MessageSquare;

  return (
    <Card className="p-5 hover:border-[#005bbc]/30 transition-all duration-200 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl border-2 ${
          stat.color === 'blue' ? 'bg-[#005bbc]/10 border-[#005bbc]/20 text-[#005bbc]' :
          stat.color === 'green' ? 'bg-green-50 border-green-200 text-green-600' :
          stat.color === 'purple' ? 'bg-purple-50 border-purple-200 text-purple-600' :
          'bg-orange-50 border-orange-200 text-orange-600'
        }`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
          stat.trend === 'up' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {stat.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {stat.change}
        </div>
      </div>
      <div className="space-y-1">
        <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wide">{t(`stats.${stat.id}`)}</h3>
        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
      </div>
    </Card>
  );
};

const PlatformItem = ({ platform }: { platform: any }) => {
  const Icon = IconMap[platform.icon] || Globe;
  return (
    <Link href="/dashboard/inbox" className="block">
      <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-all duration-200 cursor-pointer border-2 border-transparent hover:border-slate-200">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 ${platform.bg}`}>
            <Icon className="w-4 h-4" style={{ color: platform.color }} />
          </div>
          <div>
            <p className="font-medium text-sm text-slate-900">{platform.name}</p>
            <p className="text-xs text-slate-500">{platform.messages.toLocaleString()}</p>
          </div>
        </div>
          <Badge variant="success" className="text-xs">
            +{platform.growth}%
          </Badge>
      </div>
    </Link>
  );
};

const AgentRow = ({ agent }: { agent: any }) => {
  const router = useRouter();
  return (
    <tr 
      className="border-b-2 border-slate-100 last:border-0 hover:bg-slate-50/50 transition-colors cursor-pointer" 
      onClick={() => router.push(`/dashboard/agents/${agent.id}`)}
    >
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#005bbc]/10 border-2 border-[#005bbc]/20 flex items-center justify-center text-[#005bbc]">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <p className="font-medium text-slate-900 text-sm">{agent.name}</p>
            <p className="text-xs text-slate-500">{agent.role}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4">
        <Badge 
          variant={
            agent.status === 'active' ? 'success' : 
            agent.status === 'training' ? 'warning' : 
            'secondary'
          }
          className="text-xs"
        >
          {agent.status}
        </Badge>
      </td>
      <td className="py-3 px-4 text-sm text-slate-600">{agent.conversations}</td>
      <td className="py-3 px-4 text-sm text-slate-600">{agent.conversion}%</td>
    </tr>
  );
};

const ActivityItem = ({ item }: { item: any }) => {
  const Icon = IconMap[item.icon] || Zap;
  return (
    <div className="flex gap-3 p-3 hover:bg-slate-50 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-slate-200">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border-2 ${item.bg}`}>
        <Icon className={`w-4 h-4 ${item.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-900 font-medium leading-snug">{item.text}</p>
        <p className="text-xs text-slate-500 mt-1">{item.time}</p>
      </div>
    </div>
  );
};

const BookingItem = ({ booking }: { booking: any }) => (
  <div className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl hover:border-[#005bbc]/30 transition-all duration-200 bg-white hover:bg-slate-50">
      <div className="flex items-center gap-3 flex-1 min-w-0">
      <div className="w-10 h-10 bg-[#005bbc]/10 rounded-xl border-2 border-[#005bbc]/20 shrink-0 flex items-center justify-center">
        <Calendar className="w-4 h-4 text-[#005bbc]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-slate-900 truncate">{booking.customer}</p>
        <p className="text-xs text-slate-500 mt-0.5">{booking.time} • {booking.type}</p>
      </div>
    </div>
    <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'} className="text-xs shrink-0">
      {booking.status}
    </Badge>
  </div>
);

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function DashboardClient({ 
  stats, 
  platforms, 
  agents, 
  bookings, 
  activity, 
  chartData 
}: {
  stats: any[];
  platforms: any[];
  agents: any[];
  bookings: any[];
  activity: any[];
  chartData: any;
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'year'>('7d');
  const t = useTranslations("Dashboard.Home");

  useEffect(() => {
    // Simulate a quick data fetch for smooth entry
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleDownloadReport = () => {
    toast.success("Downloading report...");
  };

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
            <p className="text-slate-600 mt-1 text-sm">{t("subtitle")}</p>
          </div>
            <Link href="/dashboard/agents/create">
            <Button variant="primary" size="sm">
                {t("createAgent")}
              </Button>
            </Link>
        </div>

        {/* Stats Grid - Horizontal Scroll */}
        <div className="overflow-x-auto pb-2 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <div className="flex gap-4 min-w-max">
          {stats.map((stat) => (
              <div key={stat.id} className="min-w-[280px]">
                <StatCard stat={stat} />
              </div>
          ))}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Left Column (Charts & Agents) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Analytics Chart */}
            <Card>
              <CardHeader className="flex items-center justify-between pb-4">
                <h2 className="text-lg font-bold text-slate-900">{t("charts.title")}</h2>
                <Select 
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value as '7d' | '30d' | 'year')}
                  className="w-auto min-w-[140px]"
                  options={[
                    { value: "7d", label: t("charts.last7Days") },
                    { value: "30d", label: t("charts.last30Days") },
                    { value: "year", label: t("charts.thisYear") }
                  ]}
                />
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                {!isLoaded ? (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-3 bg-slate-50 rounded-xl border-2 border-slate-200">
                    <Spinner size="lg" />
                    <div className="text-slate-600 text-sm font-medium">{t("charts.loading")}</div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData[timeRange]}>
                      <defs>
                        <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#005bbc" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#005bbc" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#64748b', fontSize: 12 }} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '12px', 
                          border: '2px solid #e2e8f0', 
                          backgroundColor: 'white',
                          padding: '8px 12px'
                        }}
                        labelStyle={{ color: '#1e293b', fontSize: '12px', fontWeight: '600' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="messages" 
                        stroke="#005bbc" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#colorMessages)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                )}
                </div>
              </CardContent>
            </Card>

            {/* Active Agents Table */}
            <Card className="overflow-hidden">
              <CardHeader className="border-b-2 border-slate-200 flex justify-between items-center">
                <h2 className="text-lg font-bold text-slate-900">{t("agents.title")}</h2>
                <Link href="/dashboard/agents" className="text-sm text-[#005bbc] font-medium hover:text-[#004a9f] transition-colors">
                  {t("agents.viewAll")}
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50/50">
                    <tr>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider rtl:text-right">{t("agents.agent")}</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider rtl:text-right">{t("agents.status")}</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider rtl:text-right">{t("agents.conversations")}</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider rtl:text-right">{t("agents.conversion")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {agents.map((agent, idx) => (
                      <AgentRow key={idx} agent={agent} />
                    ))}
                  </tbody>
                </table>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column (Platforms & Activity) */}
          <div className="space-y-6">

             {/* Bookings Card */}
             <Card>
              <CardHeader className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">{t("bookings.title")}</h2>
                <Badge variant="default">{t("bookings.upcoming", {count: bookings.length})}</Badge>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  {bookings.map((booking, idx) => (
                    <BookingItem key={idx} booking={booking} />
                  ))}
                </div>
                <Link href="/dashboard/crm" className="block w-full mt-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-all duration-200 text-center rounded-xl hover:bg-slate-50 border-2 border-transparent hover:border-slate-200">
                  {t("bookings.viewCalendar")}
                </Link>
              </CardContent>
            </Card>
            
            {/* Connected Channels */}
            <Card>
              <CardHeader className="pb-3 border-b-2 border-slate-100">
                <h2 className="text-base font-bold text-slate-900">{t("channels.title")}</h2>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="space-y-1">
                  {platforms.map((platform, idx) => (
                    <PlatformItem key={idx} platform={platform} />
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader className="pb-3 border-b-2 border-slate-100">
                <h2 className="text-base font-bold text-slate-900">{t("activity.title")}</h2>
              </CardHeader>
              <CardContent className="pt-3">
                <div className="space-y-1 max-h-[300px] overflow-y-auto">
                  {activity.map((item, idx) => (
                    <ActivityItem key={idx} item={item} />
                  ))}
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
