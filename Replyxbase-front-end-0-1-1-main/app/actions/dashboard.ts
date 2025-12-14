'use server';

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getDashboardStats() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    return null;
  }

  const organizationId = session.session.activeOrganizationId;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
  const [
    bookingsCount,
    customersCount,
    activeAgentsCount,
    recentBookings,
    todaysBookings,
    recentCustomers,
    pendingBookingsCount,
    monthBookings
  ] = await Promise.all([
    prisma.booking.count({
      where: {
        organizationId,
        status: { in: ['pending', 'confirmed'] },
        date: { gte: now }
      }
    }),
    prisma.customer.count({
      where: { organizationId }
    }),
    prisma.agent.count({
      where: { 
        organizationId,
        status: 'active'
      }
    }),
    prisma.booking.findMany({
      where: { 
        organizationId,
        date: { gte: now },
        status: { in: ['pending', 'confirmed'] }
      },
      orderBy: [
        { date: 'asc' },
        { startTime: 'asc' }
      ],
      take: 10,
      include: { customer: true }
    }),
    prisma.booking.findMany({
      where: { 
        organizationId,
        date: {
          gte: startOfToday,
          lt: endOfToday
        },
        status: 'confirmed'
      },
      orderBy: { startTime: 'asc' },
      include: { customer: true }
    }),
    prisma.customer.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    prisma.booking.count({
      where: {
        organizationId,
        status: 'pending'
      }
    }),
    prisma.booking.findMany({
      where: {
        organizationId,
        date: {
          gte: startOfMonth,
          lte: endOfMonth
        }
      },
      select: { date: true }
    })
  ]);

  const bookingDates = monthBookings.map(b => new Date(b.date).getDate());

  return {
    stats: {
        bookings: bookingsCount,
        customers: customersCount,
        activeAgents: activeAgentsCount,
        pendingBookings: pendingBookingsCount
    },
    bookings: recentBookings,
    todaysBookings,
    recentCustomers,
    monthBookingDates: bookingDates
  };
}
