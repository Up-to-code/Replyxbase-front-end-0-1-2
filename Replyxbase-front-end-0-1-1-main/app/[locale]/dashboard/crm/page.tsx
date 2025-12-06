import React from 'react'
import CRM from './CRM'
import { getBookings, getBookingStats } from '@/app/actions/crm/bookings'
import { getCustomers } from '@/app/actions/crm/customers'
import { getCRMSettings } from '@/app/actions/crm/organization'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

async function page({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = typeof params.search === 'string' ? params.search : '';
  const status = typeof params.status === 'string' ? params.status : 'all';
  const service = typeof params.service === 'string' ? params.service : 'all';
  const sortField = typeof params.sortField === 'string' ? params.sortField : 'date';
  const sortDirection = typeof params.sortDirection === 'string' ? params.sortDirection : 'desc';
  const view = typeof params.view === 'string' ? params.view : 'kanban';

  const [bookingsData, customersData, statsData, settings] = await Promise.all([
    getBookings(page, 10, { search, status, service }, { field: sortField as any, direction: sortDirection as any }),
    getCustomers(),
    getBookingStats({ search, service }),
    getCRMSettings()
  ]);

  const customers = customersData.success ? customersData.data : [];

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
    />
  )
}

export default page