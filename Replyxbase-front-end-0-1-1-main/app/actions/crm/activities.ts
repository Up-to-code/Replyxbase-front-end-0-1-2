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
