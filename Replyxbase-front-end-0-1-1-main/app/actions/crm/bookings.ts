'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getOrganizationId } from './utils';
import { Booking, BookingFormData, SortField, SortDirection } from '@/app/[locale]/dashboard/crm/types';
import { calculateEndTime } from '@/app/[locale]/dashboard/crm/utils';
import { Prisma } from '@prisma/client';

// ... imports

export async function getBooking(bookingId: string) {
  try {
    const organizationId = await getOrganizationId();
    console.log(`[getBooking] Fetching booking ${bookingId} for org ${organizationId}`);
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId, organizationId },
      include: {
        customer: true,
        activities: true,
      }
    });

    if (!booking) {
        const debugBooking = await prisma.booking.findUnique({ where: { id: bookingId } });
        if (debugBooking) {
            console.log(`[getBooking] Booking ${bookingId} found but belongs to org ${debugBooking.organizationId}, expected ${organizationId}`);
        } else {
            console.log(`[getBooking] Booking ${bookingId} truly does not exist in DB`);
        }
        return null; 
    }
    return booking as unknown as Booking;
  } catch (error) {
    console.error('Failed to fetch booking:', error);
    return null;
  }
}

export async function getBookings(
// ... rest of file
  page: number = 1,
  itemsPerPage: number = 10,
  filters?: {
    search?: string;
    status?: string;
    service?: string;
  },
  sort?: {
    field: SortField;
    direction: SortDirection;
  },
  dynamicFilters?: {
    id: string;
    field: string;
    operator: 'equals' | 'contains' | 'gt' | 'lt';
    value: string;
  }[]
) {
  try {
    const organizationId = await getOrganizationId();

    const where: Prisma.BookingWhereInput = {
      organizationId,
    };

    // Apply filters
    if (filters) {
      if (filters.search) {
        where.OR = [
          { customer: { fullName: { contains: filters.search, mode: 'insensitive' } } },
          { customer: { email: { contains: filters.search, mode: 'insensitive' } } },
          { customer: { phone: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }

      if (filters.status && filters.status !== 'all') {
        where.status = filters.status;
      }

      if (filters.service && filters.service !== 'all') {
        where.serviceType = filters.service;
      }
    }

    // Apply dynamic filters
    if (dynamicFilters && dynamicFilters.length > 0) {
      const dynamicConditions: Prisma.BookingWhereInput[] = [];
      
      for (const filter of dynamicFilters) {
        if (!filter.value) continue;
        
        const field = filter.field as keyof Prisma.BookingWhereInput; 
        
        let condition: any = {};

        switch (filter.operator) {
          case 'equals':
            condition = { equals: filter.value, mode: 'insensitive' };
            break;
          case 'contains':
            condition = { contains: filter.value, mode: 'insensitive' };
            break;
          case 'gt':
             if (field === 'price' || field === 'people') {
                 condition = { gt: Number(filter.value) };
             }
            break;
          case 'lt':
             if (field === 'price' || field === 'people') {
                 condition = { lt: Number(filter.value) };
             }
            break;
        }

        if (Object.keys(condition).length > 0) {
             // @ts-ignore
            dynamicConditions.push({ [field]: condition });
        }
      }
      
      if (dynamicConditions.length > 0) {
          where.AND = dynamicConditions;
      }
    }

    // Apply sorting
    let orderBy: Prisma.BookingOrderByWithRelationInput = { date: 'desc' };
    if (sort) {
      switch (sort.field) {
        case 'date':
          orderBy = { date: sort.direction };
          break;
        case 'customer':
          orderBy = { customer: { fullName: sort.direction } };
          break;
        case 'status':
          orderBy = { status: sort.direction };
          break;
        case 'service':
          orderBy = { serviceType: sort.direction };
          break;
        case 'priority':
           orderBy = { priority: sort.direction };
          break;
      }
    }

    const [bookings, totalItems] = await Promise.all([
      prisma.booking.findMany({
        where,
        orderBy,
        skip: (page - 1) * itemsPerPage,
        take: itemsPerPage,
        include: {
          customer: true,
          activities: true,
        },
      }),
      prisma.booking.count({ where }),
    ]);

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      bookings: bookings as unknown as Booking[],
      totalItems,
      totalPages,
      currentPage: page
    };
  } catch (error) {
    console.error('Failed to fetch bookings:', error);
    return {
      bookings: [],
      totalItems: 0,
      totalPages: 0,
      currentPage: 1
    };
  }
}

export async function createBooking(formData: BookingFormData) {
  try {
    const organizationId = await getOrganizationId();

    // Check if customer exists by email OR phone, create new if not found
    let customer = null;
    
    if (formData.customer.email) {
      customer = await prisma.customer.findFirst({
        where: {
          organizationId,
          email: formData.customer.email,
        }
      });
    }
    
    // If not found by email, try phone
    if (!customer && formData.customer.phone) {
      customer = await prisma.customer.findFirst({
        where: {
          organizationId,
          phone: formData.customer.phone,
        }
      });
    }

    // Create new customer if not found
    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          organizationId,
          fullName: formData.customer.fullName,
          email: formData.customer.email || '',
          phone: formData.customer.phone || '',
          company: formData.customer.company,
          address: formData.customer.address,
          notes: formData.customer.notes,
          status: 'active',
        }
      });
    } else {
      // Update existing customer info with new data
      customer = await prisma.customer.update({
        where: { id: customer.id },
        data: {
          fullName: formData.customer.fullName,
          email: formData.customer.email || customer.email,
          phone: formData.customer.phone || customer.phone,
          company: formData.customer.company,
          address: formData.customer.address,
          notes: formData.customer.notes,
        }
      });
    }

    const newBooking = await prisma.booking.create({
      data: {
        organizationId,
        customerId: customer.id,
        date: formData.booking.date,
        startTime: formData.booking.startTime,
        endTime: calculateEndTime(formData.booking.startTime, formData.booking.duration),
        duration: formData.booking.duration,
        people: formData.booking.people,
        serviceType: formData.booking.serviceType,
        occasion: formData.booking.occasion,
        specialRequests: formData.booking.specialRequests,
        location: formData.booking.location,
        status: formData.booking.status,
        priority: formData.booking.priority,
        staffAssigned: formData.booking.staffAssigned,
        notes: formData.booking.notes,
        source: formData.booking.source,
        tags: formData.booking.tags,
      },
      include: {
        customer: true,
        activities: true,
      }
    });

    await prisma.customer.update({
      where: { id: customer.id },
      data: {
        totalBookings: { increment: 1 },
        lastVisit: newBooking.date,
      }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, booking: newBooking as unknown as Booking };
  } catch (error) {
    console.error('Failed to create booking:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to create booking' };
  }
}

