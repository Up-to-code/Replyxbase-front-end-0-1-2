import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { InboxClient } from './components/InboxClient';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard.Inbox");
  
  return {
    title: 'Inbox | Dashboard',
    description: 'Manage customer conversations',
  };
}

export default function InboxPage() {
  return <InboxClient />;
}
