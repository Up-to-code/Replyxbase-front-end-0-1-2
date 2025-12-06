import { getSettingsData } from "@/app/actions/settings";
import { BillingSettings } from "../components/BillingSettings";

export default async function BillingSettingsPage() {
  const { organization } = await getSettingsData();

  return <BillingSettings organization={organization} />;
}
