"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateOrganization(data: {
  organizationId: string;
  name?: string;
  slug?: string;
  logo?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify user is a member of the organization
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: data.organizationId,
    },
  });

  if (!membership) {
    return { success: false, error: "You must be a member of this organization" };
  }

  try {
    const updateData: {
      name?: string;
      slug?: string;
      logo?: string;
    } = {};

    if (data.name) updateData.name = data.name;
    if (data.slug) {
      // Check if slug is available
      const existing = await prisma.organization.findFirst({
        where: {
          slug: data.slug,
          id: { not: data.organizationId },
        },
      });
      if (existing) {
        return { success: false, error: "Slug already taken" };
      }
      updateData.slug = data.slug;
    }
    if (data.logo !== undefined) updateData.logo = data.logo;

    const updatedOrg = await prisma.organization.update({
      where: { id: data.organizationId },
      data: updateData,
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: updatedOrg };
  } catch (error) {
    console.error("Failed to update organization:", error);
    return { success: false, error: "Failed to update organization" };
  }
}

export async function updateOrganizationLogo(organizationId: string, logoUrl: string) {
  return updateOrganization({ organizationId, logo: logoUrl });
}

export async function updateOrganizationStatus(data: {
  organizationId: string;
  status: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    return { success: false, error: "Unauthorized" };
  }

  // Verify user is admin or owner
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: data.organizationId,
      OR: [
        { role: "admin" },
        { role: "owner" },
      ],
    },
  });

  if (!membership) {
    return { success: false, error: "Only admin or owner can update status" };
  }

  try {
    // Get current metadata
    const org = await prisma.organization.findUnique({
      where: { id: data.organizationId },
      select: { metadata: true },
    });

    // Parse metadata or create new object
    let metadataObj: any = {};
    if (org?.metadata) {
      try {
        metadataObj = typeof org.metadata === 'string' ? JSON.parse(org.metadata) : org.metadata;
      } catch {
        metadataObj = {};
      }
    }

    // Update status in metadata
    metadataObj.status = data.status;

    // Update organization with new metadata
    const updatedOrg = await prisma.organization.update({
      where: { id: data.organizationId },
      data: {
        metadata: JSON.stringify(metadataObj),
      },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: updatedOrg };
  } catch (error) {
    console.error("Failed to update organization status:", error);
    return { success: false, error: "Failed to update organization status" };
  }
}


