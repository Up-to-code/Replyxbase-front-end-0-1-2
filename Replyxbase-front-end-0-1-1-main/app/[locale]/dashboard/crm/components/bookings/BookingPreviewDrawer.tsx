'use client';

import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Phone, Mail, ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import { Booking } from '../../types';
import { useTranslations, useFormatter } from 'next-intl';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useRouter } from 'next/navigation';

interface BookingPreviewDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  booking: Booking | null;
  onEdit?: (booking: Booking) => void;
  onReschedule?: (booking: Booking) => void;
}

export const BookingPreviewDrawer: React.FC<BookingPreviewDrawerProps> = ({
  isOpen,
  onClose,
  booking,
  onEdit,
  onReschedule
}) => {
  const drawerRef = useOutsideClick(onClose);
  const router = useRouter();
  const format = useFormatter();
  const t = useTranslations("Dashboard.CRM.Preview"); // Assuming new or existing keys

  if (!booking) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] overflow-y-auto rtl:right-auto rtl:left-0 rtl:transform rtl:-scale-x-100 border-l border-slate-200"
          >
             <div className="flex flex-col h-full rtl:transform rtl:-scale-x-100">
               {/* Header */}
               <div className="p-6 border-b border-slate-100">
                 <div className="flex items-start justify-between mb-4">
                   <div className="flex-1">
                     <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${
                            booking.status === 'confirmed' ? 'bg-green-500' : 
                            booking.status === 'pending' ? 'bg-amber-500' :
                            booking.status === 'cancelled' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <span className="text-xs font-bold uppercase text-slate-500 tracking-wider ">{booking.status}</span>
                     </div>
                     <h2 className="text-xl font-bold text-slate-900 mb-1 line-clamp-2">
                       {booking.customer.fullName}
                     </h2>
                     <p className="text-sm text-slate-500 font-medium">
                       {booking.serviceType}
                     </p>
                   </div>
                   <button
                     onClick={onClose}
                     className="p-2 -mr-2 -mt-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-600"
                   >
                     <X className="w-5 h-5" />
                   </button>
                 </div>

                 <div className="flex items-center gap-2 mt-4">
                    <button
                        onClick={() => {
                            router.push(`/dashboard/crm/bookings/${booking.id}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#005bbc] text-white text-sm font-semibold rounded-lg hover:bg-[#004a9f] transition-colors active:transform active:scale-[0.98]"
                    >
                        View Full Details
                        <ArrowRight className="w-4 h-4" />
                    </button>
                    {onEdit && (
                         <button
                            onClick={() => {
                                onEdit(booking);
                                onClose();
                            }}
                            className="px-4 py-2.5 bg-white text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Edit
                        </button>
                    )}
                    {onReschedule && (
                         <button
                            onClick={() => {
                                onReschedule(booking);
                                onClose();
                            }}
                            className="px-4 py-2.5 bg-white text-slate-600 border border-slate-200 text-sm font-semibold rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Calendar className="w-4 h-4" />
                        </button>
                    )}
                 </div>
               </div>

               {/* Content */}
               <div className="flex-1 overflow-y-auto p-6 space-y-8">
                 
                 {/* Quick Info */}
                 <div className="grid grid-cols-2 gap-4">
                   <div className="p-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-colors">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Date</div>
                     <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                       <Calendar className="w-4 h-4 text-[#005bbc]" />
                       {format.dateTime(new Date(booking.date), { year: 'numeric', month: 'long', day: 'numeric' })}
                     </div>
                   </div>
                   <div className="p-4 bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-colors">
                     <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Time</div>
                     <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
                       <Clock className="w-4 h-4 text-[#005bbc]" />
                       {booking.startTime}
                     </div>
                   </div>
                 </div>

                 {/* Customer */}
                 <div>
                    <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-slate-400" />
                        Customer Info
                    </h3>
                    <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                                {booking.customer.fullName.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-bold text-slate-900 truncate">
                                    {booking.customer.fullName}
                                </div>
                                {booking.customer.company && (
                                    <div className="text-xs text-slate-500 truncate font-medium">
                                        {booking.customer.company}
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex gap-2 pt-2 border-t border-slate-50">
                            {booking.customer.phone && (
                                <a 
                                    href={`tel:${booking.customer.phone}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <Phone className="w-3.5 h-3.5" />
                                    Call
                                </a>
                            )}
                            {booking.customer.email && (
                                <a 
                                    href={`mailto:${booking.customer.email}`}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-700 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <Mail className="w-3.5 h-3.5" />
                                    Email
                                </a>
                            )}
                        </div>
                    </div>
                 </div>

                 {/* Location & Priority */}
                 <div className="space-y-4">
                    {booking.location && (
                        <div>
                             <h3 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                Location
                            </h3>
                            <p className="text-sm text-slate-600 ml-6 font-medium">
                                {booking.location}
                            </p>
                        </div>
                    )}
                    
                    <div className="flex items-center justify-between py-3 border-t border-slate-100">
                        <span className="text-sm text-slate-500 font-bold">Priority</span>
                        <div className="text-sm font-bold text-slate-900 capitalize px-2 py-0.5 bg-slate-100 rounded-md">
                            {booking.priority}
                        </div>
                    </div>
                 </div>

                 {/* Notes Preview */}
                 {booking.notes && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Internal Note</div>
                        <p className="text-sm text-slate-600 line-clamp-3 font-medium">
                            {booking.notes}
                        </p>
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