export async function updateBooking(bookingId: string, formData: BookingFormData) {
  try {
    const organizationId = await getOrganizationId();

    const existingBooking = await prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!existingBooking) {
      throw new Error('Booking not found');
    }

    // Update customer info
    if (existingBooking.customerId) {
      await prisma.customer.update({
        where: { id: existingBooking.customerId },
        data: {
          fullName: formData.customer.fullName,
          email: formData.customer.email,
          phone: formData.customer.phone,
          company: formData.customer.company,
          address: formData.customer.address,
          notes: formData.customer.notes,
        }
      });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: {
        date: formData.booking.date,
        startTime: formData.booking.startTime,
        endTime: calculateEndTime(formData.booking.startTime, formData.booking.duration),
        duration: formData.booking.duration,
        people: formData.booking.people,
        serviceType: formData.booking.serviceType,
        occasion: formData.booking.occasion,
        specialRequests: formData.booking.specialRequests,
        location: formData.booking.location,
        status: formData.booking.status,
        priority: formData.booking.priority,
        staffAssigned: formData.booking.staffAssigned,
        notes: formData.booking.notes,
        source: formData.booking.source,
        tags: formData.booking.tags,
      },
      include: {
        customer: true,
        activities: true,
      }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, booking: updatedBooking as unknown as Booking };
  } catch (error) {
    console.error('Failed to update booking:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update booking' };
  }
}

export async function rescheduleBooking(bookingId: string, date: Date, startTime: string) {
  try {
    const organizationId = await getOrganizationId();
    
    // Get current booking to calculate duration
    const currentBooking = await prisma.booking.findUnique({
      where: { id: bookingId, organizationId }
    });
    
    if (!currentBooking) throw new Error('Booking not found');

    const endTime = calculateEndTime(startTime, currentBooking.duration);

    const updatedBooking = await prisma.booking.update({
        where: { id: bookingId },
        data: {
            date,
            startTime,
            endTime
        },
        include: {
            customer: true,
            activities: true,
        }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, booking: updatedBooking as unknown as Booking };
  } catch (error) {
    console.error('Failed to reschedule booking:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reschedule booking' };
  }
}

export async function reorderBookings(items: { id: string; position: number; status: string }[]) {
  try {
    const organizationId = await getOrganizationId();
    
    // Use a transaction to ensure all updates succeed or fail together
    await prisma.$transaction(
      items.map((item) => 
        prisma.booking.update({
          where: { id: item.id, organizationId },
          data: { 
            position: item.position,
            status: item.status
          }
        })
      )
    );

    revalidatePath('/dashboard/crm');
    return { success: true };
  } catch (error) {
    console.error('Failed to reorder bookings:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to reorder bookings' };
  }
}

export async function deleteBooking(bookingId: string) {
  try {
    await prisma.booking.delete({
      where: { id: bookingId },
    });
    revalidatePath('/dashboard/crm');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete booking:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to delete booking' };
  }
}

export async function updateBookingStatus(bookingId: string, status: Booking['status']) {
  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { status },
      include: {
        customer: true,
        activities: true,
      }
    });
    revalidatePath('/dashboard/crm');
    return { success: true, booking: booking as unknown as Booking };
  } catch (error) {
    console.error('Failed to update booking status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to update booking status' };
  }
}

