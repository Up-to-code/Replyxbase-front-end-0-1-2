'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Mail, Phone, Building, MapPin, messageSquare } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { Customer } from '../types';
import { useOutsideClick } from '../hooks/useOutsideClick';
import { InputField } from './ui/Inputs';

import { updateCustomer, createCustomer } from '@/app/actions/crm/customers';

interface CustomerDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer | null; // Allow null for create mode
  onUpdate: (customer: Customer) => void;
  onCreate?: (customer: Customer) => void;
}

export const CustomerDetailsDrawer: React.FC<CustomerDetailsDrawerProps> = ({
  isOpen,
  onClose,
  customer,
  onUpdate,
  onCreate
}) => {
  const drawerRef = useOutsideClick(onClose);
  const t = useTranslations("Dashboard.CRM.Customers");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<Partial<Customer>>({});

  useEffect(() => {
    if (customer) {
      setFormData({
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone || '',
        company: customer.company || '',
        address: customer.address || '',
        notes: customer.notes || '',
        status: customer.status
      });
    } else {
        // Reset form for create mode
        setFormData({
            fullName: '',
            email: '',
            phone: '',
            company: '',
            address: '',
            notes: '',
            status: 'active'
        });
    }
  }, [customer, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    try {
        if (customer) {
            // Update Mode
            const result = await updateCustomer(customer.id, formData);
            if (result.success && result.customer) {
                toast.success(t('messages.updateSuccess') || "Customer updated successfully");
                onUpdate(result.customer as unknown as Customer);
                onClose();
            } else {
                toast.error(result.error || t('messages.updateError') || "Failed to update customer");
            }
        } else {
            // Create Mode
            // Validation
            if (!formData.fullName || !formData.email) {
                toast.error(t('messages.requiredFields') || "Name and Email are required");
                setIsLoading(false);
                return;
            }

            const result = await createCustomer({
                fullName: formData.fullName,
                email: formData.email,
                phone: formData.phone,
                company: formData.company,
                address: formData.address,
                status: formData.status,
                notes: formData.notes
            });

            if (result.success && result.customer) {
                toast.success(t('messages.createSuccess') || "Customer created successfully");
                if (onCreate) onCreate(result.customer as unknown as Customer);
                onClose();
            } else {
                toast.error(result.error || t('messages.createError') || "Failed to create customer");
            }
        }
    } catch (error) {
        console.error(error);
        toast.error("An error occurred");
    } finally {
        setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof Customer, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
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
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[101] overflow-y-auto border-l border-slate-200"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">{customer ? formData.fullName : t('addCustomer')}</h2>
                    <p className="text-sm text-slate-500">{customer ? t('editDetails') : t('newCustomerDetails')}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
                
                {/* Contact Info */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('sections.contact')}</h3>
                    
                    <InputField
                        label={t('fields.fullName')}
                        value={formData.fullName || ''}
                        onChange={(e) => handleInputChange('fullName', e.target.value)}
                        required
                    />
                    
                    <div className="grid grid-cols-1 gap-4">
                         <InputField
                            label={t('fields.email')}
                            type="email"
                            value={formData.email || ''}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            icon={<Mail className="w-4 h-4" />}
                        />
                        <InputField
                            label={t('fields.phone')}
                            value={formData.phone || ''}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            icon={<Phone className="w-4 h-4" />}
                        />
                    </div>
                </div>

                <hr className="border-slate-100" />

                {/* Company & Address */}
                <div className="space-y-4">
                     <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('sections.details')}</h3>
                     <InputField
                        label={t('fields.company')}
                        value={formData.company || ''}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        icon={<Building className="w-4 h-4" />}
                    />
                     <InputField
                        label={t('fields.address')}
                        value={formData.address || ''}
                        onChange={(e) => handleInputChange('address', e.target.value)}
                        icon={<MapPin className="w-4 h-4" />}
                    />
                     <InputField
                        label={t('fields.status')}
                        type="select"
                        value={formData.status || 'active'}
                        onChange={(e) => handleInputChange('status', e.target.value)}
                        options={['active', 'inactive', 'lead']}
                    />
                </div>

                <hr className="border-slate-100" />

                 {/* Notes */}
                 <div className="space-y-4">
                     <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t('sections.notes')}</h3>
                     <textarea 
                        className="w-full min-h-[100px] p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20 focus:border-[#005bbc] text-sm text-slate-900 bg-slate-50 placeholder:text-slate-400"
                        placeholder={t('placeholders.notes')}
                        value={formData.notes || ''}
                        onChange={(e) => handleInputChange('notes', e.target.value)}
                     />
                 </div>

              </form>

              {/* Footer */}
              <div className="p-6 border-t border-slate-100 bg-gray-50/50">
                <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full flex items-center justify-center gap-2 bg-[#005bbc] hover:bg-[#004a9f] text-white py-3 rounded-xl font-bold transition-all disabled:opacity-50"
                >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {customer ? t('actions.saveChanges') : t('actions.createCustomer')}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
