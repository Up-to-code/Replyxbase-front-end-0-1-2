import React from 'react';
import { useRouter } from 'next/navigation';
import { 
  X, 
  MessageSquare, 
  Phone, 
  Mail, 
  Building, 
  Edit2, 
  Trash2, 
  UserCheck,
  MapPin,
  Tag,
  Calendar,
  Clock,
  Users,
  Briefcase,
  AlertCircle,
  Star
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Booking } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/Badges';
import { Rating } from '../ui/Rating';
import { ActivityLog } from '../activities/ActivityLog';
import { ActivityForm } from '../activities/ActivityForm';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { motion, AnimatePresence } from 'framer-motion';
import { BookingDetailsSkeleton } from '../skeletons';

/**
 * Props for the BookingDetailsDrawer component.
 */
interface BookingDetailsDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** Callback to edit the booking */
  onEdit: (booking: Booking) => void;
  /** Callback to delete the booking */
  onDelete: (bookingId: string) => void;
  /** The booking to display */
  booking?: Booking;
  /** Whether data is loading */
  isLoading?: boolean;
  /** Callback to add an activity */
  onAddActivity?: (type: 'call' | 'email' | 'note' | 'meeting', content: string, relatedTo: 'booking' | 'customer', relatedId: string) => Promise<void>;
}

/**
 * Drawer component to display detailed information about a booking.
 * Positioned with high z-index to appear above sidebar and header.
 */
export const BookingDetailsDrawer: React.FC<BookingDetailsDrawerProps> = ({ 
  isOpen, 
  onClose, 
  onEdit, 
  onDelete,
  booking,
  isLoading = false,
  onAddActivity
}) => {
  const drawerRef = useOutsideClick(onClose);
  const router = useRouter();
  const t = useTranslations("Dashboard.CRM.Bookings.Details");
  
  if (!booking && !isLoading) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with high z-index */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          
          {/* Minimal Drawer with highest z-index */}
          <motion.div
            ref={drawerRef}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-screen w-full max-w-2xl bg-white z-[101] rtl:right-auto rtl:left-0 rtl:transform rtl:-scale-x-100 border-l-2 border-slate-200"
          >
            <div className="rtl:transform rtl:-scale-x-100 h-full flex flex-col">
              {isLoading ? (
                <BookingDetailsSkeleton />
              ) : booking ? (
                <>
                  {/* Sticky Header */}
                  <div className="flex items-center justify-between px-6 py-4 border-b-2 border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <h2 className="text-lg font-bold text-slate-900 truncate">{booking.customer.fullName}</h2>
                        <StatusBadge status={booking.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {booking.date.toLocaleDateString()}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-4">
                      <button
                        onClick={() => {
                          if (booking) {
                             router.push(`/dashboard/inbox?customerId=${booking.customer.id}`);
                          }
                        }}
                        className="p-2 text-slate-400 hover:text-[#005bbc] hover:bg-[#005bbc]/10 rounded-lg transition-colors border-2 border-transparent hover:border-[#005bbc]/20"
                        title={t("chatTooltip")}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(booking)}
                        className="p-2 text-slate-400 hover:text-[#005bbc] hover:bg-[#005bbc]/10 rounded-lg transition-colors border-2 border-transparent hover:border-[#005bbc]/20"
                        title={t("editTooltip")}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(booking.id)}
                        className="p-2 text-slate-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors border-2 border-transparent hover:border-[#EF4444]/20"
                        title={t("deleteTooltip")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="w-px h-6 bg-slate-200 mx-1" />
                      <button
                        onClick={onClose}
                        className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors border-2 border-transparent hover:border-slate-200"
                        title={t("closeTooltip")}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Key Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl bg-slate-50/50 border-2 border-slate-200 space-y-3">
                        <div className="flex items-center gap-2 text-slate-900 font-medium text-sm">
                          <UserCheck className="w-4 h-4 text-slate-400" />
                          {t("customerDetails")}
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            <span className="truncate">{booking.customer.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{booking.customer.phone}</span>
                          </div>
                          {booking.customer.company && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Building className="w-3.5 h-3.5 text-slate-400" />
                              <span>{booking.customer.company}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 rounded-xl bg-slate-50/50 border-2 border-slate-200 space-y-3">
                        <div className="flex items-center gap-2 text-slate-900 font-medium text-sm">
                          <Briefcase className="w-4 h-4 text-slate-400" />
                          {t("bookingInfo")}
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">{t("serviceType")}</span>
                            <span className="font-medium text-slate-900">{booking.serviceType}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">{t("duration")}</span>
                            <span className="font-medium text-slate-900">{booking.duration} {t("minutes")}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-500">{t("people")}</span>
                            <span className="font-medium text-slate-900 flex items-center gap-1">
                              <Users className="w-3 h-3 text-slate-400" />
                              {booking.people}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Details */}
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-3 rounded-xl border-2 border-slate-200 bg-white">
                        <p className="text-xs text-slate-500 mb-1">{t("priority")}</p>
                        <PriorityBadge priority={booking.priority} />
                      </div>
                      <div className="p-3 rounded-xl border-2 border-slate-200 bg-white">
                        <p className="text-xs text-slate-500 mb-1">{t("rating")}</p>
                        <Rating rating={booking.rating || 0} />
                      </div>
                      {booking.location && (
                        <div className="p-3 rounded-xl border-2 border-slate-200 bg-white">
                          <p className="text-xs text-slate-500 mb-1">{t("location")}</p>
                          <div className="flex items-center gap-1 text-sm font-medium text-slate-900 truncate">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {booking.location}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes & Special Requests */}
                    <div className="space-y-4">
                      {booking.specialRequests && (
                        <div className="p-4 rounded-xl bg-[#F59E0B]/10 border-2 border-[#F59E0B]/20">
                          <h4 className="text-sm font-medium text-[#F59E0B] mb-2 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" />
                            {t("specialRequests")}
                          </h4>
                          <p className="text-sm text-slate-700 leading-relaxed">
                            {booking.specialRequests}
                          </p>
                        </div>
                      )}

                      {booking.notes && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("internalNotes")}</h4>
                          <p className="text-sm text-slate-600 bg-slate-50 p-4 rounded-xl border-2 border-slate-200 leading-relaxed">
                            {booking.notes}
                          </p>
                        </div>
                      )}

                      {/* Tags */}
                      {booking.tags && booking.tags.length > 0 && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t("tags")}</h4>
                          <div className="flex flex-wrap gap-2">
                            {booking.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border-2 border-slate-200 text-slate-600 rounded-lg text-xs font-medium"
                              >
                                <Tag className="w-3 h-3 text-slate-400" />
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Activities Section */}
                    <div className="border-t-2 border-slate-200 pt-8">
                      <h4 className="text-sm font-semibold text-slate-900 mb-6 uppercase tracking-wider">{t("activityLog")}</h4>
                      <div className="mb-8">
                        <ActivityForm 
                          onSubmit={async (type, content) => {
                            if (onAddActivity && booking) {
                              await onAddActivity(type, content, 'booking', booking.id);
                            }
                          }} 
                        />
                      </div>
                      <ActivityLog activities={booking.activities || []} />
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};