import { getSettingsData } from "@/app/actions/settings";
import { getMember } from "@/app/actions/settings/team";
import EditMemberForm from "./EditMemberForm";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ memberId: string }>;
}

export default async function EditMemberPage({ params }: PageProps) {
  const { memberId } = await params;
  const { organization } = await getSettingsData();
  const memberResult = await getMember(organization.id, memberId);

  if (!memberResult.success || !memberResult.data) {
    redirect("/dashboard/settings/team");
  }

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <EditMemberForm 
        organizationId={organization.id} 
        member={memberResult.data} 
      />
    </div>
  );
}
