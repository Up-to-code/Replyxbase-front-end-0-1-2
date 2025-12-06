'use client';

import React, { useState, Suspense } from 'react';
import { useTranslations } from 'next-intl';
import { SettingsSidebar } from './SettingsSidebar';
import { ProfileSettings } from './ProfileSettings';
import { OrganizationSettings } from './OrganizationSettings';
import { TeamSettings } from './TeamSettings';
import { NotificationsSettings } from './NotificationsSettings';
import { AppearanceSettings } from './AppearanceSettings';
import { BillingSettings } from './BillingSettings';
import { Loader2 } from 'lucide-react';
import { User, Organization, Member } from '@prisma/client';

interface SettingsClientProps {
  user: User;
  organization: Organization & {
    members: (Member & { user: User })[];
  };
}

// Loading component for settings content
const SettingsContentLoader = () => (
  <div className="animate-fade-in space-y-8">
    <div className="mb-10">
      <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse mb-3" />
      <div className="h-5 w-96 bg-slate-100 rounded-lg animate-pulse" />
    </div>
    <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="h-5 w-32 bg-slate-100 rounded animate-pulse" />
          <div className="h-14 bg-slate-50 border-2 border-slate-200 rounded-xl animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

export const SettingsClient: React.FC<SettingsClientProps> = ({ user, organization }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const t = useTranslations("Dashboard.Settings");

  const renderContent = () => {
    const contentMap = {
      profile: <ProfileSettings user={user} />,
      organization: <OrganizationSettings organization={organization} />,
      team: <TeamSettings organizationId={organization.id} />,
      notifications: <NotificationsSettings />,
      appearance: <AppearanceSettings />,
      billing: <BillingSettings organization={organization} />,
    };

    return contentMap[activeTab as keyof typeof contentMap] || (
      <div className="flex items-center justify-center h-64 text-slate-400">
        <p>Content for {activeTab} coming soon...</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="px-12 py-10 border-b-2 border-slate-200">
        <h1 className="text-3xl font-bold text-slate-900">{t("title")}</h1>
        <p className="text-lg text-slate-500 mt-2">{t("subtitle")}</p>
      </div>

      {/* Main Content */}
      <div className="max-w-[1600px] mx-auto px-12 py-12">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Sidebar */}
          <div className="shrink-0 w-72">
            <SettingsSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* Content Area */}
          <div className="flex-1 max-w-4xl">
            <Suspense fallback={<SettingsContentLoader />}>
              {renderContent()}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};
