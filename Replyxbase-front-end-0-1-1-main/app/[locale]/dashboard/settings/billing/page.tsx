import { getSettingsData } from "@/app/actions/settings";
import { BillingSettings } from "../components/BillingSettings";

import { redirect } from "next/navigation";

export default async function BillingSettingsPage() {
  const { organization } = await getSettingsData();

  if (!organization) {
    redirect("/dashboard");
  }

  return <BillingSettings organization={organization} />;
}
