'use server';

import prisma from '@/lib/prisma';
import { getSession } from '@/lib/auth-server';
import { getOrganizationId } from './utils';
import { revalidatePath } from 'next/cache';

/**
 * Get all pipelines for the organization, including their stages ordered by 'order'.
 */
export async function getPipelines() {
  try {
    const organizationId = await getOrganizationId();
    const pipelines = await prisma.pipeline.findMany({
      where: { organizationId },
      include: {
        stages: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'asc' }
    });
    return pipelines;
  } catch (error) {
    console.error('Failed to fetch pipelines:', error);
    return [];
  }
}

/**
 * Get a single pipeline by ID.
 */
export async function getPipeline(id: string) {
  try {
    const organizationId = await getOrganizationId();
    const pipeline = await prisma.pipeline.findUnique({
      where: { id, organizationId },
      include: {
        stages: {
          orderBy: { order: 'asc' }
        }
      }
    });
    return pipeline;
  } catch (error) {
    console.error('Failed to fetch pipeline:', error);
    return null;
  }
}

/**
 * Create a new pipeline with default stages if none provided.
 */
export async function createPipeline(name: string, stages?: { name: string; color?: string }[]) {
  try {
    const organizationId = await getOrganizationId();
    const session = await getSession(); // Ensure auth

    // Default stages if none provided
    const initialStages = stages && stages.length > 0 ? stages : [
      { name: 'Lead', color: '#3B82F6' },       // Blue
      { name: 'Contacted', color: '#F59E0B' },  // Amber
      { name: 'Meeting', color: '#8B5CF6' },    // Purple
      { name: 'Proposal', color: '#EC4899' },   // Pink
      { name: 'Negotiation', color: '#EF4444' },// Red
      { name: 'Closed', color: '#10B981' }      // Green
    ];

    const pipeline = await prisma.pipeline.create({
      data: {
        name,
        organizationId,
        stages: {
          create: initialStages.map((stage, index) => ({
            name: stage.name,
            color: stage.color || '#3B82F6',
            order: index
          }))
        }
      },
      include: { stages: true }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, pipeline };
  } catch (error) {
    console.error('Failed to create pipeline:', error);
    return { success: false, error: 'Failed to create pipeline' };
  }
}

/**
 * Update a pipeline's details (name, isDefault).
 */
export async function updatePipeline(id: string, data: { name?: string; isDefault?: boolean }) {
  try {
    const organizationId = await getOrganizationId();

    const pipeline = await prisma.pipeline.update({
      where: { id, organizationId },
      data,
    });

    // If setting as default, unset others (logic could be refined for atomicity but this is fine for now)
    if (data.isDefault) {
      await prisma.pipeline.updateMany({
        where: { organizationId, id: { not: id } },
        data: { isDefault: false }
      });
    }

    revalidatePath('/dashboard/crm');
    return { success: true, pipeline };
  } catch (error) {
    console.error('Failed to update pipeline:', error);
    return { success: false, error: 'Failed to update pipeline' };
  }
}

/**
 * Delete a pipeline.
 */
export async function deletePipeline(id: string) {
  try {
    const organizationId = await getOrganizationId();
    await prisma.pipeline.delete({
      where: { id, organizationId }
    });
    revalidatePath('/dashboard/crm');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete pipeline:', error);
    return { success: false, error: 'Failed to delete pipeline' };
  }
}

// --- Stages ---

/**
 * Create a new stage in a pipeline.
 */
export async function createStage(pipelineId: string, name: string, color: string = '#3B82F6') {
  try {
    // Get max order
    const lastStage = await prisma.stage.findFirst({
      where: { pipelineId },
      orderBy: { order: 'desc' }
    });
    const order = lastStage ? lastStage.order + 1 : 0;

    const stage = await prisma.stage.create({
      data: {
        pipelineId,
        name,
        color,
        order
      }
    });
    revalidatePath('/dashboard/crm');
    return { success: true, stage };
  } catch (error) {
    console.error('Failed to create stage:', error);
    return { success: false, error: 'Failed to create stage' };
  }
}

/**
 * Update stage details.
 */
export async function updateStage(id: string, data: { name?: string; color?: string }) {
  try {
    const stage = await prisma.stage.update({
      where: { id },
      data
    });
    revalidatePath('/dashboard/crm');
    return { success: true, stage };
  } catch (error) {
    console.error('Failed to update stage:', error);
    return { success: false, error: 'Failed to update stage' };
    }
}

/**
 * Delete a stage.
 */
export async function deleteStage(id: string) {
    try {
        await prisma.stage.delete({
            where: { id }
        });
        revalidatePath('/dashboard/crm');
        return { success: true };
    } catch (error) {
       console.error('Failed to delete stage:', error);
       return { success: false, error: 'Failed to delete stage' }; 
    }
}

/**
 * Reorder stages in a pipeline.
 * Expects an array of stage objects with their new order.
 */
export async function updateStageOrder(pipelineId: string, stages: { id: string; order: number }[]) {
  try {
    // Transaction for safety
    await prisma.$transaction(
      stages.map(stage => 
        prisma.stage.update({
          where: { id: stage.id, pipelineId },
          data: { order: stage.order }
        })
      )
    );
    revalidatePath('/dashboard/crm');
    return { success: true };
  } catch (error) {
    console.error('Failed to update stage order:', error);
    return { success: false, error: 'Failed to update stage order' };
  }
}
