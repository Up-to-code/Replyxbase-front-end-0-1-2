'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFormatter } from 'next-intl';

interface CalendarWidgetProps {
  currentDate?: Date;
  bookingsCount?: number;
  bookingDates?: number[];
  viewLink?: string;
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({ 
  currentDate = new Date(),
  bookingsCount = 0,
  bookingDates = [],
  viewLink = "/dashboard/crm"
}) => {
  const format = useFormatter();
  const [date, setDate] = React.useState(currentDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
    setDate(newDate);
  };

  const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const monthName = format.dateTime(date, { month: 'long', year: 'numeric' });

  const days = Array(firstDayOfMonth).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-[#005bbc]" />
          <h2 className="text-lg font-bold text-slate-900">Calendar</h2>
        </div>
        {viewLink && (
          <Link href={viewLink} className="text-sm text-[#005bbc] hover:underline font-medium">
            View Full
          </Link>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-bold text-slate-900">{monthName}</h3>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-1">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-xs font-medium text-slate-500 py-2">
                {day}
              </div>
            ))}
            {days.map((day, idx) => {
              if (day === null) {
                return <div key={idx} />;
              }

              const today = new Date();
              const isToday = day === today.getDate() && 
                            date.getMonth() === today.getMonth() && 
                            date.getFullYear() === today.getFullYear();
              const hasBooking = bookingDates.includes(day);
              const bookingCount = bookingDates.filter(d => d === day).length;
              
              return (
                <div
                  key={idx}
                  className={`aspect-square flex items-center justify-center text-sm rounded-lg relative ${
                    isToday
                      ? 'bg-[#005bbc] text-white font-bold'
                      : hasBooking
                      ? 'bg-[#005bbc]/10 text-[#005bbc] font-medium hover:bg-[#005bbc]/20 border border-[#005bbc]/20'
                      : 'hover:bg-slate-100 text-slate-700'
                  }`}
                  title={hasBooking ? `${bookingCount} booking(s)` : undefined}
                >
                  {day}
                  {hasBooking && !isToday && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#005bbc]" />
                  )}
                </div>
              );
            })}
          </div>
          {bookingsCount > 0 && (
            <div className="pt-2 border-t border-slate-100">
              <p className="text-sm text-slate-600 text-center">
                <span className="font-medium">{bookingsCount}</span> bookings this month
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

