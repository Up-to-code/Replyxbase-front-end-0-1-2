import { getSettingsData } from "@/app/actions/settings";
import InviteMemberForm from "./InviteMemberForm";
 
export default async function InviteMemberPage() {
  const { organization } = await getSettingsData();

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <InviteMemberForm organizationId={organization.id} />
    </div>
  );
}
