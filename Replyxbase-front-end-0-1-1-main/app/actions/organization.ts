"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getOrganizations() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return [];
  }

  const memberships = await prisma.member.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      organization: true,
    },
  });

  return memberships.map((m) => m.organization);
}

export async function getActiveOrganization() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return null;
  }

  const activeOrgId = session.session.activeOrganizationId;

  if (!activeOrgId) {
    // If no active org, try to find the first one
    const firstOrg = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        organization: true,
      },
    });
    return firstOrg?.organization || null;
  }

  const organization = await prisma.organization.findUnique({
    where: {
      id: activeOrgId,
    },
  });

  return organization;
}

export async function getOrganizationMembers(organizationId?: string) {
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

  const members = await prisma.member.findMany({
    where: {
      organizationId: targetOrgId,
    },
    include: {
      user: true,
    },
  });

  return members;
}

export async function createOrganization(data: { name: string; slug: string }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  try {
    const org = await auth.api.createOrganization({
        headers: await headers(),
        body: {
            name: data.name,
            slug: data.slug,
        }
    })
    return org;
  } catch (error) {
    console.error("Failed to create organization:", error);
    throw error;
  }
}

export async function setActiveOrganization(organizationId: string) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session?.user) {
        throw new Error("Unauthorized");
    }

    await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
            organizationId
        }
    })
}
