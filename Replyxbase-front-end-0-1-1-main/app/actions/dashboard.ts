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

  // Parallelize data fetching
  const [
    bookingsCount,
    customersCount,
    activeAgentsCount,
    recentBookings,
    todaysBookings,
    recentCustomers,
    deals
  ] = await Promise.all([
    // 1. Total Upcoming/Pending Bookings (Future)
    prisma.booking.count({
      where: {
        organizationId,
        status: { in: ['pending', 'confirmed'] },
        date: { gte: now }
      }
    }),
    
    // 2. Total Customers
    prisma.customer.count({
      where: { organizationId }
    }),

    // 3. Active Agents
    prisma.agent.count({
      where: { 
        organizationId,
        status: 'active'
      }
    }),

    // 4. Recent Bookings (General upcoming list)
    prisma.booking.findMany({
      where: { 
        organizationId,
        date: { gte: now }
      },
      orderBy: { date: 'asc' }, // Soonest first
      take: 5,
      include: { customer: true }
    }),

    // 5. TODAY'S Bookings
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

    // 6. Recent Customers (Newest first)
    prisma.customer.findMany({
        where: { organizationId },
        orderBy: { createdAt: 'desc' },
        take: 5
    }),

    // 7. Pending Bookings (Actionable Items)
    prisma.booking.count({
        where: {
            organizationId,
            status: 'pending'
        }
    })
  ]);

  return {
    stats: {
        bookings: bookingsCount,
        customers: customersCount,
        activeAgents: activeAgentsCount,
        pendingBookings: deals // Reuse variable name again for now
    },
    bookings: recentBookings,
    todaysBookings,
    recentCustomers
  };
}
