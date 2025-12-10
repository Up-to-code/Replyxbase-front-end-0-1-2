import React, { useMemo } from 'react';
import { Mail, Phone, Eye, Trash2, MapPin, Clock, Calendar, Search, Plus } from 'lucide-react';
import { useTranslations, useFormatter } from 'next-intl';
import { useRouter } from 'next/navigation';
import { Booking } from '../../types';
import { StatusBadge } from '../ui/Badges';
import { Pagination } from '../shared/Pagination';
import { TableRowSkeleton } from '../skeletons';

/**
 * Props for the BookingTable component.
 */
interface BookingTableProps {
  /** List of bookings to display */
  bookings: Booking[];
  /** Callback when a booking is viewed (optional, now handled by router) */
  onView?: (booking: Booking) => void;
  /** Callback when a booking is deleted */
  onDelete: (bookingId: string) => void;
  /** Current page number */
  currentPage: number;
  /** Total number of pages */
  totalPages: number;
  /** Callback when page changes */
  onPageChange: (page: number) => void;
  /** Whether data is loading */
  isLoading: boolean;
  /** Search term */
  searchTerm?: string;
  /** Callback for search change */
  onSearchChange?: (term: string) => void;
  // activeTab and onTabChange removed as per request
  
  /** Callback to add a new booking */
  onAddBooking?: () => void;
}

/**
 * Displays a table of bookings with pagination and actions.
 */
export const BookingTable: React.FC<BookingTableProps> = ({ 
  bookings, 
  onView, 
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  isLoading,
  searchTerm = "",
  onSearchChange,
  onAddBooking
}) => {
  const t = useTranslations("Dashboard.CRM.Bookings.Table");
  const format = useFormatter();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="mx-6">
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white border-b border-slate-100">
                <tr>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-xs uppercase tracking-wider rtl:text-right">{t("customer")}</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-xs uppercase tracking-wider rtl:text-right">{t("contact")}</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-xs uppercase tracking-wider rtl:text-right">{t("dateTime")}</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-xs uppercase tracking-wider rtl:text-right">{t("service")}</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-xs uppercase tracking-wider rtl:text-right">{t("status")}</th>
                  <th className="text-left py-4 px-6 font-bold text-slate-900 text-xs uppercase tracking-wider rtl:text-right">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...Array(5)].map((_, index) => (
                  <TableRowSkeleton key={index} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-[calc(100vh-200px)] bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Top Header with Title, Search, and Add Button */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
        <h1 className="text-2xl font-bold text-slate-900">{t('title') || "Bookings"}</h1>
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => onSearchChange?.(e.target.value)}
                    placeholder={t('search') || "Search..."}
                    className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20 focus:border-[#005bbc] w-64"
                />
            </div>
            {onAddBooking && (
                <button
                    onClick={onAddBooking}
                    className="flex items-center gap-2 px-4 py-2 bg-[#005bbc] hover:bg-[#004a9f] text-white rounded-lg text-sm font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    <span>New Booking</span>
                </button>
            )}
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10 backdrop-blur-sm">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider rtl:text-right">{t("customer")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider rtl:text-right">{t("contact")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider rtl:text-right">{t("dateTime")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider rtl:text-right">{t("service")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider rtl:text-right">{t("status")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-600 text-xs uppercase tracking-wider rtl:text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {bookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer group"
                  onClick={() => onView?.(booking)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm border border-slate-200">
                        {booking.customer.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{booking.customer.fullName}</div>
                        {booking.customer.company && (
                          <div className="text-xs text-slate-500 mt-0.5">
                            {booking.customer.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[180px]">{booking.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {booking.date instanceof Date ? format.dateTime(booking.date, { year: 'numeric', month: 'short', day: 'numeric' }) : ''}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-slate-700">{booking.serviceType}</div>
                    {booking.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span className="truncate max-w-[150px]">{booking.location}</span>
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize border
                      ${booking.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        booking.status === 'pending' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                        booking.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-rose-50 text-rose-700 border-rose-100'}`}>
                      {booking.status}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView?.(booking);
                        }}
                        className="p-2 text-slate-400 hover:text-[#005bbc] hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title={t("viewDetails")}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(booking.id);
                        }}
                        className="p-2 text-slate-400 hover:text-[#EF4444] hover:bg-rose-50 rounded-lg transition-colors duration-200"
                        title={t("deleteBooking")}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
      
      <div className="border-t border-slate-100 bg-white p-4">
        <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
        />
      </div>
    </div>
  );
};