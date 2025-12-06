"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';
import { updateMember } from '@/app/actions/settings/team';
import { useRouter } from 'next/navigation';
import { Link } from '@/navigation';
import { Member, User } from '@prisma/client';

type MemberWithUser = Member & { user: User };

interface EditMemberFormProps {
  organizationId: string;
  member: MemberWithUser;
}

export default function EditMemberForm({ organizationId, member }: EditMemberFormProps) {
  const tModals = useTranslations("Dashboard.Settings.Team.Modals");
  const tRoles = useTranslations("Dashboard.Settings.Team.roles");
  const router = useRouter();

  const [editRole, setEditRole] = useState<string>(member.role || "member");
  const [isUpdating, setIsUpdating] = useState(false);

  const roleOptions = [
    { value: "member", label: tRoles("member") },
    { value: "admin", label: tRoles("admin") },
    { value: "owner", label: tRoles("owner") },
  ];

  const handleEditMember = async () => {
    setIsUpdating(true);
    try {
      const result = await updateMember({
        organizationId,
        memberId: member.id,
        role: editRole,
      });

      if (result.success) {
        toast.success("Member updated successfully!");
        router.push("/dashboard/settings/team");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update member");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update member");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
       {/* Header with Back Button */}
       <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/settings/team"
          className="p-2 rounded-lg hover:bg-slate-50 transition-colors border-2 border-slate-200"
          title="Back to Team"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{tModals("EditMember.title")}</h2>
          <p className="text-base text-slate-500 mt-1">Edit member details and role</p>
        </div>
      </div>

      {/* Edit Member Table */}
      <div className="bg-white border-2 border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b-2 border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Field</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-slate-700">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-slate-200">
              <tr>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">Avatar</td>
                <td className="px-6 py-4">
                  <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-500 font-medium border-2 border-slate-200">
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
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">Name</td>
                <td className="px-6 py-4">
                  <div className="text-base font-bold text-slate-900">
                    {member.user.name || "No name"}
                  </div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">Email</td>
                <td className="px-6 py-4">
                  <div className="text-base text-slate-900">{member.user.email}</div>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">Status</td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold capitalize border-2 bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20">
                    Active
                  </span>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">
                  <label htmlFor="edit-role" className="block">{tModals("EditMember.role")}</label>
                </td>
                <td className="px-6 py-4">
                  <select
                    id="edit-role"
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    disabled={isUpdating}
                    className="w-full max-w-xs bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-2 focus:ring-[#005bbc]/10 rounded-xl px-5 py-3 text-base text-slate-900 transition-all duration-200 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {roleOptions.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm font-semibold text-slate-700">Member Since</td>
                <td className="px-6 py-4">
                  <div className="text-base text-slate-600">
                    {new Date(member.createdAt).toLocaleDateString()}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-end gap-3">
          <Link
            href="/dashboard/settings/team"
            className="px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-white rounded-lg transition-colors border-2 border-slate-200 disabled:opacity-50"
          >
            {tModals("EditMember.cancel")}
          </Link>
          <button
            onClick={handleEditMember}
            disabled={isUpdating}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#005bbc] hover:bg-[#004a9f] rounded-lg transition-colors border-2 border-[#005bbc] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                {tModals("EditMember.save")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
