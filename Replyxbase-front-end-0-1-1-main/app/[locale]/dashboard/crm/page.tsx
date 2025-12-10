import React from 'react'
import CRM from './CRM'
import { getBookings, getBookingStats } from '@/app/actions/crm/bookings'
import { getCustomers } from '@/app/actions/crm/customers'
import { getCRMSettings } from '@/app/actions/crm/organization'
import { getActiveOrganization } from '@/app/actions/organization'
import { getActivities } from '@/app/actions/crm/activities'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function page({ searchParams }: PageProps) {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect('/login');
  }

  // Check for active organization
  const organization = await getActiveOrganization();
  if (!organization) {
    // Redirect to create organization or organization selection
    redirect('/dashboard');
  }

  const params = await searchParams;
  const pageNum = Number(params.page) || 1;
  const search = typeof params.search === 'string' ? params.search : '';
  const status = typeof params.status === 'string' ? params.status : 'all';
  const service = typeof params.service === 'string' ? params.service : 'all';
  const sortField = typeof params.sortField === 'string' ? params.sortField : 'date';
  const sortDirection = typeof params.sortDirection === 'string' ? params.sortDirection : 'desc';
  const view = typeof params.view === 'string' ? params.view : 'calendar';

  const [bookingsData, customersData, statsData, settings, activitiesData] = await Promise.all([
    getBookings(pageNum, 10, { search, status, service }, { field: sortField as any, direction: sortDirection as any }),
    getCustomers(),
    getBookingStats({ search, service }),
    getCRMSettings(),
    getActivities(1, 20)
  ]);

  const customers = customersData.success ? customersData.data : [];
  const activities = (activitiesData.success && activitiesData.data) ? activitiesData.data : [];

  return (
    <CRM 
      initialBookings={bookingsData.bookings || []} 
      initialPagination={{
        currentPage: bookingsData.currentPage || 1,
        totalPages: bookingsData.totalPages || 1,
        totalItems: bookingsData.totalItems || 0
      }}
      initialCustomers={customers}
      initialView={view as any}
      initialFilters={{
        search,
        status,
        service,
        sortField: sortField as any,
        sortDirection: sortDirection as any
      }}
      initialStats={statsData}
      initialSettings={settings}
      initialActivities={activities}
    />
  )
}

export default page