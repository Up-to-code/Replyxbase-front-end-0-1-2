"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface NotificationPreferences {
  email: {
    marketing: boolean;
    security: boolean;
    updates: boolean;
  };
  push: {
    comments: boolean;
    mentions: boolean;
    reminders: boolean;
  };
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email: {
    marketing: true,
    security: true,
    updates: false,
  },
  push: {
    comments: true,
    mentions: true,
    reminders: true,
  },
};

export async function getNotificationPreferences() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized", data: null };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { metadata: true },
    });

    if (user?.metadata) {
      const metadata = user.metadata as Record<string, any>;
      const preferences = metadata.notificationPreferences as NotificationPreferences | undefined;
      
      if (preferences) {
        return { 
          success: true, 
          data: preferences 
        };
      }
    }

    // Return default preferences if none stored
    return { 
      success: true, 
      data: DEFAULT_PREFERENCES 
    };
  } catch (error) {
    console.error("Failed to get notification preferences:", error);
    return { 
      success: false, 
      error: "Failed to get notification preferences",
      data: null 
    };
  }
}

export async function updateNotificationPreferences(
  preferences: NotificationPreferences
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // Validate preferences structure
    const validatedPreferences: NotificationPreferences = {
      email: {
        marketing: Boolean(preferences.email?.marketing ?? DEFAULT_PREFERENCES.email.marketing),
        security: Boolean(preferences.email?.security ?? DEFAULT_PREFERENCES.email.security),
        updates: Boolean(preferences.email?.updates ?? DEFAULT_PREFERENCES.email.updates),
      },
      push: {
        comments: Boolean(preferences.push?.comments ?? DEFAULT_PREFERENCES.push.comments),
        mentions: Boolean(preferences.push?.mentions ?? DEFAULT_PREFERENCES.push.mentions),
        reminders: Boolean(preferences.push?.reminders ?? DEFAULT_PREFERENCES.push.reminders),
      },
    };

    // Get current user metadata
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { metadata: true },
    });

    const currentMetadata = (user?.metadata as Record<string, any>) || {};
    const updatedMetadata = {
      ...currentMetadata,
      notificationPreferences: validatedPreferences,
    };

    // Save to user metadata
    await prisma.user.update({
      where: { id: session.user.id },
      data: { metadata: updatedMetadata as any },
    });

    revalidatePath("/dashboard/settings");
    return { success: true, data: validatedPreferences };
  } catch (error) {
    console.error("Failed to update notification preferences:", error);
    return { success: false, error: "Failed to update notification preferences" };
  }
}



