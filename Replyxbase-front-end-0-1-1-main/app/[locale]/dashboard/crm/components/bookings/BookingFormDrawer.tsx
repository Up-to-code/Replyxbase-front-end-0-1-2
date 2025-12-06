import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Booking, BookingFormData } from '../../types';
import { InputField } from '../ui/Inputs';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { formatDateForInput } from '../../utils';
import { serviceTypes } from '../../constants';

/**
 * Props for the BookingFormDrawer component.
 */
interface BookingFormDrawerProps {
  /** Whether the drawer is open */
  isOpen: boolean;
  /** Callback to close the drawer */
  onClose: () => void;
  /** Callback to save the booking */
  onSave: (formData: BookingFormData) => void;
  /** Whether data is loading */
  isLoading: boolean;
  /** The booking to edit (optional) */
  booking?: Booking;
}

/**
 * Drawer component for creating or editing a booking.
 */
export const BookingFormDrawer: React.FC<BookingFormDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  booking
}) => {
  const drawerRef = useOutsideClick(onClose);
  const t = useTranslations("Dashboard.CRM.Form");
  const tCommon = useTranslations("Common");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [formData, setFormData] = useState<BookingFormData>({
    customer: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      address: '',
      notes: ''
    },
    booking: {
      date: new Date(),
      startTime: '09:00',
      duration: 60,
      people: 2,
      serviceType: serviceTypes[0],
      occasion: '',
      specialRequests: '',
      location: '',
      status: 'pending',
      priority: 'normal',
      staffAssigned: '',
      notes: '',
      source: 'website',
      tags: []
    }
  });

  // Reset form when opening in create mode
  useEffect(() => {
    if (isOpen && !booking) {
      setFormData({
        customer: {
          fullName: '',
          email: '',
          phone: '',
          company: '',
          address: '',
          notes: ''
        },
        booking: {
          date: new Date(),
          startTime: '09:00',
          duration: 60,
          people: 2,
          serviceType: serviceTypes[0],
          occasion: '',
          specialRequests: '',
          location: '',
          status: 'pending',
          priority: 'normal',
          staffAssigned: '',
          notes: '',
          source: 'website',
          tags: []
        }
      });
    }
  }, [isOpen, booking]);

  useEffect(() => {
    if (booking) {
      setFormData({
        customer: {
          fullName: booking.customer.fullName,
          email: booking.customer.email,
          phone: booking.customer.phone,
          company: booking.customer.company || '',
          address: booking.customer.address || '',
          notes: booking.customer.notes || ''
        },
        booking: {
          date: booking.date,
          startTime: booking.startTime,
          duration: booking.duration,
          people: booking.people,
          serviceType: booking.serviceType,
          occasion: booking.occasion || '',
          specialRequests: booking.specialRequests || '',
          location: booking.location || '',
          status: booking.status as any,
          priority: booking.priority as any,
          staffAssigned: booking.staffAssigned || '',
          notes: booking.notes || '',
          source: (booking.source as any) || 'website',
          tags: booking.tags || []
        }
      });
    }
  }, [booking]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleInputChange = (section: 'customer' | 'booking', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

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
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-[101] overflow-y-auto rtl:right-auto rtl:left-0 rtl:transform rtl:-scale-x-100 border-l-2 border-slate-200"
          >
            <div className="flex flex-col h-full rtl:transform rtl:-scale-x-100">
              <div className="flex items-center justify-between p-6 border-b-2 border-slate-200">
                <h2 className="text-xl font-semibold text-slate-900">
                  {booking ? t("editTitle") : t("newTitle")}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200 border-2 border-transparent hover:border-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-5">
                  {/* Essential Customer Information */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-3">{t("customerInfo")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label={t("fullName")}
                        value={formData.customer.fullName}
                        onChange={(e) => handleInputChange('customer', 'fullName', e.target.value)}
                        required
                      />
                      <InputField
                        label={t("email")}
                        type="email"
                        value={formData.customer.email}
                        onChange={(e) => handleInputChange('customer', 'email', e.target.value)}
                        required
                      />
                      <InputField
                        label={t("phone")}
                        value={formData.customer.phone}
                        onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Essential Booking Details */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 mb-3">{t("bookingDetails")}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <InputField
                        label={t("date")}
                        type="date"
                        value={formatDateForInput(formData.booking.date)}
                        onChange={(e) => handleInputChange('booking', 'date', new Date(e.target.value))}
                        required
                      />
                      <InputField
                        label={t("startTime")}
                        type="time"
                        value={formData.booking.startTime}
                        onChange={(e) => handleInputChange('booking', 'startTime', e.target.value)}
                        required
                      />
                      <InputField
                        label={t("duration")}
                        type="number"
                        value={formData.booking.duration}
                        onChange={(e) => handleInputChange('booking', 'duration', parseInt(e.target.value))}
                        required
                      />
                      <InputField
                        label={t("serviceType")}
                        type="select"
                        value={formData.booking.serviceType}
                        onChange={(e) => handleInputChange('booking', 'serviceType', e.target.value)}
                        options={serviceTypes}
                        required
                      />
                    </div>
                  </div>

                  {/* Advanced Options - Collapsible */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center justify-between w-full p-3 hover:bg-slate-50 rounded-xl transition-colors border-2 border-transparent hover:border-slate-200"
                    >
                      <h3 className="text-base font-semibold text-slate-900">{t("additionalInfo")}</h3>
                      {showAdvanced ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    {showAdvanced && (
                      <div className="mt-3 space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <InputField
                            label={t("people")}
                            type="number"
                            value={formData.booking.people}
                            onChange={(e) => handleInputChange('booking', 'people', parseInt(e.target.value))}
                      />
                      <InputField
                        label={t("status")}
                        type="select"
                        value={formData.booking.status}
                        onChange={(e) => handleInputChange('booking', 'status', e.target.value)}
                        options={['pending', 'confirmed', 'cancelled', 'completed', 'no-show']}
                          />
                          <InputField
                            label={t("company")}
                            value={formData.customer.company}
                            onChange={(e) => handleInputChange('customer', 'company', e.target.value)}
                      />
                    </div>
                      <InputField
                        label={t("specialRequests")}
                        type="textarea"
                          rows={2}
                        value={formData.booking.specialRequests}
                        onChange={(e) => handleInputChange('booking', 'specialRequests', e.target.value)}
                      />
                      <InputField
                        label={t("internalNotes")}
                        type="textarea"
                          rows={2}
                        value={formData.booking.notes}
                        onChange={(e) => handleInputChange('booking', 'notes', e.target.value)}
                      />
                    </div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 border-t-2 border-slate-200 bg-slate-50/50">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 border-2 border-slate-200 bg-white text-slate-700 rounded-xl font-medium hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {booking ? t("update") : t("create")}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};