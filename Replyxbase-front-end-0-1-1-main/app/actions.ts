'use server';

import prisma from '@/lib/prisma';

export async function checkSlugAvailability(slug: string) {
  if (!slug || slug.length < 3) {
    return { available: false, error: 'slugTooShort' };
  }

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { available: false, error: 'slugInvalid' };
  }

  try {
    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    if (existingOrg) {
      return { available: false, error: 'slugTaken' };
    }

    return { available: true };
  } catch (error) {
    console.error("Error checking slug availability:", error);
    return { available: false, error: 'error' };
  }
}

// TODO: Implement alternative backend for user password updates

// Authenticated mutation via server function
export async function updatePassword({
  currentPassword,
  newPassword,
}: {
  currentPassword: string;
  newPassword: string;
}) {
  // TODO: Implement with new backend
  throw new Error("Password update functionality requires backend implementation");
}