'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, Phone, Mail, Building, Edit2, Trash2, UserCheck,
  MapPin, Tag, Calendar, Clock, Users, Briefcase, AlertCircle
} from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Booking, BookingFormData } from '../../types';
import { StatusBadge, PriorityBadge } from '../ui/Badges';
import { Rating } from '../ui/Rating';
import { ActivityLog } from '../activities/ActivityLog';
import { ActivityForm } from '../activities/ActivityForm';
import { BookingFormDrawer } from './BookingFormDrawer';
import { DeleteConfirmationModal } from './DeleteConfirmationModal';
import { updateBooking, deleteBooking, rescheduleBooking } from '@/app/actions/crm/bookings';
import { RescheduleModal } from './RescheduleModal';

interface BookingDetailsProps {
  booking: Booking;
  onAddActivity?: (type: 'call' | 'email' | 'note' | 'meeting', content: string, relatedTo: 'booking' | 'customer', relatedId: string, scheduledAt?: Date) => Promise<void>;
}

export const BookingDetails: React.FC<BookingDetailsProps> = ({ 
  booking: initialBooking, 
  onAddActivity 
}) => {
  const t = useTranslations("Dashboard.CRM.Bookings.Details");
  const format = useFormatter();
  const router = useRouter();
  
  const [booking, setBooking] = useState(initialBooking);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync internal state if prop changes (e.g. revalidation)
  React.useEffect(() => {
    setBooking(initialBooking);
  }, [initialBooking]);

  const handleEdit = async (formData: BookingFormData) => {
    setIsSubmitting(true);
    try {
      const result = await updateBooking(booking.id, formData);
      if (result.success && result.booking) {
        setBooking(result.booking);
        setIsEditOpen(false);
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to update booking:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBooking(booking.id);
      router.push('/dashboard/crm');
      router.refresh();
    } catch (error) {
      console.error('Failed to delete booking:', error);
    }
  };

  const handleReschedule = async (date: Date, time: string) => {
    setIsSubmitting(true);
    try {
        const result = await rescheduleBooking(booking.id, date, time);
        if (result.success && result.booking) {
            setBooking(result.booking as unknown as Booking); // Safety cast if needed
            setIsRescheduleOpen(false);
            router.refresh();
        }
    } catch (error) {
        console.error('Failed to reschedule:', error);
    } finally {
        setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-6 border-b-2 border-slate-200 bg-slate-50/50 gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-slate-900 truncate">{booking.customer.fullName}</h1>
            <StatusBadge status={booking.status} />
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {format.dateTime(new Date(booking.date), { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              {booking.startTime} - {booking.endTime}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
             onClick={() => router.push(`/dashboard/inbox?customerId=${booking.customer.id}`)}
             className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border-2 border-slate-200 hover:border-[#005bbc] hover:text-[#005bbc] rounded-xl transition-colors flex items-center gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            {t("chatTooltip")}
          </button>
          
          <button
            onClick={() => setIsRescheduleOpen(true)}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border-2 border-slate-200 hover:border-[#F59E0B] hover:text-[#F59E0B] rounded-xl transition-colors flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Reschedule
          </button>

          <button
            onClick={() => setIsEditOpen(true)}
            className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border-2 border-slate-200 hover:border-[#005bbc] hover:text-[#005bbc] rounded-xl transition-colors flex items-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            {t("editTooltip")}
          </button>
        
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="px-4 py-2 text-sm font-medium text-white bg-[#EF4444] border-2 border-[#EF4444] hover:bg-[#DC2626] rounded-xl transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {t("deleteTooltip")}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Key Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-5 rounded-xl bg-slate-50/50 border-2 border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <UserCheck className="w-5 h-5 text-slate-400" />
              {t("customerDetails")}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{booking.customer.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{booking.customer.phone}</span>
              </div>
              {booking.customer.company && (
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Building className="w-4 h-4 text-slate-400" />
                  <span>{booking.customer.company}</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-50/50 border-2 border-slate-200 space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Briefcase className="w-5 h-5 text-slate-400" />
              {t("bookingInfo")}
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{t("serviceType")}</span>
                <span className="font-semibold text-slate-900">{booking.serviceType}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{t("duration")}</span>
                <span className="font-semibold text-slate-900">{booking.duration} {t("minutes")}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">{t("people")}</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  {booking.people}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-4 rounded-xl border-2 border-slate-200 bg-white">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t("priority")}</p>
            <PriorityBadge priority={booking.priority} />
          </div>
          <div className="p-4 rounded-xl border-2 border-slate-200 bg-white">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t("rating")}</p>
            <Rating rating={booking.rating || 0} />
          </div>
          {booking.location && (
            <div className="p-4 rounded-xl border-2 border-slate-200 bg-white">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{t("location")}</p>
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-900 truncate">
                <MapPin className="w-4 h-4 text-slate-400" />
                {booking.location}
              </div>
            </div>
          )}
        </div>

        {/* Notes & Special Requests */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {booking.specialRequests && (
            <div className="p-5 rounded-xl bg-[#F59E0B]/10 border-2 border-[#F59E0B]/20">
                <h4 className="text-sm font-bold text-[#F59E0B] mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {t("specialRequests")}
                </h4>
                <p className="text-sm text-slate-700 leading-relaxed">
                {booking.specialRequests}
                </p>
            </div>
            )}

            {booking.notes && (
            <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("internalNotes")}</h4>
                <div className="text-sm text-slate-600 bg-slate-50 p-5 rounded-xl border-2 border-slate-200 leading-relaxed">
                {booking.notes}
                </div>
            </div>
            )}
        </div>
        
        {booking.tags && booking.tags.length > 0 && (
        <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t("tags")}</h4>
            <div className="flex flex-wrap gap-2">
            {booking.tags.map((tag, index) => (
                <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border-2 border-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                <Tag className="w-3.5 h-3.5 text-slate-400" />
                {tag}
                </span>
            ))}
            </div>
        </div>
        )}

        {/* Activities Section */}
        <div className="border-t-2 border-slate-200 pt-8">
          <h4 className="text-lg font-bold text-slate-900 mb-6">{t("activityLog")}</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                 <ActivityForm 
                    onSubmit={async (type, content, scheduledAt) => {
                        if (onAddActivity) {
                            // Optimistic update
                            const newActivity: any = {
                                id: `temp-${Date.now()}`,
                                type,
                                content,
                                scheduledAt: scheduledAt || null,
                                status: scheduledAt ? 'pending' : 'completed',
                                createdAt: new Date(),
                                createdBy: 'You', // Or get user name
                            };
                            
                            setBooking(prev => ({
                                ...prev,
                                activities: [newActivity, ...(prev.activities || [])]
                            }));

                            await onAddActivity(type, content, 'booking', booking.id, scheduledAt);
                            
                            router.refresh(); // Refresh to get real data
                        }
                    }} 
                />
            </div>
            <div className="lg:col-span-2">
                <ActivityLog activities={booking.activities || []} />
            </div>
          </div>
        </div>
      </div>

      <BookingFormDrawer
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleEdit}
        isLoading={isSubmitting}
        booking={booking}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        booking={booking}
      />

      <RescheduleModal 
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        onConfirm={handleReschedule}
        currentDate={new Date(booking.date)}
        currentTime={booking.startTime}
        isLoading={isSubmitting}
      />
    </div>
  );
};
