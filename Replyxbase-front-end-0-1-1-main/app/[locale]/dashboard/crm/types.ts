import { Customer as PrismaCustomer, Booking as PrismaBooking, Activity as PrismaActivity, Note as PrismaNote } from '@prisma/client';

export interface Customer extends Omit<PrismaCustomer, 'loyaltyTier' | 'preferences'> {
  loyaltyTier?: 'bronze' | 'silver' | 'gold' | 'platinum' | null;
  preferences?: string[];
}

export interface Note extends Omit<PrismaNote, 'tags'> {
  priority: 'low' | 'medium' | 'high' | string;
  tags?: string[];
}

export interface Activity extends PrismaActivity {
  relatedTo?: 'booking' | 'customer';
  relatedId?: string;
  status: string;
  scheduledAt: Date | null;
}

export interface Booking extends Omit<PrismaBooking, 'tags'> {
  customer: Customer;
  activities?: Activity[];
  notesCount?: number;
  tags?: string[];
}

export interface BookingFormData {
  customer: {
    fullName: string;
    email: string;
    phone: string;
    company: string;
    address: string;
    notes: string;
  };
  booking: {
    date: Date;
    startTime: string;
    duration: number;
    people: number;
    serviceType: string;
    occasion: string;
    specialRequests: string;
    location: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'no-show' | string;
    priority: 'normal' | 'high' | 'urgent';
    staffAssigned: string;
    notes: string;
    source: 'website' | 'phone' | 'walk-in' | 'referral' | 'social';
    tags: string[];
  };
}

export type CalendarView = 'month' | 'week' | 'day';
export type MainView = 'table' | 'calendar' | 'kanban';
export type SortField = 'date' | 'customer' | 'status' | 'service' | 'priority';
export type SortDirection = 'asc' | 'desc';