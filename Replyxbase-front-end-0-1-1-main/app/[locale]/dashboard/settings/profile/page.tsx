import { getSettingsData } from "@/app/actions/settings";
import { ProfileSettings } from "../components/ProfileSettings";

export default async function ProfileSettingsPage() {
  const { user } = await getSettingsData();

  return <ProfileSettings user={user} />;
}
