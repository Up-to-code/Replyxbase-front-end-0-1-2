'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import {
  StatsWidget,
  BookingsWidget,
  CustomersWidget,
  AgentsWidget,
  QuickActionsWidget,
  CalendarWidget
} from './widgets';

interface Stat {
  id: string;
  label: string;
  value: string | number;
  icon: string;
  color: 'blue' | 'green' | 'purple' | 'orange';
}

interface Booking {
  customer: string;
  date: Date | string;
  startTime: string;
  type?: string;
  status: string;
}

interface Customer {
  id: string;
  fullName: string;
  email: string;
  status: string;
}

interface Agent {
  id: string;
  name: string;
  role?: string;
  status: string;
  avatar?: string;
  isWebsiteEnabled?: boolean;
  isWhatsappEnabled?: boolean;
  isDmEnabled?: boolean;
}

interface DashboardClientProps {
  stats: Stat[];
  bookings: Booking[];
  recentCustomers?: Customer[];
  agents?: Agent[];
  monthBookingDates?: number[];
}

export default function DashboardClient({
  stats,
  bookings,
  recentCustomers = [],
  agents = [],
  monthBookingDates = []
}: DashboardClientProps) {
  const t = useTranslations("Dashboard.Home");

  return (
    <div className="min-h-screen bg-white p-4 sm:p-6 lg:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 lg:space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
            <p className="text-slate-600 mt-1 text-sm">{t("subtitle")}</p>
          </div>
        </div>

        <StatsWidget stats={stats} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
          <div className="space-y-6">
            <QuickActionsWidget />
            <CalendarWidget bookingsCount={bookings.length} bookingDates={monthBookingDates} />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <BookingsWidget bookings={bookings} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomersWidget customers={recentCustomers} />
              <AgentsWidget agents={agents} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

