'use client';

import React from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Calendar } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  customer: string;
  startTime: string;
  type?: string;
  status: string;
}

interface TodayScheduleWidgetProps {
  bookings: Booking[];
}

const ScheduleItem = ({ booking, isLast }: { booking: Booking; isLast: boolean }) => {
  return (
    <div className="flex gap-4 group">
      <div className="flex flex-col items-center">
        <div className="w-16 text-right text-sm font-bold text-slate-700 py-3 shrink-0">
          {booking.startTime}
        </div>
        {!isLast && (
          <div className="w-0.5 flex-1 bg-slate-100 group-hover:bg-blue-100 transition-colors my-1"></div>
        )}
      </div>
      <div className="flex-1 pb-4">
        <div className="p-3 sm:p-4 rounded-xl border-2 border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-500/20 hover:shadow-sm hover:translate-x-1 transition-all duration-200 relative">
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

export const TodayScheduleWidget: React.FC<TodayScheduleWidgetProps> = ({ bookings }) => {
  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-4 border-b-2 border-slate-100 bg-blue-50/50">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900">Today's Schedule</h2>
        </div>
        <Badge variant="default" className="bg-blue-600">{bookings.length} Today</Badge>
      </CardHeader>
      <CardContent className="pt-6 pl-2 pr-6">
        {bookings.length > 0 ? (
          <div>
            {bookings.map((booking, idx) => (
              <ScheduleItem key={idx} booking={booking} isLast={idx === bookings.length - 1} />
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
  );
};

