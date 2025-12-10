import { useState, useCallback, useEffect } from 'react';
import { Booking, BookingFormData } from '../types';
import { getBookings, createBooking, updateBooking, deleteBooking, updateBookingStatus } from '@/app/actions/crm/bookings';
import { logActivity } from '@/app/actions/crm/activities';
import { useFilters } from './useFilters';

import { toast } from 'sonner';

export const useBookings = (filters: ReturnType<typeof useFilters>) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBookings = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await getBookings(
        filters.currentPage,
        10, // itemsPerPage
        { search: filters.searchTerm, status: filters.statusFilter, service: filters.serviceFilter },
        { field: filters.sortField, direction: filters.sortDirection },
        filters.dynamicFilters
      );
      setBookings(result.bookings);
      setTotalPages(result.totalPages);
      
      // Adjust current page if out of bounds
      if (filters.currentPage > result.totalPages && result.totalPages > 0) {
        filters.setCurrentPage(result.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
      toast.error('Failed to fetch bookings');
    } finally {
      setIsLoading(false);
    }
  }, [
    filters.currentPage, 
    filters.searchTerm, 
    filters.statusFilter, 
    filters.serviceFilter, 
    filters.sortField, 
    filters.sortDirection,
    filters.setCurrentPage,
    filters.dynamicFilters
  ]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const refresh = useCallback(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCreateBooking = async (data: BookingFormData) => {
    const result = await createBooking(data);
    if (result.success) {
      toast.success('Booking created successfully');
      refresh();
    } else {
      toast.error('Failed to create booking');
    }
    return result;
  };

  const handleUpdateBooking = async (id: string, data: BookingFormData) => {
    const result = await updateBooking(id, data);
    if (result.success) {
      toast.success('Booking updated successfully');
      refresh();
    } else {
      toast.error('Failed to update booking');
    }
    return result;
  };

  const handleDeleteBooking = async (id: string) => {
    // Optimistic update
    const previousBookings = [...bookings];
    setBookings(bookings.filter(b => b.id !== id));

    try {
      const result = await deleteBooking(id);
      if (!result.success) {
        throw new Error('Failed to delete');
      }
      toast.success('Booking deleted successfully');
      refresh(); // Refresh to ensure sync
      return result;
    } catch (error) {
      // Revert on failure
      setBookings(previousBookings);
      console.error('Delete failed:', error);
      toast.error('Failed to delete booking');
      return { success: false, error };
    }
  };

  const handleUpdateStatus = async (id: string, status: Booking['status']) => {
    // Optimistic update
    const previousBookings = [...bookings];
    setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));

    try {
      const result = await updateBookingStatus(id, status);
      if (!result.success) {
        throw new Error('Failed to update status');
      }
      toast.success(`Status updated to ${status}`);
      // No need to refresh immediately if optimistic update worked, 
      // but good to sync eventually. For now, we trust the optimistic update.
      return result;
    } catch (error) {
      // Revert on failure
      setBookings(previousBookings);
      console.error('Status update failed:', error);
      toast.error('Failed to update status');
      return { success: false, error };
    }
  };

  const handleAddActivity = async (type: 'call' | 'email' | 'note' | 'meeting', content: string, relatedTo: 'booking' | 'customer', relatedId: string) => {
    const result = await logActivity(type, content, relatedTo, relatedId);
    if (result.success) {
      toast.success('Activity logged');
      refresh();
    } else {
      toast.error('Failed to log activity');
    }
    return result;
  };

  return {
    bookings,
    isLoading,
    totalPages,
    refresh,
    createBooking: handleCreateBooking,
    updateBooking: handleUpdateBooking,
    deleteBooking: handleDeleteBooking,
    updateStatus: handleUpdateStatus,
    addActivity: handleAddActivity
  };
};
