import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslations, useFormatter } from 'next-intl';
import { Booking, CalendarView } from '../../types';
import { generateTimeSlots, getDaysInMonth } from '../../utils';
import { CalendarSkeleton } from '../skeletons';

// Event color palette based on different categories
const EVENT_COLORS = [
  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' },
  { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' },
  { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' },
  { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-500' },
  { bg: 'bg-cyan-100', text: 'text-cyan-700', dot: 'bg-cyan-500' },
];

const getEventColor = (serviceType: string) => {
  const hash = serviceType.split('').reduce((acc, char) => char.charCodeAt(0) + acc, 0);
  return EVENT_COLORS[hash % EVENT_COLORS.length];
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'confirmed': return { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-500' };
    case 'pending': return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500' };
    case 'completed': return { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-500' };
    case 'cancelled': return { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-500' };
    default: return { bg: 'bg-slate-100', text: 'text-slate-700', dot: 'bg-slate-500' };
  }
};

interface CalendarViewProps {
  bookings: Booking[];
  onBookingClick: (booking: Booking) => void;
  onDayClick: (date: Date, bookings: Booking[]) => void;
  onAddBooking: () => void;
  currentDate: Date;
  onDateChange: (date: Date) => void;
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
  isLoading?: boolean;
}

type FilterTab = 'all' | 'confirmed' | 'pending' | 'completed';

export const CalendarViewComponent: React.FC<CalendarViewProps> = ({
  bookings,
  onBookingClick,
  onDayClick,
  onAddBooking,
  currentDate,
  onDateChange,
  view,
  onViewChange,
  isLoading = false
}) => {
  const t = useTranslations("Dashboard.CRM.Calendar");
  const format = useFormatter();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const filteredBookings = React.useMemo(() => {
    return activeFilter === 'all' 
      ? bookings 
      : bookings.filter(b => b.status === activeFilter);
  }, [bookings, activeFilter]);

  const getBookingsForDate = (date: Date): Booking[] => {
    return filteredBookings.filter(booking => 
      booking.date.toDateString() === date.toDateString()
    );
  };

  const getWeekDays = (): Date[] => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay() || 7;
    if (day !== 1) startOfWeek.setHours(-24 * (day - 1));
    startOfWeek.setHours(0,0,0,0);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    switch (view) {
      case 'month': newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1)); break;
      case 'week': newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7)); break;
      case 'day': newDate.setDate(newDate.getDate() + (direction === 'next' ? 1 : -1)); break;
    }
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const getMonthRange = () => {
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    return `${format.dateTime(firstDay, { month: 'short', day: 'numeric', year: 'numeric' })} - ${format.dateTime(lastDay, { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: t('allEvents') },
    { id: 'confirmed', label: t('confirmed') },
    { id: 'pending', label: t('pending') },
    { id: 'completed', label: t('completed') },
  ];

  if (isLoading) return <CalendarSkeleton />;

  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Top Header with Title and Search */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={t('search')}
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20 focus:border-[#005bbc] w-64"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 px-6 py-3 border-b border-slate-100 bg-slate-50/50">
        {filterTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === tab.id
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        {/* Date Picker */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 bg-slate-100 rounded-xl px-4 py-2">
            <div className="text-center">
              <div className="text-xs font-bold text-slate-500 uppercase">
                {format.dateTime(currentDate, { month: 'short' })}
              </div>
              <div className="text-2xl font-bold text-slate-900">
                {currentDate.getDate()}
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300" />
            <div className="text-sm text-slate-600">
              {getMonthRange()}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => navigateDate('prev')} 
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <ChevronLeft className="w-4 h-4 text-slate-600" />
            </button>
            <button 
              onClick={() => navigateDate('next')} 
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
            >
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          </div>

          <button 
            onClick={goToToday}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
          >
            {t('today')}
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {/* View Toggle Dropdown */}
          <select
            value={view}
            onChange={(e) => onViewChange(e.target.value as CalendarView)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20 cursor-pointer"
          >
            <option value="month">{t('month')} view</option>
            <option value="week">{t('week')} view</option>
            <option value="day">{t('day')} view</option>
          </select>

          <button 
            onClick={onAddBooking} 
            className="bg-[#005bbc] hover:bg-[#004a9f] text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 shadow-sm shadow-blue-200"
          >
            <Plus className="w-4 h-4" />
            {t('quickAdd')}
          </button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {view === 'month' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex flex-col"
            >
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-slate-100">
                {['Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                  <div key={d} className="py-3 px-4 text-sm font-medium text-slate-500 text-center">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 flex-1 auto-rows-fr">
                {getDaysInMonth(currentDate).map((date, i) => {
                  const dayBookings = getBookingsForDate(date);
                  const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <div 
                      key={i} 
                      onClick={() => onDayClick(date, dayBookings)}
                      className={`
                        p-2 border-b border-r border-slate-100 transition-all cursor-pointer flex flex-col min-h-[120px]
                        ${!isCurrentMonth && 'bg-slate-50/50'}
                        hover:bg-slate-50
                      `}
                    >
                      <div className="mb-2">
                        <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${
                          isToday 
                            ? 'bg-[#005bbc] text-white' 
                            : isCurrentMonth 
                              ? 'text-slate-900' 
                              : 'text-slate-400'
                        }`}>
                          {date.getDate()}
                        </span>
                      </div>
                      
                      <div className="flex flex-col gap-1 overflow-hidden">
                        {dayBookings.slice(0, 3).map(b => {
                          const colors = getStatusColor(b.status);
                          return (
                            <div 
                              key={b.id} 
                              onClick={(e) => { e.stopPropagation(); onBookingClick(b); }}
                              className={`text-xs px-2 py-1 rounded-md ${colors.bg} ${colors.text} cursor-pointer hover:opacity-80 transition-opacity`}
                            >
                              <div className="font-medium truncate">{b.customer.fullName}</div>
                              <div className="text-[10px] opacity-75">{b.startTime}</div>
                            </div>
                          );
                        })}
                        {dayBookings.length > 3 && (
                          <div className="text-xs text-slate-400 font-medium pl-1">
                            {t('more', { count: dayBookings.length - 3 })}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {view === 'week' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-7 h-full divide-x divide-slate-100"
            >
              {getWeekDays().map((date, i) => {
                const dayBookings = getBookingsForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();
                return (
                  <div key={i} className={`flex flex-col h-full ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
                    <div className="p-4 border-b border-slate-100 text-center">
                      <div className="text-xs font-medium uppercase text-slate-500 mb-1">
                        {format.dateTime(date, { weekday: 'short' })}
                      </div>
                      <div className={`text-xl font-bold mx-auto w-9 h-9 flex items-center justify-center rounded-full ${
                        isToday ? 'bg-[#005bbc] text-white' : 'text-slate-900'
                      }`}>
                        {date.getDate()}
                      </div>
                    </div>
                    <div className="flex-1 p-2 space-y-2 overflow-y-auto">
                      {dayBookings.map(b => {
                        const colors = getStatusColor(b.status);
                        return (
                          <div 
                            key={b.id} 
                            onClick={() => onBookingClick(b)} 
                            className={`p-3 rounded-lg cursor-pointer transition-all hover:opacity-90 ${colors.bg} ${colors.text}`}
                          >
                            <div className="text-xs font-medium opacity-75">{b.startTime}</div>
                            <div className="text-sm font-semibold line-clamp-1">{b.customer.fullName}</div>
                            <div className="text-xs opacity-75 mt-1">{b.serviceType}</div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {view === 'day' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col h-full bg-white"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-center bg-slate-50/30">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-1">
                    {format.dateTime(currentDate, { weekday: 'long' })}
                  </div>
                  <div className="text-slate-500 font-medium">
                    {format.dateTime(currentDate, { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-3 max-w-4xl mx-auto w-full">
                {generateTimeSlots().map(time => {
                  const timeBookings = filteredBookings.filter(b => 
                    b.date.toDateString() === currentDate.toDateString() &&
                    b.startTime === time
                  );
                  
                  if (timeBookings.length === 0) return (
                    <div key={time} className="flex gap-4 py-1 group">
                      <div className="w-16 text-right pt-1 text-sm font-medium text-slate-300 group-hover:text-slate-400 transition-colors">
                        {time}
                      </div>
                      <div className="flex-1 border-t border-slate-100 mt-3" />
                    </div>
                  );
                  
                  return (
                    <div key={time} className="flex gap-4">
                      <div className="w-16 text-right pt-1 text-sm font-medium text-slate-600">{time}</div>
                      <div className="flex-1 space-y-2">
                        {timeBookings.map(b => {
                          const colors = getStatusColor(b.status);
                          return (
                            <div 
                              key={b.id} 
                              onClick={() => onBookingClick(b)} 
                              className={`flex gap-4 p-4 rounded-xl transition-all cursor-pointer hover:opacity-95 ${colors.bg} ${colors.text}`}
                            >
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-1">
                                  <h4 className="font-semibold">{b.customer.fullName}</h4>
                                  <span className="text-xs font-medium opacity-75 uppercase">{b.status}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm opacity-80">
                                  <span>{b.serviceType}</span>
                                  <span>•</span>
                                  <span>{b.duration} mins</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};