import { getSession } from '@/lib/auth-server';

export async function getOrganizationId() {
  const session = await getSession();
  if (!session?.session?.activeOrganizationId) {
    throw new Error('No active organization');
  }
  return session.session.activeOrganizationId;
}
