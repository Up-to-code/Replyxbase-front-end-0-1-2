import { getSettingsData } from "@/app/actions/settings";
import { OrganizationSettings } from "../components/OrganizationSettings";

export default async function OrganizationSettingsPage() {
  const { organization } = await getSettingsData();

  return <OrganizationSettings organization={organization} />;
}
