"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: {
  name?: string;
  bio?: string;
  image?: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Get current user metadata
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { metadata: true },
    });

    const currentMetadata = (user?.metadata as Record<string, any>) || {};
    const updatedMetadata = { ...currentMetadata };

    // Save bio to metadata if provided
    if (data.bio !== undefined) {
      updatedMetadata.bio = data.bio;
    }

    const updateData: {
      name?: string;
      image?: string;
      metadata?: Record<string, any>;
    } = {
      ...(data.name && { name: data.name }),
      ...(data.image && { image: data.image }),
    };

    // Only update metadata if bio was provided
    if (data.bio !== undefined) {
      updateData.metadata = updatedMetadata;
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

export async function updateAvatar(imageUrl: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { image: imageUrl },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: updatedUser };
  } catch (error) {
    console.error("Failed to update avatar:", error);
    return { success: false, error: "Failed to update avatar" };
  }
}


