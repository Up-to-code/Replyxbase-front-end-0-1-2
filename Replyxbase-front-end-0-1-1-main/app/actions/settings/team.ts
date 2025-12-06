"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Utility to ensure the current user is an admin or owner of the organization.
 */
async function requireAdminOrOwner(organizationId: string, userId: string) {
  const membership = await prisma.member.findFirst({
    where: {
      userId,
      organizationId,
      OR: [
        { role: "admin" },
        { role: "owner" },
      ],
    },
  });
  if (!membership) {
    return false;
  }
  return membership;
}

/**
 * Invite a user to the organization
 * Only admin or owner can invite members
 */
export async function inviteMember(data: {
  organizationId: string;
  email: string;
  role?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    return { success: false, error: "Unauthorized" };
  }

  const adminMembership = await requireAdminOrOwner(data.organizationId, session.user.id);
  if (!adminMembership) {
    return { success: false, error: "Only admin or owner can invite members" };
  }

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Check if user is already a member
    if (existingUser) {
      const existingMember = await prisma.member.findFirst({
        where: {
          userId: existingUser.id,
          organizationId: data.organizationId,
        },
      });

      if (existingMember) {
        return { success: false, error: "User is already a member" };
      }
    }

    // Check for existing pending invitation
    const existingInvitation = await prisma.invitation.findFirst({
      where: {
        organizationId: data.organizationId,
        email: data.email,
        status: "pending",
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (existingInvitation) {
      return { success: false, error: "Invitation already sent" };
    }

    // Create invitation (expires in 7 days)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    const invitation = await prisma.invitation.create({
      data: {
        id: `inv_${Date.now()}_${Math.random().toString(36).substring(7)}`,
        organizationId: data.organizationId,
        email: data.email,
        role: data.role || "member", // Use provided role or default to member
        status: "pending",
        expiresAt,
        inviterId: session.user.id,
      },
    });

    // TODO: Send invitation email via better-auth's sendInvitationEmail hook
    // This will be called automatically if configured in auth.ts

    revalidatePath("/dashboard/settings");
    return { success: true, data: invitation };
  } catch (error) {
    console.error("Failed to invite member:", error);
    return {
      success: false,
      error: (error as Error)?.message || "Failed to invite member",
    };
  }
}

/**
 * Update member information
 * Only admin or owner can update members
 * Prevents changing the last owner's role
 */
