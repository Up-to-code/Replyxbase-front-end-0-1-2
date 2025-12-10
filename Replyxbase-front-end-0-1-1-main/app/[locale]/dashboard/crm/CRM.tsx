'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Booking, BookingFormData, CalendarView as CalendarViewType, MainView } from './types';
import { useFilters } from './hooks/useFilters';
import { createBooking, updateBooking, deleteBooking, rescheduleBooking, reorderBookings, bulkUpdateBookingsStatus } from '@/app/actions/crm/bookings';
import { updateCRMSettings } from '@/app/actions/crm/organization';
import { Filters } from './components/shared/Filters';
import { ViewToggle } from './components/shared/ViewToggle';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { BookingTable } from './components/bookings/BookingTable';
import { CalendarViewComponent } from './components/calendar/CalendarView';
import { KanbanBoard } from './components/kanban/KanbanBoard';
import { Pagination } from './components/shared/Pagination';
import { DeleteConfirmationModal } from './components/bookings/DeleteConfirmationModal';
import { RescheduleModal } from './components/bookings/RescheduleModal';
import { BookingFormDrawer } from './components/bookings/BookingFormDrawer';
import { BookingPreviewDrawer } from './components/bookings/BookingPreviewDrawer';
import { StatsOverview } from './components/shared/StatsOverview';
import { CustomersTab } from './components/CustomersTab';
import { ActivitiesTab } from './components/ActivitiesTab';
import { CustomerDetailsDrawer } from './components/CustomerDetailsDrawer';

import { Customer } from './types';


interface CRMProps {
  initialBookings: Booking[];
  initialPagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
  initialCustomers: Customer[];
  initialView: MainView;
  initialFilters: {
    search: string;
    status: string;
    service: string;
    sortField: any;
    sortDirection: any;
  };
  initialStats: Record<string, number>;
  initialSettings: any;
  initialActivities: any[];
}

