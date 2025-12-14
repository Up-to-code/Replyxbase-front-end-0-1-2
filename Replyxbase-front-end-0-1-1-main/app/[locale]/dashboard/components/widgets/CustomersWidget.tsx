'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Customer {
  id: string;
  fullName: string;
  email: string;
  status: string;
}

interface CustomersWidgetProps {
  customers: Customer[];
  title?: string;
  viewAllLink?: string;
  maxItems?: number;
}

export const CustomersWidget: React.FC<CustomersWidgetProps> = ({ 
  customers, 
  title = "Recent Customers",
  viewAllLink = "/dashboard/crm/customers",
  maxItems = 5
}) => {
  const displayCustomers = customers.slice(0, maxItems);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-sm text-[#005bbc] hover:underline font-medium">
            View All
          </Link>
        )}
      </CardHeader>
      <CardContent className="pt-0">
        {displayCustomers.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {displayCustomers.map((customer) => (
              <div 
                key={customer.id} 
                className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs">
                    {customer.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{customer.fullName}</p>
                    <p className="text-xs text-slate-500">{customer.email}</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {customer.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-6 text-center text-slate-500 text-sm">
            No recent customers.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

