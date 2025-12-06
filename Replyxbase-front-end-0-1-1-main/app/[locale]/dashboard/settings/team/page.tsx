import { getSettingsData } from "@/app/actions/settings";
import { TeamSettings } from "../components/TeamSettings";

export default async function TeamSettingsPage() {
  const { organization } = await getSettingsData();

  return <TeamSettings organizationId={organization.id} />;
}
