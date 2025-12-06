"use client";

import { User, Settings, Bell, Palette, CreditCard, Building2, Users } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/navigation';

interface SettingsSidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
}

export const SettingsSidebar: React.FC<SettingsSidebarProps> = ({ activeTab, setActiveTab }) => {
  const t = useTranslations("Dashboard.Settings.nav");
  const tOrg = useTranslations("Dashboard.Settings.Organization");
  const tTeam = useTranslations("Dashboard.Settings.Team");
  const pathname = usePathname();

  const menuItems = [
    { id: 'profile', label: t('profile'), icon: User, href: '/dashboard/settings/profile' },
    { id: 'organization', label: tOrg('title'), icon: Building2, href: '/dashboard/settings/organization' },
    { id: 'team', label: tTeam('title'), icon: Users, href: '/dashboard/settings/team' },
    { id: 'notifications', label: t('notifications'), icon: Bell, href: '/dashboard/settings/notifications' },
    { id: 'appearance', label: t('appearance'), icon: Palette, href: '/dashboard/settings/appearance' },
    { id: 'billing', label: t('billing'), icon: CreditCard, href: '/dashboard/settings/billing' },
  ];

  return (
    <nav className="w-full space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab?.(item.id)}
            className={`w-full flex items-center gap-4 px-6 py-4 text-base font-medium rounded-lg transition-all duration-200 border-2
              ${(activeTab === item.id || (!activeTab && isActive)) 
                ? 'bg-[#005bbc] text-white border-[#005bbc]' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border-transparent hover:border-slate-200'
              }`}
          >
            <Icon className={`w-5 h-5 ${(activeTab === item.id || (!activeTab && isActive)) ? 'text-white' : 'text-slate-400 group-hover:text-slate-900'}`} />
            {item.label}
          </button>
        );
      })}
    </nav>
  );
};
