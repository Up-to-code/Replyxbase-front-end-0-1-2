"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";

export async function getAgents(organizationId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const targetOrgId = organizationId || session.session.activeOrganizationId;

  if (!targetOrgId) {
    return [];
  }

  // Verify membership
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: targetOrgId,
    },
  });

  if (!membership) {
    return [];
  }

  const agents = await prisma.agent.findMany({
    where: {
      organizationId: targetOrgId,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return agents;
}

export async function createAgent(data: {
  name: string;
  role?: string;
  isWebsiteEnabled?: boolean;
  isWhatsappEnabled?: boolean;
  isDmEnabled?: boolean;
  systemPrompt?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    throw new Error("Unauthorized");
  }

  // Verify membership
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: session.session.activeOrganizationId,
    },
  });

  if (!membership) {
    throw new Error("Unauthorized");
  }

  const agent = await prisma.agent.create({
    data: {
      name: data.name,
      role: data.role || "assistant",
      organizationId: session.session.activeOrganizationId,
      isWebsiteEnabled: data.isWebsiteEnabled || false,
      isWhatsappEnabled: data.isWhatsappEnabled || false,
      isDmEnabled: data.isDmEnabled || false,
      config: data.systemPrompt ? { systemPrompt: data.systemPrompt } : {},
    },
  });

  return agent;
}

export async function updateAgent(id: string, data: {
  name?: string;
  role?: string;
  status?: string;
  isWebsiteEnabled?: boolean;
  isWhatsappEnabled?: boolean;
  isDmEnabled?: boolean;
  config?: any;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    throw new Error("Unauthorized");
  }

  // Verify membership
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: session.session.activeOrganizationId,
    },
  });

  if (!membership) {
    throw new Error("Unauthorized");
  }

  // Verify agent belongs to org
  const existingAgent = await prisma.agent.findFirst({
    where: {
      id,
      organizationId: session.session.activeOrganizationId,
    },
  });

  if (!existingAgent) {
    throw new Error("Agent not found");
  }

  const agent = await prisma.agent.update({
    where: {
      id,
    },
    data,
  });

  return agent;
}

export async function deleteAgent(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    throw new Error("Unauthorized");
  }

  // Verify membership
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: session.session.activeOrganizationId,
    },
  });

  if (!membership) {
    throw new Error("Unauthorized");
  }

  // Verify agent belongs to org
  const existingAgent = await prisma.agent.findFirst({
    where: {
      id,
      organizationId: session.session.activeOrganizationId,
    },
  });

  if (!existingAgent) {
    throw new Error("Agent not found");
  }

  await prisma.agent.delete({
    where: {
      id,
    },
  });

  return true;
}
