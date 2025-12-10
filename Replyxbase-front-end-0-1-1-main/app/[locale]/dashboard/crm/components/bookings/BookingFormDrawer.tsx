import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, ChevronDown, ChevronUp, Search, Phone } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Booking, BookingFormData, Customer } from '../../types';
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
  /** List of existing customers for lookup */
  customers?: Customer[];
}

/**
 * Drawer component for creating or editing a booking.
 */
export const BookingFormDrawer: React.FC<BookingFormDrawerProps> = ({
  isOpen,
  onClose,
  onSave,
  isLoading,
  booking,
  customers = []
}) => {
  const drawerRef = useOutsideClick(onClose);
  const t = useTranslations("Dashboard.CRM.Form");
  const tCommon = useTranslations("Common");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Customer Search State
  const [customerSearch, setCustomerSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

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
      setCustomerSearch('');
      setShowSuggestions(false);
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
    
    // Custom Validation: Require either Email OR Phone
    if (!formData.customer.email && !formData.customer.phone) {
        toast.error(t("emailOrPhoneRequired") || "Please provide either an email or phone number.");
        return; 
    }
    
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

  const handleSelectCustomer = (customer: Customer) => {
    setFormData(prev => ({
      ...prev,
      customer: {
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone || '',
        company: customer.company || '',
        address: customer.address || '',
        notes: customer.notes || ''
      }
    }));
    setCustomerSearch('');
    setShowSuggestions(false);
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
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-[101] overflow-y-auto rtl:right-auto rtl:left-0 rtl:transform rtl:-scale-x-100 border-l border-slate-200"
          >
            <div className="flex flex-col h-full rtl:transform rtl:-scale-x-100">
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">
                  {booking ? t("editTitle") : t("newTitle")}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-slate-200 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
                <div className="p-6 space-y-6">
                  {/* Essential Customer Information */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#005bbc]"></span>
                      {t("customerInfo")}
                    </h3>
                    
                    {!booking && (
                        <div className="mb-6 relative">
                            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                                {t("searchExisting") || "Load Existing Customer"}
                            </label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input
                                    type="text"
                                    value={customerSearch}
                                    onChange={(e) => {
                                        setCustomerSearch(e.target.value);
                                        setShowSuggestions(true);
                                    }}
                                    onFocus={() => setShowSuggestions(true)}
                                    placeholder="Search by name, email or phone..."
                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#005bbc] focus:ring-1 focus:ring-[#005bbc] outline-none transition-all text-sm"
                                />
                            </div>

                            <AnimatePresence>
                                {showSuggestions && customerSearch.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute top-full left-0 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl z-50 max-h-60 overflow-y-auto"
                                    >
                                        {customers.filter(c => 
                                            c.fullName.toLowerCase().includes(customerSearch.toLowerCase()) || 
                                            c.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
                                            (c.phone && c.phone.includes(customerSearch))
                                        ).map((customer) => (
                                            <button
                                                key={customer.id}
                                                type="button"
                                                onClick={() => handleSelectCustomer(customer)}
                                                className="w-full flex items-center justify-between p-3 hover:bg-slate-50 border-b border-slate-50 last:border-0 transition-colors text-left"
                                            >
                                                <div>
                                                    <div className="font-semibold text-slate-900 text-sm">{customer.fullName}</div>
                                                    <div className="text-xs text-slate-500">{customer.email}</div>
                                                </div>
                                                {customer.phone && (
                                                    <div className="text-xs text-slate-400 flex items-center gap-1">
                                                        <Phone className="w-3 h-3" />
                                                        {customer.phone}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                        {customers.filter(c => c.fullName.toLowerCase().includes(customerSearch.toLowerCase())).length === 0 && (
                                            <div className="p-4 text-center text-sm text-slate-500">
                                                No customers found
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      />
                      <InputField
                        label={t("phone")}
                        value={formData.customer.phone}
                        onChange={(e) => handleInputChange('customer', 'phone', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Essential Booking Details */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-[#005bbc]"></span>
                       {t("bookingDetails")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="flex items-center justify-between w-full p-4 bg-slate-50 hover:bg-slate-100 rounded-xl transition-all border border-transparent hover:border-slate-200 mb-2"
                    >
                      <h3 className="text-sm font-bold text-slate-700">{t("additionalInfo")}</h3>
                      {showAdvanced ? (
                        <ChevronUp className="w-4 h-4 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-slate-500" />
                      )}
                    </button>
                    {showAdvanced && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 p-4 border border-slate-100 rounded-xl mt-2"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      </motion.div>
                    )}
                  </div>
                </div>
                
                <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-xl font-bold hover:bg-slate-50 hover:border-slate-300 transition-colors disabled:opacity-50"
                    >
                      {t("cancel")}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-[#005bbc] hover:bg-[#004a9f] text-white border border-[#005bbc] rounded-xl font-bold transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-none"
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