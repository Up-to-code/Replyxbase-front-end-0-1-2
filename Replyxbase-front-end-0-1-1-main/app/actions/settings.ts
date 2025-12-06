import { unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth-server";
import { getActiveOrganization } from "@/app/actions/organization";
import { redirect } from "next/navigation";

// Cached function to get user data
export const getCachedUser = unstable_cache(
  async (userId: string) => {
    return prisma.user.findUnique({
      where: { id: userId },
    });
  },
  ["settings-user"],
  {
    revalidate: 3600, // Cache for 1 hour
    tags: ["user-profile"],
  }
);

// Cached function to get organization data
export const getCachedOrganization = unstable_cache(
  async (organizationId: string) => {
    return prisma.organization.findUnique({
      where: { id: organizationId },
      include: {
        members: {
          include: {
            user: true
          }
        }
      }
    });
  },
  ["settings-organization"],
  {
    revalidate: 300, // Cache for 5 minutes
    tags: ["organization", "members"],
  }
);

export async function getSettingsData() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/login");
  }

  const activeOrganization = await getActiveOrganization();
  
  if (!activeOrganization) {
    return { user: null, organization: null };
  }

  const [user, organization] = await Promise.all([
    getCachedUser(session.user.id),
    getCachedOrganization(activeOrganization.id),
  ]);

  if (!user || !organization) {
    return { user: null, organization: null };
  }

  return { user, organization };
}
