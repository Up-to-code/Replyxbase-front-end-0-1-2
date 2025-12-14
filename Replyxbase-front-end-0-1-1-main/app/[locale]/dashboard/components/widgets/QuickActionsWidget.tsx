'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Calendar, UserPlus, Bot, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';

interface QuickAction {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
}

export const QuickActionsWidget: React.FC = () => {
  const t = useTranslations("Dashboard.Home");

  const actions: QuickAction[] = [
    { icon: Calendar, label: t("actions.newBooking"), href: "/dashboard/crm?action=new_booking" },
    { icon: UserPlus, label: t("actions.addCustomer"), href: "/dashboard/crm/customers/new" },
    { icon: Bot, label: t("actions.createAgent"), href: "/dashboard/agents/create" },
    { icon: Plus, label: t("actions.more"), onClick: () => toast.info("More actions coming soon!") }
  ];

  const QuickAction = ({ action }: { action: QuickAction }) => {
    const Icon = action.icon;
    const content = (
      <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-slate-100 bg-white hover:border-[#005bbc]/30 hover:bg-slate-50 transition-all duration-200 cursor-pointer gap-2 h-full">
        <div className="w-10 h-10 rounded-full bg-[#005bbc]/10 flex items-center justify-center text-[#005bbc]">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-medium text-slate-700">{action.label}</span>
      </div>
    );

    if (action.href) {
      return <Link href={action.href} className="block h-full">{content}</Link>;
    }

    return <div onClick={action.onClick} className="h-full">{content}</div>;
  };

  return (
    <Card>
      <CardHeader className="pb-3 border-b-2 border-slate-100">
        <h2 className="text-base font-bold text-slate-900">{t("quickActions")}</h2>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, idx) => (
            <QuickAction key={idx} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