export async function updateMember(data: {
  organizationId: string;
  memberId: string;
  role?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    return { success: false, error: "Unauthorized" };
  }

  const adminMembership = await requireAdminOrOwner(data.organizationId, session.user.id);
  if (!adminMembership) {
    return { success: false, error: "Only admin or owner can update members" };
  }

  try {
    // If changing role, check if this is the last owner
    if (data.role && data.role !== "owner") {
      const memberToUpdate = await prisma.member.findUnique({
        where: { id: data.memberId },
      });

      if (memberToUpdate?.role === "owner") {
        // Count total owners
        const ownerCount = await prisma.member.count({
          where: {
            organizationId: data.organizationId,
            role: "owner",
          },
        });

        if (ownerCount <= 1) {
          return {
            success: false,
            error: "Cannot change role: Organization must have at least one owner",
          };
        }
      }
    }

    const updateData: { role?: string } = {};
    if (data.role) updateData.role = data.role;

    const updatedMember = await prisma.member.update({
      where: { id: data.memberId },
      data: updateData,
      include: { user: true },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: updatedMember };
  } catch (error) {
    console.error("Failed to update member:", error);
    return { success: false, error: "Failed to update member" };
  }
}

/**
 * Remove a member from the organization
 * Only admin or owner can remove members
 * Prevents removing owners
 */
export async function removeMember(data: {
  organizationId: string;
  memberId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || !session.session.activeOrganizationId) {
    return { success: false, error: "Unauthorized" };
  }

  const adminMembership = await requireAdminOrOwner(data.organizationId, session.user.id);
  if (!adminMembership) {
    return { success: false, error: "Only admin or owner can remove members" };
  }

  // Prevent removing yourself
  if (adminMembership.id === data.memberId) {
    return {
      success: false,
      error: "Cannot remove yourself from the organization",
    };
  }

  try {
    // Check if member is an owner
    const memberToRemove = await prisma.member.findUnique({
      where: { id: data.memberId },
    });

    if (memberToRemove?.role === "owner") {
      return {
        success: false,
        error: "Cannot remove owner. Please change their role first or ensure there is another owner.",
      };
    }

    await prisma.member.delete({
      where: { id: data.memberId },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove member:", error);
    return { success: false, error: "Failed to remove member" };
  }
}


/**
 * Get all members of an organization
 * Still allows any member to view the list.
 */
export async function getOrganizationMembers(organizationId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  const targetOrgId = organizationId || session.session.activeOrganizationId;

  if (!targetOrgId) {
    return { success: false, error: "No organization selected", data: [] };
  }

  // Verify membership
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: targetOrgId,
    },
  });

  if (!membership) {
    return { success: false, error: "Not a member", data: [] };
  }

  try {
    const members = await prisma.member.findMany({
      where: {
        organizationId: targetOrgId,
      },
      include: {
        user: true,
      },
      orderBy: {
        id: "asc",
      },
    });

    return { success: true, data: members };
  } catch (error) {
    console.error("Failed to get members:", error);
    return { success: false, error: "Failed to get members", data: [] };
  }
}

/**
 * Get pending invitations for an organization
 * Still allows any member to view pending invitations.
 */
export async function getPendingInvitations(organizationId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  const targetOrgId = organizationId || session.session.activeOrganizationId;

  if (!targetOrgId) {
    return { success: false, error: "No organization selected", data: [] };
  }

  // Verify membership
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: targetOrgId,
    },
  });

  if (!membership) {
    return { success: false, error: "You must be a member of this organization", data: [] };
  }

  try {
    const invitations = await prisma.invitation.findMany({
      where: {
        organizationId: targetOrgId,
        status: "pending",
        expiresAt: {
          gt: new Date(),
        },
      },
      include: {
        user: true, // The inviter
      },
      orderBy: {
        id: "desc",
      },
    });

    return { success: true, data: invitations };
  } catch (error) {
    console.error("Failed to get invitations:", error);
    return { success: false, error: "Failed to get invitations", data: [] };
  }
}

/**
 * Cancel a pending invitation
 * Only admin or owner can cancel invitations.
 */
export async function cancelInvitation(data: {
  organizationId: string;
  invitationId: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  const adminMembership = await requireAdminOrOwner(data.organizationId, session.user.id);
  if (!adminMembership) {
    return { success: false, error: "Only admin or owner can cancel invitations" };
  }

  try {
    await prisma.invitation.delete({
      where: { id: data.invitationId },
    });

    revalidatePath("/dashboard/settings");
    return { success: true };
  } catch (error) {
    console.error("Failed to cancel invitation:", error);
    return { success: false, error: "Failed to cancel invitation" };
  }
}


/**
 * Get a single member of an organization
 */
export async function getMember(organizationId: string, memberId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized", data: null };
  }

  // Verify membership of the requester
  const membership = await prisma.member.findFirst({
    where: {
      userId: session.user.id,
      organizationId: organizationId,
    },
  });

  if (!membership) {
    return { success: false, error: "Not a member", data: null };
  }

  try {
    const member = await prisma.member.findUnique({
      where: {
        id: memberId,
        organizationId: organizationId,
      },
      include: {
        user: true,
      },
    });

    if (!member) {
      return { success: false, error: "Member not found", data: null };
    }

    return { success: true, data: member };
  } catch (error) {
    console.error("Failed to get member:", error);
    return { success: false, error: "Failed to get member", data: null };
  }
}
