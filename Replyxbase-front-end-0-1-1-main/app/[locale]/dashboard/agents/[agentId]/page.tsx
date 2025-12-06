import React, { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import AgentDetailsClient from './components/AgentDetailsClient';
import { notFound, redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function generateMetadata({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  
  const agent = await prisma.agent.findUnique({
    where: { id: agentId },
    select: { name: true }
  });

  const t = await getTranslations("Dashboard.Agents.Detail");

  if (!agent) {
    return {
      title: t("notFoundTitle"),
    };
  }

  return {
    title: `${agent.name} - ${t("title")}`,
  };
}

export default async function AgentDashboardPage({ params }: { params: Promise<{ agentId: string }> }) {
  const { agentId } = await params;
  
  // Auth is already checked in the dashboard layout
  // Get session only to verify organization (layout ensures session exists)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const organizationId = session?.session?.activeOrganizationId;

  // If no organization (shouldn't happen due to layout check, but safety)
  if (!organizationId) {
    redirect("/dashboard");
  }

  // Fetch agent and verify it belongs to the active organization
  const agent = await prisma.agent.findFirst({
    where: {
      id: agentId,
      organizationId: organizationId
    }
  });

  if (!agent) {
    notFound();
  }

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#005bbc]"></div>
      </div>
    }>
      <AgentDetailsClient agent={agent} />
    </Suspense>
  );
}
