import React from 'react';
import { getBooking } from '@/app/actions/crm/bookings';
import { BookingDetails } from '../../components/bookings/BookingDetails';
import { logActivity } from '@/app/actions/crm/activities';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { id: string };
}

export default async function BookingPage({ params }: PageProps) {
  const { id } = await params;
  const booking = await getBooking(id);

  if (!booking) {
    notFound();
  }

  // Wrap server action to pass to client component
  const handleAddActivity = async (type: 'call' | 'email' | 'note' | 'meeting', content: string, relatedTo: 'booking' | 'customer', relatedId: string, scheduledAt?: Date) => {
    'use server';
    await logActivity(type, content, relatedTo, relatedId, scheduledAt);
  };

  return (
    <div className="max-w-[1200px] mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-4">
        <a href="/dashboard/crm" className="text-sm font-medium text-slate-500 hover:text-slate-900">
            CRM
        </a>
        <span className="text-slate-300">/</span>
        <span className="text-sm font-medium text-slate-900">Booking Details</span>
      </div>
      
      <BookingDetails 
        booking={booking}
        onAddActivity={handleAddActivity}
      />
    </div>
  );
}
