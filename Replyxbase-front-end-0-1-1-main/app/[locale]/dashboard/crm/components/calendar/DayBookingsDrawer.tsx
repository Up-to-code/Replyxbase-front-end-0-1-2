import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, Users, MapPin, Trash2 } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import { Booking } from '../../types';
import { StatusBadge } from '../ui/Badges';
import { useOutsideClick } from '../../hooks';
import { DayBookingsSkeleton } from '../skeletons';

/**
 * Props for the DayBookingsDrawer component.
 */
interface DayBookingsDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** The date being viewed */
  date: Date;
  /** List of bookings for the date */
  bookings: Booking[];
  /** Callback when a booking is clicked */
  onBookingClick: (booking: Booking) => void;
  /** Callback when a booking is deleted */
  onDelete: (bookingId: string) => void;
  /** Whether data is loading */
  isLoading?: boolean;
}

/**
 * Drawer component to display all bookings for a specific day.
 */
export const DayBookingsDrawer: React.FC<DayBookingsDrawerProps> = ({ 
  isOpen, 
  onClose, 
  date, 
  bookings, 
  onBookingClick,
  onDelete,
  isLoading = false
}) => {
  const drawerRef = useOutsideClick(onClose);
  const t = useTranslations("Dashboard.CRM.Calendar.Drawer");
  const format = useFormatter();
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] overflow-y-auto rtl:right-auto rtl:left-0 rtl:transform rtl:-scale-x-100 border-l-2 border-slate-200"
          >
            <div className="flex flex-col h-full rtl:transform rtl:-scale-x-100">
              <div className="flex items-center justify-between p-4 border-b-2 border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  {t("title", { date: format.dateTime(date, { weekday: 'long', month: 'long', day: 'numeric' }) })}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 border-2 border-transparent hover:border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                  <DayBookingsSkeleton />
                ) : bookings.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">{t("noBookings")}</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {bookings
                      .sort((a, b) => a.startTime.localeCompare(b.startTime))
                      .map(booking => (
                        <motion.div
                          key={booking.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border-2 border-slate-200 rounded-xl p-4 hover:bg-slate-50 hover:border-slate-300 cursor-pointer transition-all duration-200"
                          onClick={() => onBookingClick(booking)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-slate-900">
                              {booking.customer.fullName}
                            </h3>
                            <StatusBadge status={booking.status} />
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm mb-2">
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock className="w-4 h-4" />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Users className="w-4 h-4" />
                              <span>{t("people", { count: booking.people })}</span>
                            </div>
                          </div>
                          <div className="text-sm text-slate-900">
                            {booking.serviceType}
                            {booking.location && (
                              <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
                                <MapPin className="w-3 h-3" />
                                {booking.location}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-3">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onBookingClick(booking);
                              }}
                              className="flex-1 px-3 py-1.5 bg-[#005bbc] hover:bg-[#004a9f] text-white text-sm rounded-xl font-medium border-2 border-[#005bbc] transition-all duration-200"
                            >
                              {t("viewDetails")}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDelete(booking.id);
                              }}
                              className="px-3 py-1.5 bg-[#EF4444]/10 hover:bg-[#EF4444]/20 text-[#EF4444] text-sm rounded-xl font-medium border-2 border-[#EF4444]/20 hover:border-[#EF4444]/30 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};