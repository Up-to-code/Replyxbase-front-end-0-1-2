import React from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslations, useFormatter } from 'next-intl';
import { Booking, CalendarView } from '../../types';
import { StatusBadge } from '../ui/Badges';
import { generateTimeSlots, getDaysInMonth } from '../../utils';
import { CalendarSkeleton } from '../skeletons';

interface CalendarSwitcherProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const CalendarSwitcher: React.FC<CalendarSwitcherProps> = ({
  currentDate,
  onDateChange,
  view,
  onViewChange
}) => {
  const t = useTranslations("Dashboard.CRM.Calendar");

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    
    switch (view) {
      case 'month':
        newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'day':
        newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
    }
    
    onDateChange(newDate);
  };

  const format = useFormatter();

  const formatHeaderDate = () => {
    switch (view) {
      case 'month':
        return format.dateTime(currentDate, { month: 'long', year: 'numeric' });
      case 'week':
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        return `${format.dateTime(startOfWeek, { month: 'short', day: 'numeric' })} - ${format.dateTime(endOfWeek, { month: 'short', day: 'numeric' })}`;
      case 'day':
        return format.dateTime(currentDate, { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border-b-2 border-slate-200">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-slate-900">{formatHeaderDate()}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigateDate('prev')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200 rtl:rotate-180 border-2 border-transparent hover:border-slate-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDateChange(new Date())}
            className="px-3 py-1 text-sm bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] rounded-xl font-medium transition-all duration-200"
          >
            {t("today")}
          </button>
          <button
            onClick={() => navigateDate('next')}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors duration-200 rtl:rotate-180 border-2 border-transparent hover:border-slate-200"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border-2 border-slate-200">
        {(['month', 'week', 'day'] as CalendarView[]).map((viewType) => (
          <button
            key={viewType}
            onClick={() => onViewChange(viewType)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
              view === viewType
                ? 'bg-white text-slate-900 border-slate-200'
                : 'text-slate-600 hover:text-slate-900 border-transparent'
            }`}
          >
            {t(viewType)}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * Props for the CalendarViewComponent.
 */
interface CalendarViewProps {
  /** List of bookings to display */
  bookings: Booking[];
  /** Callback when a booking is clicked */
  onBookingClick: (booking: Booking) => void;
  /** Callback when a day is clicked */
  onDayClick: (date: Date, bookings: Booking[]) => void;
  /** Currently selected date */
  currentDate: Date;
  /** Callback when date changes */
  onDateChange: (date: Date) => void;
  /** Current calendar view (month, week, day) */
  view: CalendarView;
  /** Callback when view changes */
  onViewChange: (view: CalendarView) => void;
  /** Whether data is loading */
  isLoading?: boolean;
}

/**
 * Displays bookings in a calendar format (month, week, or day view).
 */
export const CalendarViewComponent: React.FC<CalendarViewProps> = ({
  bookings,
  onBookingClick,
  onDayClick,
  currentDate,
  onDateChange,
  view,
  onViewChange,
  isLoading = false
}) => {
  const t = useTranslations("Dashboard.CRM.Calendar");
  
  const getBookingsForDate = (date: Date): Booking[] => {
    return bookings.filter(booking => 
      booking.date.toDateString() === date.toDateString()
    );
  };

  const getWeekDays = (): Date[] => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
    const days = [];
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  if (isLoading) {
    return <CalendarSkeleton />;
  }

  return (
    <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 mx-4">
      <CalendarSwitcher
        currentDate={currentDate}
        onDateChange={onDateChange}
        view={view}
        onViewChange={onViewChange}
      />
      
      {view === 'month' && (
        <>
          {/* Week Days Header */}
          <div className="grid grid-cols-7 gap-1 mb-2 p-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center">
                <span className="text-sm font-medium text-slate-500">{day}</span>
              </div>
            ))}
          </div>
          
          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 p-4 pt-0">
            {getDaysInMonth(currentDate).map((date, index) => {
              const dayBookings = getBookingsForDate(date);
              const isCurrentMonth = date.getMonth() === currentDate.getMonth();
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div
                  key={index}
                  className={`min-h-[100px] border-2 p-2 cursor-pointer transition-all duration-200 rounded-xl ${
                    isCurrentMonth 
                      ? 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300' 
                      : 'bg-slate-50 border-slate-200 text-slate-400'
                  } ${
                    isToday ? 'border-[#005bbc] ring-2 ring-[#005bbc]/20' : ''
                  }`}
                  onClick={() => onDayClick(date, dayBookings)}
                >
                  <div className={`text-sm font-medium mb-1 ${
                    isToday ? 'text-[#005bbc]' : 'text-slate-900'
                  }`}>
                    {date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayBookings.slice(0, 3).map(booking => (
                      <div
                        key={booking.id}
                        className={`text-xs p-1 rounded truncate border-2 ${
                          booking.status === 'confirmed' 
                            ? 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20' 
                            : booking.status === 'pending'
                            ? 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20'
                            : booking.status === 'cancelled'
                            ? 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/20'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onBookingClick(booking);
                        }}
                      >
                        {booking.startTime} - {booking.customer.fullName}
                      </div>
                    ))}
                    {dayBookings.length > 3 && (
                      <div className="text-xs text-slate-500 text-center">
                        {t("more", { count: dayBookings.length - 3 })}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      
      {view === 'week' && (
        <div className="p-4">
          <div className="grid grid-cols-7 gap-4">
            {getWeekDays().map((date, index) => {
              const dayBookings = getBookingsForDate(date);
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <div key={index} className="min-h-[500px]">
                  <div className={`text-center mb-2 p-2 border-2 rounded-xl ${
                    isToday ? 'bg-[#005bbc] text-white border-[#005bbc]' : 'border-transparent'
                  }`}>
                    <div className="text-sm font-medium">
                      {format.dateTime(date, { weekday: 'short' })}
                    </div>
                    <div className="text-lg font-semibold">
                      {date.getDate()}
                    </div>
                  </div>
                  <div className="space-y-2">
                    {dayBookings.map(booking => (
                      <div
                        key={booking.id}
                        className={`p-2 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                          booking.status === 'confirmed' 
                            ? 'border-[#10B981]/20 bg-[#10B981]/10 hover:bg-[#10B981]/20' 
                            : booking.status === 'pending'
                            ? 'border-[#F59E0B]/20 bg-[#F59E0B]/10 hover:bg-[#F59E0B]/20'
                            : booking.status === 'cancelled'
                            ? 'border-[#EF4444]/20 bg-[#EF4444]/10 hover:bg-[#EF4444]/20'
                            : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                        }`}
                        onClick={() => onBookingClick(booking)}
                      >
                        <div className="text-sm font-medium truncate text-slate-900">
                          {booking.startTime}
                        </div>
                        <div className="text-xs text-slate-600 truncate">
                          {booking.customer.fullName}
                        </div>
                        <div className="text-xs text-slate-500">
                          {booking.serviceType}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {view === 'day' && (
        <div className="p-4">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {format.dateTime(currentDate, { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
            </div>
            <div className="space-y-4">
              {generateTimeSlots().map(time => {
                const timeBookings = bookings.filter(booking => 
                  booking.date.toDateString() === currentDate.toDateString() &&
                  booking.startTime === time
                );
                
                if (timeBookings.length === 0) return null;
                
                return (
                  <div key={time} className="flex gap-4">
                    <div className="w-20 text-sm font-medium text-slate-500 pt-2">
                      {time}
                    </div>
                    <div className="flex-1 space-y-2">
                      {timeBookings.map(booking => (
                        <div 
                          key={booking.id}
                          className="p-3 rounded-xl border-2 border-slate-200 hover:border-slate-300 transition-colors cursor-pointer bg-white"
                          onClick={() => onBookingClick(booking)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-medium text-slate-900">{booking.customer.fullName}</div>
                              <div className="text-xs text-slate-500">{booking.customer.phone}</div>
                            </div>
                            <StatusBadge status={booking.status} />
                          </div>
                          <div className="text-sm text-slate-600 mt-1">
                            {booking.serviceType} • {booking.duration}min
                          </div>
                          {booking.location && (
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {booking.location}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};