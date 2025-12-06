'use client';

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Booking, BookingFormData, CalendarView as CalendarViewType, MainView } from './types';
import { useFilters } from './hooks/useFilters';
import { createBooking, updateBooking, deleteBooking, rescheduleBooking, reorderBookings } from '@/app/actions/crm/bookings';
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
  initialStats: {
    all: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    completed: number;
    noshow: number;
  };
  initialSettings: any;
}

export default function CRM({ 
  initialBookings, 
  initialPagination, 
  initialCustomers,
  initialView,
  initialFilters,
  initialStats,
  initialSettings
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
  const [view, setViewState] = useState<MainView>(initialView);
  const [calendarView, setCalendarView] = useState<CalendarViewType>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [stats, setStats] = useState(initialStats);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(initialPagination);

  // Sync state when props change
  useEffect(() => {
    setBookings(initialBookings);
    setPagination(initialPagination);
    setStats(initialStats);
    setViewState(initialView);
  }, [initialBookings, initialPagination, initialStats, initialView]);

  // Drawer & Modal State
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [previewBooking, setPreviewBooking] = useState<Booking | null>(null);
  const [rescheduleBookingTarget, setRescheduleBookingTarget] = useState<Booking | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [bookingToDelete, setBookingToDelete] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handlers
  const handleCreateBooking = async (formData: BookingFormData) => {
    setIsSubmitting(true);
    try {
      await createBooking(formData);
      refreshData();
      setIsFormOpen(false);
      showToast('Booking created successfully');
    } catch (error) {
      console.error('Failed to create booking:', error);
      showToast('Failed to create booking', 'error');
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
      showToast('Booking updated successfully');
    } catch (error) {
      console.error('Failed to update booking:', error);
      showToast('Failed to update booking', 'error');
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
      showToast('Booking deleted successfully');
    } catch (error) {
      console.error('Failed to delete booking:', error);
      showToast('Failed to delete booking', 'error');
    }
  };

  const handleReschedule = async (date: Date, time: string) => {
    if (!rescheduleBookingTarget) return;
    setIsSubmitting(true);
    try {
        await rescheduleBooking(rescheduleBookingTarget.id, date, time);
        refreshData();
        setRescheduleBookingTarget(null);
        showToast('Booking rescheduled successfully');
    } catch (error) {
        console.error('Failed to reschedule:', error);
        showToast('Failed to reschedule', 'error');
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
      showToast('Booking updated');
    } catch (error) {
      console.error('Failed to update booking', error);
      showToast('Failed to update booking', 'error');
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
        showToast('Failed to reorder', 'error');
        refreshData();
    }
  };

  const handleUpdateSettings = async (settings: any) => {
    try {
        await updateCRMSettings(settings);
    } catch (error) {
        console.error('Failed to update settings', error);
        showToast('Failed to save settings', 'error');
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: Booking['status']) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    const updatedBooking = { ...booking, status: newStatus };
    await handleKanbanUpdate(updatedBooking);
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
        
        {/* Header & Stats */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{t("title")}</h1>
              <p className="text-sm text-slate-600 mt-1">{t("subtitle")}</p>
            </div>
            <div className="flex items-center gap-3">
              <ViewToggle mainView={view} setMainView={handleViewChange} />
              <button
                onClick={() => {
                  setSelectedBooking(null);
                  setIsFormOpen(true);
                }}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#005bbc] hover:bg-[#004a9f] text-white border-2 border-[#005bbc] rounded-xl transition-colors duration-200 font-medium"
                aria-label={t("Header.newBooking")}
              >
                <Plus className="w-4 h-4" />
                {t("Header.newBooking")}
              </button>
            </div>
          </div>
          
          <StatsOverview 
            stats={stats}
            isLoading={showLoading} 
            currentFilter={initialFilters.status}
            onFilterChange={handleStatusFilterChange}
          />
        </div>

        {/* Filters */}
        <Filters
          searchTerm={searchTerm}
          setSearchTerm={(term) => {
            setSearchTerm(term);
            const params = new URLSearchParams(searchParams.toString());
            if (term) params.set('search', term);
            else params.delete('search');
            router.replace(`${pathname}?${params.toString()}`);
          }}
          statusFilter={statusFilter}
          setStatusFilter={handleStatusFilterChange}
          serviceFilter={serviceFilter}
          setServiceFilter={(service) => {
            setServiceFilter(service);
            updateUrl({ service, page: 1 });
          }}
          sortField={sortField}
          sortDirection={sortDirection}
          onSortChange={handleSortChange}
          dateRange={dateRange}
          setDateRange={setDateRange}
          dynamicFilters={dynamicFilters}
          addDynamicFilter={addDynamicFilter}
          removeDynamicFilter={removeDynamicFilter}
          updateDynamicFilter={updateDynamicFilter}
        />

        {/* Content */}
        <AnimatePresence mode="wait">
          {view === 'table' ? (
            <motion.div
              key="table"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <BookingTable
                bookings={bookings}
                isLoading={showLoading}
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                onView={handleViewBooking}
                onDelete={(id) => {
                  setBookingToDelete(id);
                  setIsDeleteModalOpen(true);
                }}
              />
            </motion.div>
          ) : view === 'calendar' ? (
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
                isLoading={showLoading}
              />
            </motion.div>
          ) : (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <KanbanBoard
                bookings={bookings}
                onView={handleViewBooking}
                onStatusChange={handleStatusChange}
                onUpdateBooking={handleKanbanUpdate}
                onReorder={handleReorderBookings}
                onUpdateSettings={handleUpdateSettings}
                initialSettings={initialSettings}
                isLoading={showLoading}
              />
            </motion.div>
          )}
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
