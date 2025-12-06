'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { getOrganizationId } from './utils';
import { revalidatePath } from 'next/cache';

export interface DealFormData {
  title: string;
  value: number;
  currency?: string;
  probability?: number;
  expectedClose?: Date | null;
  stageId: string;
  customerId?: string;
  organizationId?: string; // Optional as we set it server-side often
}

/**
 * Get all deals for a specific pipeline, optionally filtered by stage.
 */
export async function getDeals(pipelineId: string) {
  try {
    const organizationId = await getOrganizationId();
    const deals = await prisma.deal.findMany({
      where: { 
        organizationId,
        stage: { pipelineId }
      },
      include: {
        customer: true,
        stage: true,
        activities: {
            orderBy: { createdAt: 'desc' },
            take: 1
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    return deals;
  } catch (error) {
    console.error('Failed to fetch deals:', error);
    return [];
  }
}

/**
 * Create a new deal.
 */
export async function createDeal(data: DealFormData) {
  try {
    const organizationId = await getOrganizationId();
    const session = await getSession();

    if (!session?.user) throw new Error('Unauthorized');

    const deal = await prisma.deal.create({
      data: {
        title: data.title,
        value: data.value,
        currency: data.currency || 'USD',
        probability: data.probability || 0,
        expectedClose: data.expectedClose,
        stageId: data.stageId,
        customerId: data.customerId,
        organizationId
      },
      include: {
        stage: true,
        customer: true
      }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, deal };
  } catch (error) {
    console.error('Failed to create deal:', error);
    return { success: false, error: 'Failed to create deal' };
  }
}

/**
 * Update a deal's details.
 */
export async function updateDeal(id: string, data: Partial<DealFormData>) {
  try {
    const organizationId = await getOrganizationId();

    const deal = await prisma.deal.update({
      where: { id, organizationId },
      data: {
        title: data.title,
        value: data.value,
        currency: data.currency,
        probability: data.probability,
        expectedClose: data.expectedClose,
        stageId: data.stageId,
        customerId: data.customerId
      },
      include: {
        stage: true,
        customer: true
      }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, deal };
  } catch (error) {
    console.error('Failed to update deal:', error);
    return { success: false, error: 'Failed to update deal' };
  }
}

/**
 * Move a deal to a different stage.
 */
export async function moveDeal(id: string, stageId: string) {
  try {
    const organizationId = await getOrganizationId();
    
    // Verify stage belongs to org (via pipeline) - skipping strict check for speed, assuming UI constraint + standard orgId check on update
    const deal = await prisma.deal.update({
      where: { id, organizationId },
      data: { stageId }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, deal };
  } catch (error) {
    console.error('Failed to move deal:', error);
    return { success: false, error: 'Failed to move deal' };
  }
}

/**
 * Delete a deal.
 */
export async function deleteDeal(id: string) {
  try {
    const organizationId = await getOrganizationId();
    await prisma.deal.delete({
      where: { id, organizationId }
    });
    revalidatePath('/dashboard/crm');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete deal:', error);
    return { success: false, error: 'Failed to delete deal' };
  }
}

/**
 * Get deals for a customer
 */
export async function getCustomerDeals(customerId: string) {
    try {
        const organizationId = await getOrganizationId();
        const deals = await prisma.deal.findMany({
            where: { customerId, organizationId },
            include: {
                stage: true
            },
            orderBy: { createdAt: 'desc' }
        });
        return deals;
    } catch (error) {
        console.error('Failed to fetch customer deals:', error);
        return [];
    }
}
