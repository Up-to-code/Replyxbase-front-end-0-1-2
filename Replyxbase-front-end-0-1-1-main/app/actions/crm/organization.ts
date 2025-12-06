'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getOrganizationId } from './utils';
import { Prisma } from '@prisma/client';

export async function updateCRMSettings(settings: any) {
  try {
    const organizationId = await getOrganizationId();

    const organization = await prisma.organization.update({
      where: { id: organizationId },
      data: {
        crmSettings: settings
      }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, settings: organization.crmSettings };
  } catch (error) {
    console.error('Failed to update CRM settings:', error);
    return { success: false, error: 'Failed to update CRM settings' };
  }
}

export async function getCRMSettings() {
    try {
        const organizationId = await getOrganizationId();
        const organization = await prisma.organization.findUnique({
            where: { id: organizationId },
            select: { crmSettings: true }
        });

        return organization?.crmSettings || {};
    } catch (error) {
        console.error('Failed to fetch CRM settings:', error);
        return {};
    }
}