export default function CRM({ 
  initialBookings, 
  initialPagination, 
  initialCustomers,
  initialView,
  initialFilters,
  initialStats,
  initialSettings,
  initialActivities
}: CRMProps) {
  // i18n
  const t = useTranslations("Dashboard.CRM");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Helper to update URL params
  const updateUrl = useCallback((updates: Record<string, string | number | null>) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    startTransition(() => {
        router.push(`${pathname}?${params.toString()}`);
    });
  }, [pathname, router, searchParams]);

  // State
  const [activeTab, setActiveTab] = useState<'calendar' | 'customers' | 'activities'>('calendar');
  const [view, setViewState] = useState<MainView>(initialView || 'calendar');
  const [calendarView, setCalendarView] = useState<CalendarViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [stats, setStats] = useState(initialStats);
  const [settings, setSettings] = useState(initialSettings);
  const [activities, setActivities] = useState(initialActivities || []);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Sync state when props change
  useEffect(() => {
    setBookings(initialBookings);
    setPagination(initialPagination);
    setStats(initialStats);
    setViewState(initialView);
    setSettings(initialSettings);
    setActivities(initialActivities || []);
  }, [initialBookings, initialPagination, initialStats, initialView, initialSettings, initialActivities]);



  // Drawer & Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [previewBooking, setPreviewBooking] = useState<Booking | null>(null);
  const [rescheduleBookingTarget, setRescheduleBookingTarget] = useState<Booking | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Customer Drawer State
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isCustomerDrawerOpen, setIsCustomerDrawerOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);

  useEffect(() => {
    setCustomers(initialCustomers);
  }, [initialCustomers]);

  // Customer Sort & Filter State
  const [customerSortField, setCustomerSortField] = useState('fullName'); // Default sort by name
  const [customerSortDirection, setCustomerSortDirection] = useState<'asc' | 'desc'>('asc');
  const [customerStatusFilter, setCustomerStatusFilter] = useState('all');

  // Hooks
  const {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    serviceFilter,
    setServiceFilter,
    dateRange,
    setDateRange,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    dynamicFilters,
    addDynamicFilter,
    removeDynamicFilter,
    updateDynamicFilter
  } = useFilters(initialFilters);

  // Handlers that update URL
  const handleViewChange = (newView: MainView) => {
    setViewState(newView);
    // Use replace to avoid full page reload - just update URL for bookmarking
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', newView);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
    updateUrl({ status, page: 1 });
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    updateUrl({ search: term, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateUrl({ page });
  };

  const handleSortChange = (field: string, direction: string) => {
    setSortField(field as any);
    setSortDirection(direction as any);
    updateUrl({ sortField: field, sortDirection: direction });
  };

  const refreshData = () => {
    router.refresh();
  };

  const handleViewBooking = (booking: Booking) => {
    setPreviewBooking(booking);
  };

    // Tab Content Renderer
    const renderContent = () => {
        switch (activeTab) {
            case 'calendar':
                return (
                    <motion.div
                        key="calendar"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >
                         <CalendarViewComponent
                            bookings={bookings}
                            currentDate={currentDate}
                            onDateChange={setCurrentDate}
                            view={calendarView}
                            onViewChange={setCalendarView}
                            onBookingClick={handleViewBooking}
                            onDayClick={(date) => {
                                setCurrentDate(date);
                                setCalendarView('day');
                            }}
                            onAddBooking={() => {
                                setSelectedBooking(null);
                                setIsFormOpen(true);
                            }}
                            isLoading={showLoading}
                        />
                    </motion.div>
                );
            case 'customers':
                return (
                    <motion.div
                        key="customers"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >

                        <CustomersTab 
                            customers={customers.filter(c => {
                                const matchesSearch = c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                                    (c.email && c.email.toLowerCase().includes(searchTerm.toLowerCase()));
                                const matchesStatus = customerStatusFilter === 'all' || c.status === customerStatusFilter;
                                return matchesSearch && matchesStatus;
                            }).sort((a, b) => {
                                const valA = (a as any)[customerSortField];
                                const valB = (b as any)[customerSortField];
                                
                                if (customerSortField === 'lastVisit' || customerSortField === 'createdAt') {
                                    const timeA = valA ? new Date(valA).getTime() : 0;
                                    const timeB = valB ? new Date(valB).getTime() : 0;
                                    return customerSortDirection === 'asc' ? timeA - timeB : timeB - timeA;
                                }
                                
                                const strA = String(valA || '').toLowerCase();
                                const strB = String(valB || '').toLowerCase();
                                
                                if (strA < strB) return customerSortDirection === 'asc' ? -1 : 1;
                                if (strA > strB) return customerSortDirection === 'asc' ? 1 : -1;
                                return 0;
                            })} 
                            onCustomerClick={(customer) => {
                                setSelectedCustomer(customer);
                                setIsCustomerDrawerOpen(true);
                            }} 
                           onAddCustomer={() => {
                                setSelectedCustomer(null);
                                setIsCustomerDrawerOpen(true);
                            }}
                            sortField={customerSortField}
                            sortDirection={customerSortDirection}
                            onSortChange={(field) => {
                                if (customerSortField === field) {
                                    setCustomerSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
                                } else {
                                    setCustomerSortField(field);
                                    setCustomerSortDirection('asc');
                                }
                            }}
                            statusFilter={customerStatusFilter}
                            onStatusFilterChange={setCustomerStatusFilter}
                        />
                    </motion.div>
                );
            case 'activities':
                return (
                    <motion.div
                        key="activities"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                    >

                        <ActivitiesTab 
                        activities={activities}
                        onReschedule={(activity) => {
                            if (activity.booking) {
                                // Create a partial booking object enough for RescheduleModal
                                const targetBooking = {
                                    id: activity.booking.id,
                                    date: new Date(activity.booking.date), // Ensure Date object
                                    startTime: activity.booking.startTime || '09:00', // Fallback if missing
                                } as Booking;
                                setRescheduleBookingTarget(targetBooking);
                            }
                        }}
                    />
                    </motion.div>
                );
            default:
                return null;
        }
    };



  // Handlers
  const handleCreateBooking = async (formData: BookingFormData) => {
    setIsSubmitting(true);
    try {
      await createBooking(formData);
      refreshData();
      setIsFormOpen(false);
      showToast(t('Toast.createCommon'));
    } catch (error) {
      console.error('Failed to create booking:', error);
      showToast(t('Toast.createError'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateBooking = async (formData: BookingFormData) => {
    if (!selectedBooking) return;
    setIsSubmitting(true);
    try {
      await updateBooking(selectedBooking.id, formData);
      refreshData();
      setIsFormOpen(false);
      setSelectedBooking(null);
      showToast(t('Toast.updateCommon'));
    } catch (error) {
      console.error('Failed to update booking:', error);
      showToast(t('Toast.updateError'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBooking = async () => {
    if (!bookingToDelete) return;
    try {
      await deleteBooking(bookingToDelete);
      refreshData();
      setIsDeleteModalOpen(false);
      setBookingToDelete(null);
      showToast(t('Toast.deleteCommon'));
    } catch (error) {
      console.error('Failed to delete booking:', error);
      showToast(t('Toast.deleteError'), 'error');
    }
  };

  const handleReschedule = async (date: Date, time: string) => {
    if (!rescheduleBookingTarget) return;
    setIsSubmitting(true);
    try {
        await rescheduleBooking(rescheduleBookingTarget.id, date, time);
        refreshData();
        setRescheduleBookingTarget(null);
        showToast(t('Toast.rescheduleSuccess'));
    } catch (error) {
        console.error('Failed to reschedule:', error);
        showToast(t('Toast.rescheduleError'), 'error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const openEditForm = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsFormOpen(true);
  };

  const handleKanbanUpdate = async (updatedBooking: Booking) => {
    setBookings(prev => prev.map(b => b.id === updatedBooking.id ? updatedBooking : b));
    try {
      const formData: BookingFormData = {
        customer: {
          fullName: updatedBooking.customer.fullName,
          email: updatedBooking.customer.email || '',
          phone: updatedBooking.customer.phone || '',
          company: updatedBooking.customer.company || '',
          address: updatedBooking.customer.address || '',
          notes: updatedBooking.customer.notes || ''
        },
        booking: {
          ...updatedBooking,
          date: new Date(updatedBooking.date),
          occasion: updatedBooking.occasion || '',
          specialRequests: updatedBooking.specialRequests || '',
          location: updatedBooking.location || '',
          status: updatedBooking.status as any,
          priority: updatedBooking.priority as any,
          staffAssigned: updatedBooking.staffAssigned || '',
          notes: updatedBooking.notes || '',
          source: (updatedBooking.source as any) || 'website',
          tags: updatedBooking.tags || []
        }
      };
      await updateBooking(updatedBooking.id, formData);
      showToast(t('Toast.updateCommon'));
    } catch (error) {
      console.error('Failed to update booking', error);
      showToast(t('Toast.updateError'), 'error');
      refreshData();
    }
  };

  const handleReorderBookings = async (items: { id: string; position: number; status: string }[]) => {
    // Optimistic update locally
    setBookings(prev => {
        const newBookings = [...prev];
        items.forEach(item => {
            const index = newBookings.findIndex(b => b.id === item.id);
            if (index !== -1) {
                newBookings[index] = { ...newBookings[index], position: item.position, status: item.status as any };
            }
        });
        return newBookings;
    });

    try {
        await reorderBookings(items);
    } catch (error) {
        console.error('Failed to reorder', error);
        showToast(t('Toast.reorderError'), 'error');
        refreshData();
    }
  };

  const handleUpdateSettings = async (newSettings: any) => {
    setSettings(newSettings); // Optimistic update
    try {
        await updateCRMSettings(newSettings);
    } catch (error) {
        console.error('Failed to update settings', error);
        showToast(t('Toast.settingsError'), 'error');
    }
  };

  const handleBulkStatusChange = async (oldStatus: string, newStatus: string) => {
      try {
          const result = await bulkUpdateBookingsStatus(oldStatus, newStatus);
          if (result.success) {
              refreshData();
              showToast(t('Toast.bulkUpdateSuccess', { count: result.count, status: newStatus }));
          } else {
              showToast(result.error || t('Toast.bulkUpdateError'), 'error');
          }
      } catch (error) {
          console.error('Failed to bulk update status:', error);
          showToast(t('Toast.bulkUpdateError'), 'error');
      }
  };

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const updatedBooking = { ...booking, status: newStatus };
    await handleKanbanUpdate(updatedBooking);
  };

  const handleUpdateCustomer = (updatedCustomer: Customer) => {
      setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? updatedCustomer : c));
  };

  const handleCreateCustomer = (newCustomer: Customer) => {
    setCustomers(prev => [newCustomer, ...prev]);
  };

  const showLoading = isLoading || isPending;

  return (
    <div className="min-h-screen bg-slate-50 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-lg border-2 text-white font-medium ${
              toast.type === 'success' 
                ? 'bg-[#10B981] border-[#10B981]' 
                : 'bg-[#EF4444] border-[#EF4444]'
            } rtl:right-auto rtl:left-4`}
            role="alert"
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto space-y-6 p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t('title')}</h1>
              <p className="text-sm text-slate-600 mt-1">{t('subtitle')}</p>
            </div>
            
            {/* TABS */}
            <div className="flex p-1 bg-white border border-slate-200 rounded-xl">
                 {(['calendar', 'customers', 'activities'] as const).map((tab) => (
                     <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                            activeTab === tab
                             ? 'bg-slate-100 text-slate-900 shadow-sm'
                             : 'text-slate-500 hover:text-slate-700'
                        } capitalize`}
                     >
                         {t(`tabs.${tab}`)}
                     </button>
                 ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
              {renderContent()}
          </AnimatePresence>
      </div>

      <BookingFormDrawer
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedBooking(null);
        }}
        onSave={selectedBooking ? handleUpdateBooking : handleCreateBooking}
        isLoading={isSubmitting}
        booking={selectedBooking || undefined}
        customers={customers}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBookingToDelete(null);
        }}
        onConfirm={handleDeleteBooking}
        booking={bookings.find(b => b.id === bookingToDelete)}
      />

      <BookingPreviewDrawer
        isOpen={!!previewBooking}
        onClose={() => setPreviewBooking(null)}
        booking={previewBooking}
        onEdit={(booking) => {
            setPreviewBooking(null);
            openEditForm(booking);
        }}
        onReschedule={(booking) => {
            setPreviewBooking(null); // Close preview
            setRescheduleBookingTarget(booking);
        }}
      />

      <CustomerDetailsDrawer
        isOpen={isCustomerDrawerOpen}
        onClose={() => {
            setIsCustomerDrawerOpen(false);
            setSelectedCustomer(null);
        }}
        customer={selectedCustomer || null}
        onUpdate={handleUpdateCustomer}
        onCreate={handleCreateCustomer}
      />

      {rescheduleBookingTarget && (
        <RescheduleModal
            isOpen={!!rescheduleBookingTarget}
            onClose={() => setRescheduleBookingTarget(null)}
            onConfirm={handleReschedule}
            currentDate={new Date(rescheduleBookingTarget.date)}
            currentTime={rescheduleBookingTarget.startTime}
            isLoading={isSubmitting}
        />
      )}
    </div>
  );
}
