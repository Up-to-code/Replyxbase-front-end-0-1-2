'use client';

import React from 'react';
import { Customer } from '../../types';
import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { MessageSquare, MoreHorizontal, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface CustomersTabProps {
  customers: Customer[];
  onCustomerClick: (customer: Customer) => void;
  onAddCustomer?: () => void;
  // Sorting & Filtering
  sortField: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (field: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
}

export const CustomersTab: React.FC<CustomersTabProps> = ({ 
  customers, 
  onCustomerClick, 
  onAddCustomer,
  sortField,
  sortDirection,
  onSortChange,
  statusFilter,
  onStatusFilterChange
}) => {
  const t = useTranslations("Dashboard.CRM.Customers");

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return <div className="w-4 h-4" />; // Spacer
    return (
      <div className={`w-4 h-4 transition-transform ${sortDirection === 'desc' ? 'rotate-180' : ''}`}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-down"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center bg-slate-50/50 gap-4">
        <div>
            <h2 className="text-lg font-bold text-slate-900">{t('title')}</h2>
            <p className="text-sm text-slate-500">{t('subtitle', { count: customers.length })}</p>
        </div>
        
        <div className="flex items-center gap-3">
             <select 
                value={statusFilter}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-[#005bbc] focus:ring-1 focus:ring-[#005bbc]"
             >
                 <option value="all">{t('status.all') || "All Status"}</option>
                 <option value="active">{t('status.active')}</option>
                 <option value="inactive">{t('status.inactive')}</option>
                 <option value="lead">{t('status.lead')}</option>
             </select>

            <Button size="sm" onClick={onAddCustomer} className="bg-[#005bbc] hover:bg-[#004a9f] text-white">
                {t('addCustomer')}
            </Button>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
            <tr>
              <th 
                className="px-6 py-3 cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors select-none"
                onClick={() => onSortChange('fullName')}
              >
                  <div className="flex items-center gap-2">
                    {t('name')}
                    <SortIcon field="fullName" />
                  </div>
              </th>
              <th className="px-6 py-3">{t('contact')}</th>
              <th 
                className="px-6 py-3 cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors select-none"
                onClick={() => onSortChange('status')}
              >
                  <div className="flex items-center gap-2">
                    {t('statusColumn')}
                    <SortIcon field="status" />
                  </div>
              </th>
              <th 
                className="px-6 py-3 cursor-pointer hover:text-slate-700 hover:bg-slate-100 transition-colors select-none"
                onClick={() => onSortChange('lastVisit')}
              >
                   <div className="flex items-center gap-2">
                    {t('lastVisit')}
                    <SortIcon field="lastVisit" />
                  </div>
              </th>
              <th className="px-6 py-3 text-right">{t('actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {customers.length > 0 ? (
                customers.map((customer) => (
                <tr 
                    key={customer.id} 
                    onClick={() => onCustomerClick(customer)}
                    className="hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                    <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {customer.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900">{customer.fullName}</div>
                            <div className="text-xs text-slate-500">{customer.company || 'Individual'}</div>
                        </div>
                    </div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                            {customer.email && (
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Mail className="w-3 h-3" />
                                    <span>{customer.email}</span>
                                </div>
                            )}
                             {customer.phone && (
                                <div className="flex items-center gap-2 text-slate-600">
                                    <Phone className="w-3 h-3" />
                                    <span>{customer.phone}</span>
                                </div>
                            )}
                        </div>
                    </td>
                    <td className="px-6 py-4">
                    <Badge variant={customer.status === 'active' ? 'success' : 'secondary'} className="capitalize">
                        {customer.status}
                    </Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                        {customer.lastVisit ? format(new Date(customer.lastVisit), 'MMM d, yyyy') : '-'}
                    </td>
                    <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="icon" className="group-hover:opacity-100 opacity-0 transition-opacity">
                            <MoreHorizontal className="w-4 h-4 text-slate-400" />
                        </Button>
                    </td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        {t('noCustomers')}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
