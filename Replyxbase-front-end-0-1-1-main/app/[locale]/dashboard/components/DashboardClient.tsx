/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// import { useRouter } from 'next/navigation'; // Not currently used
import {
  MessageSquare,
  Users,
  Bot,
  Zap,
  Calendar,
  Phone,
  Globe,
  Plus,
  UserPlus,
  Clock,
  User
} from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

// ============================================
// ICON MAPPING
// ============================================
const IconMap: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  MessageSquare,
  Users,
  Bot,
  Zap,
  Calendar,
  Globe,
  Phone,
  Clock
};

const BookingItem = ({ booking, showDate = true }: { booking: any, showDate?: boolean }) => {
  const format = useFormatter();
  const date = new Date(booking.date);
  
  return (
    <div className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl hover:border-[#005bbc]/30 transition-all duration-200 bg-white hover:bg-slate-50">
        <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-[#005bbc]/10 rounded-xl border-2 border-[#005bbc]/20 shrink-0 flex items-center justify-center">
          <Calendar className="w-4 h-4 text-[#005bbc]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-900 truncate">{booking.customer}</p>
          <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
             <Clock className="w-3 h-3" />
             {booking.startTime} 
             {showDate && ` • ${format.dateTime(date, { dateStyle: 'medium' })}`}
          </p>
        </div>
      </div>
      <Badge variant={booking.status === 'confirmed' ? 'success' : 'warning'} className="text-xs shrink-0">
        {booking.status}
      </Badge>
    </div>
  );
};



const CustomerItem = ({ customer }: { customer: any }) => {
    return (
        <div className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    {customer.fullName.charAt(0).toUpperCase()}
                </div>
                <div>
                     <p className="text-sm font-medium text-slate-900">{customer.fullName}</p>
                     <p className="text-xs text-slate-500">{customer.email}</p>
                </div>
             </div>
             <Badge variant="outline" className="text-xs">{customer.status}</Badge>
        </div>
    );
};


const StatCard = ({ stat }: { stat: any }) => {
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
      </div>
      <div className="space-y-1">
        <h3 className="text-slate-500 text-xs font-medium uppercase tracking-wide">{stat.label}</h3>
        <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
      </div>
    </Card>
  );
};

const QuickAction = ({ icon: Icon, label, href, onClick }: { icon: any, label: string, href?: string, onClick?: () => void }) => {
    const content = (
        <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-[#005bbc]/30 hover:bg-slate-50 transition-all duration-200 cursor-pointer gap-2 h-full">
            <div className="w-10 h-10 rounded-full bg-[#005bbc]/10 flex items-center justify-center text-[#005bbc]">
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-sm font-medium text-slate-700">{label}</span>
        </div>
    );

    if (href) {
        return <Link href={href} className="block h-full">{content}</Link>;
    }

    return <div onClick={onClick} className="h-full">{content}</div>;
};


// ============================================
// MAIN PAGE COMPONENT
// ============================================

const ScheduleItem = ({ booking, isLast }: { booking: any, isLast: boolean }) => {
    return (
        <div className="flex gap-4 group">
            {/* Time Column */}
            <div className="flex flex-col items-center">
                <div className="w-16 text-right text-sm font-bold text-slate-700 py-3 shrink-0">
                    {booking.startTime}
                </div>
                 {/* Timeline Line */}
                {!isLast && <div className="w-0.5 flex-1 bg-slate-100 group-hover:bg-blue-100 transition-colors my-1"></div>}
            </div>

            {/* Content Card */}
            <div className="flex-1 pb-4">
                 <div className="p-3 sm:p-4 rounded-xl border-2 border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-500/20 hover:shadow-sm hover:translate-x-1 transition-all duration-200 relative">
                     {/* Timeline Dot */}
                    <div className="absolute top-5 -left-[23px] w-3.5 h-3.5 rounded-full border-2 border-white bg-blue-500 shadow-sm ring-1 ring-blue-100"></div>
                    
                    <div className="flex justify-between items-center">
                        <div>
                             <h4 className="font-bold text-slate-900 text-sm">{booking.customer}</h4>
                             <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                                 {booking.type || "General Appointment"}
                             </p>
                        </div>
                        <Badge variant={booking.status === 'confirmed' ? 'success' : 'secondary'} className="text-[10px] uppercase tracking-wider">
                            {booking.status}
                        </Badge>
                    </div>
                 </div>
            </div>
        </div>
    );
};

export default function DashboardClient({ 
  stats, 
  bookings,
  todaysBookings = [],
  recentCustomers = []
}: {
  stats: any[];
  bookings: any[];
  todaysBookings?: any[];
  recentCustomers?: any[];
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const t = useTranslations("Dashboard.Home");

  useEffect(() => {
    // Simulate a quick data fetch for smooth entry
    const timer = setTimeout(() => setIsLoaded(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
            <p className="text-slate-600 mt-1 text-sm">{t("subtitle")}</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
              <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          
          {/* Left Column (Quick Actions) */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <Card>
                <CardHeader className="pb-3 border-b-2 border-slate-100">
                    <h2 className="text-base font-bold text-slate-900">{t("quickActions")}</h2>
                </CardHeader>
                <CardContent className="pt-4">
                    <div className="grid grid-cols-2 gap-3">
                        <QuickAction icon={Calendar} label={t("actions.newBooking")} href="/dashboard/crm?action=new_booking" />
                        <QuickAction icon={UserPlus} label={t("actions.addCustomer")} href="/dashboard/crm/customers/new" />
                        <QuickAction icon={Bot} label={t("actions.createAgent")} href="/dashboard/agents/create" />
                        <QuickAction icon={Plus} label={t("actions.more")} onClick={() => toast.info("More actions coming soon!")} />
                    </div>
                </CardContent>
            </Card>

          </div>

          {/* Right Column (Bookings & Customers) */}
          <div className="lg:col-span-2 space-y-6">
             
             {/* TODAY'S Bookings */}
             <Card>
              <CardHeader className="flex items-center justify-between pb-4 border-b-2 border-slate-100 bg-blue-50/50">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <h2 className="text-lg font-bold text-slate-900">Today's Schedule</h2>
                </div>
                <Badge variant="default" className="bg-blue-600">{todaysBookings.length} Today</Badge>
              </CardHeader>
              <CardContent className="pt-6 pl-2 pr-6">
                {todaysBookings.length > 0 ? (
                    <div>
                    {todaysBookings.map((booking, idx) => (
                        <ScheduleItem key={idx} booking={booking} isLast={idx === todaysBookings.length - 1} />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-8 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
                        <p className="text-slate-500 text-sm font-medium">No bookings scheduled for today.</p>
                        <Button variant="outline" size="sm" className="mt-3" onClick={() => toast.info("Create a booking from calendar")}>
                            Add Booking
                        </Button>
                    </div>
                )}
              </CardContent>
            </Card>

             {/* Upcoming Bookings */}
             <Card>
              <CardHeader className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">{t("bookings.title")}</h2>
                <Link href="/dashboard/crm" className="text-sm text-[#005bbc] hover:underline font-medium">
                    {t("bookings.viewCalendar")}
                </Link>
              </CardHeader>
              <CardContent className="pt-4">
                {bookings.length > 0 ? (
                    <div className="space-y-2">
                    {bookings.map((booking, idx) => (
                        <BookingItem key={idx} booking={booking} />
                    ))}
                    </div>
                ) : (
                    <div className="text-center py-6">
                        <p className="text-slate-500 text-sm">No upcoming bookings found.</p>
                    </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Customers */}
            <Card>
              <CardHeader className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
                <h2 className="text-lg font-bold text-slate-900">New Customers</h2>
                <Link href="/dashboard/crm/customers" className="text-sm text-[#005bbc] hover:underline font-medium">
                    View All
                </Link>
              </CardHeader>
              <CardContent className="pt-0">
                  {recentCustomers.length > 0 ? (
                      <div className="divide-y divide-slate-100">
                          {recentCustomers.map((customer) => (
                              <CustomerItem key={customer.id} customer={customer} />
                          ))}
                      </div>
                  ) : (
                      <div className="py-6 text-center text-slate-500 text-sm">No recent customers.</div>
                  )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}
