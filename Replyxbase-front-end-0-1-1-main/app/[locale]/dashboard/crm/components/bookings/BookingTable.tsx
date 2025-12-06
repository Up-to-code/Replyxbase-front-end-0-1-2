import React from 'react';
import { Mail, Phone, Eye, Trash2, MapPin, Clock, Calendar } from 'lucide-react';
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
  isLoading
}) => {
  const t = useTranslations("Dashboard.CRM.Bookings.Table");
  const format = useFormatter();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="mx-6">
        <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50/50 border-b-2 border-slate-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("customer")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("contact")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("dateTime")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("service")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("status")}</th>
                  <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
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
    <div className="mx-6 pb-8">
      <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden mb-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b-2 border-slate-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("customer")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("contact")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("dateTime")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("service")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("status")}</th>
                <th className="text-left py-4 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider rtl:text-right">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {bookings.map((booking) => (
                <tr 
                  key={booking.id} 
                  className="hover:bg-slate-50/80 transition-colors duration-200 cursor-pointer group"
                  onClick={() => router.push(`/dashboard/crm/bookings/${booking.id}`)}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#005bbc]/10 flex items-center justify-center text-[#005bbc] font-semibold text-sm border-2 border-white">
                        {booking.customer.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900">{booking.customer.fullName}</div>
                        {booking.customer.company && (
                          <div className="text-xs text-slate-500 mt-0.5">
                            {booking.customer.company}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span>{booking.customer.phone}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-sm text-slate-900 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {booking.date instanceof Date ? format.dateTime(booking.date, { year: 'numeric', month: 'numeric', day: 'numeric' }) : ''}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {booking.startTime} - {booking.endTime}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="text-sm font-medium text-slate-900">{booking.serviceType}</div>
                    {booking.location && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {booking.location}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <StatusBadge status={booking.status} />
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/dashboard/crm/bookings/${booking.id}`);
                        }}
                        className="p-2 text-slate-400 hover:text-[#005bbc] hover:bg-[#005bbc]/10 rounded-lg transition-colors duration-200 border-2 border-transparent hover:border-[#005bbc]/20"
                        title={t("viewDetails")}
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(booking.id);
                        }}
                        className="p-2 text-slate-400 hover:text-[#EF4444] hover:bg-[#EF4444]/10 rounded-lg transition-colors duration-200 border-2 border-transparent hover:border-[#EF4444]/20"
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
      </div>
      
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};