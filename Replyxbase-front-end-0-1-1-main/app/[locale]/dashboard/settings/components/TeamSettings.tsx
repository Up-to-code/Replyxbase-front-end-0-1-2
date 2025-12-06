"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, Mail, Loader2, Edit2 } from 'lucide-react';
import { Modal, ModalContent, ModalFooter } from '@/components/ui/Modal';
import { toast } from 'sonner';
import { removeMember, getOrganizationMembers, getPendingInvitations } from '@/app/actions/settings/team';
import { Member, User as PrismaUser } from '@prisma/client';
import { Link } from '@/navigation';

type MemberWithUser = Member & { user: PrismaUser };

interface TeamSettingsProps {
  organizationId: string;
}

export const TeamSettings: React.FC<TeamSettingsProps> = ({ organizationId }) => {
  const t = useTranslations("Dashboard.Settings.Team");
  const tModals = useTranslations("Dashboard.Settings.Team.Modals");
  
  const [members, setMembers] = useState<MemberWithUser[]>([]);
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [memberToRemove, setMemberToRemove] = useState<MemberWithUser | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Load members and invitations
  useEffect(() => {
    loadData();
  }, [organizationId]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [membersResult, invitationsResult] = await Promise.all([
        getOrganizationMembers(organizationId),
        getPendingInvitations(organizationId),
      ]);

      if (membersResult.success) {
        setMembers(membersResult.data || []);
      }
      if (invitationsResult.success) {
        setInvitations(invitationsResult.data || []);
      }
    } catch (error) {
      console.error("Failed to load team data:", error);
      toast.error("Failed to load team data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    setIsRemoving(true);
    try {
      const result = await removeMember({
        organizationId,
        memberId: memberToRemove.id,
      });

      if (result.success) {
        toast.success("Member removed successfully!");
        setMemberToRemove(null);
        loadData(); // Reload data
      } else {
        toast.error(result.error || "Failed to remove member");
      }
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove member");
    } finally {
      setIsRemoving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{t("title")}</h2>
          <p className="text-base text-slate-500 mt-2">{t("description")}</p>
        </div>
        <Link 
          href="/dashboard/settings/team/invite"
          className="flex items-center gap-3 px-6 py-3 h-auto rounded-lg text-sm font-semibold bg-[#005bbc] text-white hover:bg-[#004a9f] transition-all"
        >
          <Plus className="w-5 h-5" />
          {t("invite")}
        </Link>
      </div>

      {/* Team Members - Card Layout */}
      {isLoading ? (
        <div className="bg-white border-2 border-slate-200 rounded-xl p-12">
          <div className="flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white border-2 border-slate-200 rounded-xl p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-50 flex items-center justify-center border-2 border-slate-200">
            <Mail className="w-8 h-8 text-slate-400" />
          </div>
          <p className="text-sm font-medium text-slate-600 mb-1">No team members</p>
          <p className="text-xs text-slate-500">Invite members to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {members.map((member) => (
            <div
              key={member.id}
              className="bg-white border-2 border-slate-200 rounded-xl p-6 hover:border-slate-300 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 font-medium border-2 border-slate-200 flex-shrink-0">
                    {member.user.image ? (
                      <img
                        src={member.user.image}
                        alt={member.user.name || ""}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      member.user.name?.charAt(0).toUpperCase() || "U"
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-bold text-slate-900 truncate">
                      {member.user.name || member.user.email}
                    </p>
                    <p className="text-sm text-slate-500 truncate">{member.user.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold capitalize border-2 bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">
                    Active
                  </span>
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold capitalize border-2 bg-slate-100 text-slate-600 border-slate-200">
                    {member.role || "member"}
                  </span>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Link
                    href={`/dashboard/settings/team/${member.id}`}
                    className="text-slate-400 hover:text-[#005bbc] p-2 rounded-lg hover:bg-[#005bbc]/10 transition-colors border-2 border-transparent hover:border-[#005bbc]/20"
                    title="Edit Member"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  {member.role !== "owner" && (
                    <button
                      onClick={() => setMemberToRemove(member)}
                      disabled={isRemoving}
                      className="text-slate-400 hover:text-[#EF4444] p-2 rounded-lg hover:bg-[#EF4444]/10 transition-colors border-2 border-transparent hover:border-[#EF4444]/20 disabled:opacity-50"
                      title="Remove Member"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Remove Member Modal */}
      <Modal
        open={!!memberToRemove}
        onClose={() => setMemberToRemove(null)}
        title={tModals("RemoveMember.title")}
      >
        <ModalContent>
          <div className="space-y-4">
            <p className="text-slate-600 text-base leading-relaxed">
              {tModals("RemoveMember.confirmation", { name: memberToRemove?.user.name || memberToRemove?.user.email || '' })}
            </p>
            <div className="bg-slate-50 rounded-xl p-4 border-2 border-slate-200">
              <p className="text-sm font-semibold text-slate-700 mb-1">Member Details</p>
              <p className="text-base font-bold text-slate-900">{memberToRemove?.user.name || "No name"}</p>
              <p className="text-sm text-slate-500 mt-1">{memberToRemove?.user.email}</p>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
            <button 
              onClick={() => setMemberToRemove(null)}
            disabled={isRemoving}
            className="px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border-2 border-slate-200 disabled:opacity-50"
            >
              {tModals("RemoveMember.cancel")}
            </button>
            <button 
              onClick={handleRemoveMember}
            disabled={isRemoving}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#EF4444] hover:bg-[#DC2626] rounded-lg transition-colors border-2 border-[#EF4444] disabled:opacity-50 flex items-center gap-2"
            >
            {isRemoving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Removing...
              </>
            ) : (
              tModals("RemoveMember.confirm")
            )}
            </button>
        </ModalFooter>
      </Modal>
    </div>
  );
};
