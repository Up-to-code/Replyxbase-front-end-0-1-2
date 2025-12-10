'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { getOrganizationId } from './utils';

export async function logActivity(
  type: 'call' | 'email' | 'note' | 'meeting',
  content: string,
  relatedTo: 'booking' | 'customer',
  relatedId: string,
  scheduledAt?: Date
) {
  try {
    const session = await getSession();
    if (!session?.user) throw new Error('Unauthorized');

    const activity = await prisma.activity.create({
      data: {
        type,
        content,
        createdBy: session.user.name || 'Unknown',
        bookingId: relatedTo === 'booking' ? relatedId : undefined,
        customerId: relatedTo === 'customer' ? relatedId : undefined,
        scheduledAt,
        status: scheduledAt ? 'pending' : 'completed',
      }
    });

    return { success: true, activity };
  } catch (error) {
    console.error('Failed to log activity:', error);
    return { success: false, error: 'Failed to log activity' };
  }
}

export async function getActivities(page: number = 1, limit: number = 20) {
    try {
        const session = await getSession();
        if (!session?.user || !session.session.activeOrganizationId) return { success: false, error: 'Unauthorized' };

        const organizationId = session.session.activeOrganizationId;
        const skip = (page - 1) * limit;

        const [activities, total] = await Promise.all([
            prisma.activity.findMany({
                where: { 
                    OR: [
                        { booking: { organizationId } },
                        { customer: { organizationId } },
                        { deal: { organizationId } }
                    ]
                 },
                include: {
                    booking: { select: { id: true, date: true, serviceType: true, startTime: true } },
                    customer: { select: { id: true, fullName: true } }
                },
                orderBy: { createdAt: 'desc' },
                take: limit,
                skip
            }),
            prisma.activity.count({
                where: { 
                    OR: [
                        { booking: { organizationId } },
                        { customer: { organizationId } },
                        { deal: { organizationId } }
                    ]
                }
            })
        ]);

        return {
            success: true,
            data: activities,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };

    } catch (error) {
        console.error("Failed to get activities:", error);
        return { success: false, error: "Failed to fetch activities" };
    }
}
