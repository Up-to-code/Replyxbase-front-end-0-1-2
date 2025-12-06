import React from 'react';

// Page Loader Skeleton
export const PageLoader = () => (
  <div className="min-h-screen bg-slate-50 flex items-center justify-center">
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-200 rounded-full mb-4 animate-pulse border-2 border-slate-200">
        <div className="w-8 h-8 bg-slate-300 rounded-full"></div>
      </div>
      <div className="h-4 bg-slate-200 rounded w-32 mx-auto mb-2 animate-pulse"></div>
      <div className="h-3 bg-slate-200 rounded w-24 mx-auto animate-pulse"></div>
    </div>
  </div>
);

// Header Skeleton
export const HeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6 p-4 animate-pulse">
    <div className="space-y-2">
      <div className="h-8 bg-slate-200 rounded w-48"></div>
      <div className="h-4 bg-slate-200 rounded w-32"></div>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-10 bg-slate-200 rounded-xl w-24"></div>
      <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
    </div>
  </div>
);

// View Toggle Skeleton
export const ViewToggleSkeleton = () => (
  <div className="flex gap-1 mb-4 px-4 animate-pulse">
    <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
    <div className="h-10 bg-slate-200 rounded-xl w-32"></div>
  </div>
);

// Filter Skeleton
export const FilterSkeleton = () => (
  <div className="bg-white border-2 border-slate-200 rounded-xl p-4 mb-4 mx-4 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
      <div className="lg:col-span-2">
        <div className="h-10 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
        <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
      </div>
    </div>
  </div>
);

// Table Row Skeleton
export const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="py-3 px-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-slate-200 rounded-full border-2 border-slate-200"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded w-24"></div>
          <div className="h-3 bg-slate-200 rounded w-16"></div>
        </div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-32"></div>
        <div className="h-3 bg-slate-200 rounded w-24"></div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-20"></div>
        <div className="h-3 bg-slate-200 rounded w-16"></div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-28"></div>
        <div className="h-3 bg-slate-200 rounded w-20"></div>
      </div>
    </td>
    <td className="py-3 px-4">
      <div className="h-6 bg-slate-200 rounded-full w-16"></div>
    </td>
    <td className="py-3 px-4">
      <div className="flex gap-2">
        <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
        <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
      </div>
    </td>
  </tr>
);

// Calendar Skeleton
export const CalendarSkeleton = () => (
  <div className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden transition-all duration-200 mx-4 animate-pulse">
    {/* Calendar Header Skeleton */}
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 border-b-2 border-slate-200">
      <div className="flex items-center gap-4">
        <div className="h-8 bg-slate-200 rounded w-24"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
          <div className="h-8 bg-slate-200 rounded-xl w-16"></div>
          <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
      <div className="h-6 bg-slate-200 rounded-xl w-48"></div>
    </div>
    
    {/* Week Days Skeleton */}
    <div className="grid grid-cols-7 gap-1 mb-2 p-4">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="text-center">
          <div className="h-4 bg-slate-200 rounded mx-auto w-12"></div>
        </div>
      ))}
    </div>
    
    {/* Calendar Days Skeleton */}
    <div className="grid grid-cols-7 gap-1 p-4 pt-0">
      {[...Array(42)].map((_, i) => (
        <div key={i} className="min-h-[100px] border-2 border-slate-200 p-2 bg-slate-50">
          <div className="h-4 bg-slate-200 rounded w-6 mb-2"></div>
          <div className="space-y-1">
            <div className="h-3 bg-slate-200 rounded"></div>
            <div className="h-3 bg-slate-200 rounded w-3/4"></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Booking Details Skeleton
export const BookingDetailsSkeleton = () => (
  <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white z-50 overflow-y-auto border-l-2 border-slate-200">
    <div className="flex flex-col h-full">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between p-6 border-b-2 border-slate-200">
        <div className="space-y-2">
          <div className="h-6 bg-slate-200 rounded w-32"></div>
          <div className="h-4 bg-slate-200 rounded w-48"></div>
        </div>
        <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
      </div>
      
      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Customer & Status Skeleton */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-slate-200 rounded-full border-2 border-slate-200"></div>
              <div className="space-y-2">
                <div className="h-6 bg-slate-200 rounded w-32"></div>
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-200 rounded w-20"></div>
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border-2 border-slate-200">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-slate-200 rounded w-12"></div>
                  <div className="h-4 bg-slate-200 rounded w-32"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-slate-200 rounded w-12"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-slate-200 rounded w-16"></div>
                  <div className="h-4 bg-slate-200 rounded w-20"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
                <div className="space-y-1">
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Details Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-5 bg-slate-200 rounded w-32"></div>
              <div className="space-y-3">
                <div>
                  <div className="h-3 bg-slate-200 rounded w-20 mb-1"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="h-3 bg-slate-200 rounded w-16 mb-1"></div>
                    <div className="h-4 bg-slate-200 rounded w-12"></div>
                  </div>
                  <div>
                    <div className="h-3 bg-slate-200 rounded w-12 mb-1"></div>
                    <div className="h-4 bg-slate-200 rounded w-8"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="h-5 bg-slate-200 rounded w-32"></div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-12"></div>
                  <div className="h-4 bg-slate-200 rounded w-16"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-3 bg-slate-200 rounded w-20"></div>
                  <div className="h-4 bg-slate-200 rounded w-12"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes Skeleton */}
          <div className="space-y-4">
            <div className="h-5 bg-slate-200 rounded w-40"></div>
            <div className="h-16 bg-slate-200 rounded-xl"></div>
          </div>
        </div>
      </div>
      
      {/* Actions Skeleton */}
      <div className="p-6 border-t-2 border-slate-200">
        <div className="flex gap-3">
          <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
          <div className="flex-1 h-10 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  </div>
);

// Day Bookings Skeleton
export const DayBookingsSkeleton = () => (
  <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 overflow-y-auto border-l-2 border-slate-200">
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b-2 border-slate-200">
        <div className="h-5 bg-slate-200 rounded w-32"></div>
        <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="border-2 border-slate-200 rounded-xl p-4 mb-3 animate-pulse">
            <div className="flex items-center justify-between mb-2">
              <div className="h-5 bg-slate-200 rounded w-24"></div>
              <div className="h-6 bg-slate-200 rounded-full w-16"></div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm mb-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-20"></div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-32 mb-3"></div>
            <div className="flex gap-2">
              <div className="flex-1 h-8 bg-slate-200 rounded-xl"></div>
              <div className="w-8 h-8 bg-slate-200 rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);