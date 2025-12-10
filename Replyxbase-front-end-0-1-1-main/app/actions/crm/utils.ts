import { getActiveOrganization } from '@/app/actions/organization';

export async function getOrganizationId() {
  const organization = await getActiveOrganization();
  if (!organization) {
    throw new Error('No active organization');
  }
  return organization.id;
}
