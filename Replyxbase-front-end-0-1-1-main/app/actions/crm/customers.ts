'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { getOrganizationId } from './utils';
import { Customer } from '@/app/[locale]/dashboard/crm/types';

export async function createLead(data: {
  fullName: string;
  email: string;
  phone?: string;
  source?: string;
}) {
  try {
    const organizationId = await getOrganizationId();

    // Check if customer exists
    let customer = await prisma.customer.findFirst({
      where: {
        organizationId,
        email: data.email,
      }
    });

    if (customer) {
      return { success: true, customer, isNew: false };
    }

    customer = await prisma.customer.create({
      data: {
        organizationId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        status: 'lead',
        notes: `Lead captured via ${data.source || 'website widget'}`,
      }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, customer, isNew: true };
  } catch (error) {
    console.error('Failed to create lead:', error);
    return { success: false, error: 'Failed to create lead' };
  }
}

export async function createCustomer(data: {
  fullName: string;
  email: string;
  phone?: string;
  company?: string;
  address?: string;
  status?: string;
  notes?: string;
}) {
  try {
    const organizationId = await getOrganizationId();

    // Check if customer exists
    const existing = await prisma.customer.findFirst({
      where: {
        organizationId,
        email: data.email,
      }
    });

    if (existing) {
      return { success: false, error: 'Customer with this email already exists' };
    }

    const customer = await prisma.customer.create({
      data: {
        organizationId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone || '',
        company: data.company,
        address: data.address,
        status: data.status || 'active',
        notes: data.notes,
      }
    });

    revalidatePath('/dashboard/crm');
    return { success: true, customer };
  } catch (error) {
    console.error('Failed to create customer:', error);
    return { success: false, error: 'Failed to create customer' };
  }
}


export async function getCustomers() {
  try {
    const organizationId = await getOrganizationId();
    const customers = await prisma.customer.findMany({
      where: { organizationId },
      orderBy: { createdAt: 'desc' },
    });
    return { success: true, data: customers as unknown as Customer[] };
  } catch (error) {
    console.error('Failed to fetch customers:', error);
    return { success: false, error: 'Failed to fetch customers', data: [] };
  }
}

export async function updateCustomer(id: string, data: Partial<Customer>) {
  try {
    const organizationId = await getOrganizationId();
    
    // Verify ownership
    const existing = await prisma.customer.findFirst({
        where: { id, organizationId }
    });

    if (!existing) {
        throw new Error("Customer not found");
    }

    const { id: _, ...updateData } = data as any; // Exclude ID from update data

    const customer = await prisma.customer.update({
      where: { id },
      data: updateData
    });

    revalidatePath('/dashboard/crm');
    return { success: true, customer };
  } catch (error) {
    console.error('Failed to update customer:', error);
    return { success: false, error: 'Failed to update customer' };
  }
}