export async function bulkUpdateBookingsStatus(currentStatus: string, newStatus: string) {
  try {
    const organizationId = await getOrganizationId();
    
    // Only update if statuses are different
    if (currentStatus === newStatus) return { success: true, count: 0 };

    const result = await prisma.booking.updateMany({
      where: {
        organizationId,
        status: currentStatus // Updates all bookings with the old status (Title)
      },
      data: {
        status: newStatus // To the new status (Title)
      }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, count: result.count };
  } catch (error) {
    console.error('Failed to bulk update booking status:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Failed to bulk update status' };
  }
}

export async function getAllBookingsForCalendar(
    filters?: {
        search?: string;
        status?: string;
        service?: string;
    }
) {
  try {
    const organizationId = await getOrganizationId();
    
    const where: Prisma.BookingWhereInput = {
      organizationId,
    };

    if (filters) {
      if (filters.search) {
        where.OR = [
          { customer: { fullName: { contains: filters.search, mode: 'insensitive' } } },
          { customer: { email: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }
      if (filters.status && filters.status !== 'all') {
        where.status = filters.status;
      }
      if (filters.service && filters.service !== 'all') {
        where.serviceType = filters.service;
      }
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        customer: true,
        activities: true,
      }
    });

    return bookings as unknown as Booking[];
  } catch (error) {
    console.error('Failed to fetch calendar bookings:', error);
    return [];
  }
}

export async function getBookingStats(
  filters?: {
    search?: string;
    service?: string;
  },
  dynamicFilters?: {
    id: string;
    field: string;
    operator: 'equals' | 'contains' | 'gt' | 'lt';
    value: string;
  }[]
) {
  try {
    const organizationId = await getOrganizationId();

    const where: Prisma.BookingWhereInput = {
      organizationId,
    };

    // Apply filters (excluding status, as we want stats for all statuses)
    if (filters) {
      if (filters.search) {
        where.OR = [
          { customer: { fullName: { contains: filters.search, mode: 'insensitive' } } },
          { customer: { email: { contains: filters.search, mode: 'insensitive' } } },
          { customer: { phone: { contains: filters.search, mode: 'insensitive' } } },
        ];
      }

      if (filters.service && filters.service !== 'all') {
        where.serviceType = filters.service;
      }
    }

    // Apply dynamic filters
    if (dynamicFilters && dynamicFilters.length > 0) {
      const dynamicConditions: Prisma.BookingWhereInput[] = [];
      
      for (const filter of dynamicFilters) {
        if (!filter.value) continue;
        
        const field = filter.field as keyof Prisma.BookingWhereInput; 
        
        let condition: any = {};

        switch (filter.operator) {
          case 'equals':
            condition = { equals: filter.value, mode: 'insensitive' };
            break;
          case 'contains':
            condition = { contains: filter.value, mode: 'insensitive' };
            break;
          case 'gt':
             if (field === 'price' || field === 'people') {
                 condition = { gt: Number(filter.value) };
             }
            break;
          case 'lt':
             if (field === 'price' || field === 'people') {
                 condition = { lt: Number(filter.value) };
             }
            break;
        }

        if (Object.keys(condition).length > 0) {
             // @ts-ignore
            dynamicConditions.push({ [field]: condition });
        }
      }
      
      if (dynamicConditions.length > 0) {
          where.AND = dynamicConditions;
      }
    }

    // Get counts grouped by status
    const statusCounts = await prisma.booking.groupBy({
      by: ['status'],
      _count: {
        status: true
      },
      where
    });

    const stats: Record<string, number> = {
      all: 0
    };

    statusCounts.forEach((group) => {
      const count = group._count.status;
      stats.all += count;
      if (group.status) {
        stats[group.status] = count;
      }
    });

    return stats;
  } catch (error) {
    console.error('Failed to fetch booking stats:', error);
    return {
      all: 0
    };
  }
}
