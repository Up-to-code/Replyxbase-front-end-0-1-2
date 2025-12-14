'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Calendar, Clock } from 'lucide-react';
import { useFormatter } from 'next-intl';

interface Booking {
  customer: string;
  date: Date | string;
  startTime: string;
  type?: string;
  status: string;
}

interface BookingsWidgetProps {
  bookings: Booking[];
  title?: string;
  viewAllLink?: string;
  maxItems?: number;
}

export const BookingsWidget: React.FC<BookingsWidgetProps> = ({ 
  bookings, 
  title = "Upcoming Bookings",
  viewAllLink = "/dashboard/crm",
  maxItems = 10
}) => {
  const format = useFormatter();
  
  // Filter and sort bookings to ensure they're truly upcoming
  const sortedBookings = [...bookings]
    .filter(booking => {
      const date = typeof booking.date === 'string' ? new Date(booking.date) : booking.date;
      return date >= new Date() && ['pending', 'confirmed'].includes(booking.status);
    })
    .sort((a, b) => {
      const dateA = typeof a.date === 'string' ? new Date(a.date) : a.date;
      const dateB = typeof b.date === 'string' ? new Date(b.date) : b.date;
      if (dateA.getTime() !== dateB.getTime()) {
        return dateA.getTime() - dateB.getTime();
      }
      return a.startTime.localeCompare(b.startTime);
    });
  
  const displayBookings = sortedBookings.slice(0, maxItems);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-sm text-[#005bbc] hover:underline font-medium">
            View All
          </Link>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {displayBookings.length > 0 ? (
          <div className="space-y-2">
            {displayBookings.map((booking, idx) => {
              const date = typeof booking.date === 'string' ? new Date(booking.date) : booking.date;
              const uniqueKey = `${booking.customer}-${booking.date}-${booking.startTime}-${idx}`;
              return (
                <div 
                  key={uniqueKey} 
                  className="flex items-center justify-between p-3 border-2 border-slate-200 rounded-xl hover:border-[#005bbc]/30 transition-all duration-200 bg-white hover:bg-slate-50"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-10 h-10 bg-[#005bbc]/10 rounded-xl border-2 border-[#005bbc]/20 shrink-0 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-[#005bbc]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{booking.customer}</p>
                      <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {booking.startTime} • {format.dateTime(date, { dateStyle: 'medium' })}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant={booking.status === 'confirmed' ? 'success' : 'warning'} 
                    className="text-xs shrink-0"
                  >
                    {booking.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-slate-500 text-sm">No upcoming bookings found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

