import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import { CreateOrganization } from "@/components/auth/CreateOrganization";
import { DashboardLayoutClient } from "./components/DashboardLayoutClient";

import { getAgents } from "@/app/actions/agent";
import { getOrganizations, getActiveOrganization } from "@/app/actions/organization";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Check if user has any organizations in the database
  const organizations = await getOrganizations();

  // If user has no organizations at all, show create organization screen
  if (organizations.length === 0) {
    return <CreateOrganization />;
  }

  // Get active organization (this will return the first one if no active is set)
  const activeOrganization = await getActiveOrganization();
  
  // If still no organization found (shouldn't happen, but safety check)
  if (!activeOrganization) {
    return <CreateOrganization />;
  }

  // Fetch agents using the active organization ID
  const agents = await getAgents(activeOrganization.id);

  return <DashboardLayoutClient agents={agents}>{children}</DashboardLayoutClient>;
};

export default DashboardLayout;

