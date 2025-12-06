"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { inviteMember } from '@/app/actions/settings/team';
import { useRouter } from 'next/navigation';
import { Link } from '@/navigation';

interface InviteMemberFormProps {
  organizationId: string;
}

export default function InviteMemberForm({ organizationId }: InviteMemberFormProps) {
  const tModals = useTranslations("Dashboard.Settings.Team.Modals");
  const tRoles = useTranslations("Dashboard.Settings.Team.roles");
  const router = useRouter();

  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<string>("member");
  const [isInviting, setIsInviting] = useState(false);

  const roleOptions = [
    { value: "member", label: tRoles("member") },
    { value: "admin", label: tRoles("admin") },
    { value: "owner", label: tRoles("owner") },
  ];

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    setIsInviting(true);
    try {
      const result = await inviteMember({
        organizationId,
        email: inviteEmail.trim(),
        role: inviteRole,
      });

      if (result.success) {
        toast.success("Invitation sent successfully!");
        router.push("/dashboard/settings/team");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Invite error:", error);
      toast.error("Failed to send invitation");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard/settings/team"
          className="p-2 rounded-lg hover:bg-slate-50 transition-colors border-2 border-slate-200"
          title="Back to Team"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{tModals("AddMember.title")}</h2>
          <p className="text-base text-slate-500 mt-1">Invite a new member to your team</p>
        </div>
      </div>

      <div className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-6">
        <div className="grid gap-3">
          <label className="text-sm font-semibold text-slate-700">{tModals("AddMember.email")}</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 rtl:left-auto rtl:right-4" />
            <input 
              type="email" 
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-2 focus:ring-[#005bbc]/10 rounded-xl pl-12 pr-5 py-4 text-base text-slate-900 transition-all duration-200 rtl:pl-5 rtl:pr-12 outline-none"
            />
          </div>
        </div>

        <div className="grid gap-3">
          <label className="text-sm font-semibold text-slate-700">{tModals("AddMember.role")}</label>
          <select
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
            className="w-full bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-2 focus:ring-[#005bbc]/10 rounded-xl px-5 py-4 text-base text-slate-900 transition-all duration-200 outline-none"
          >
            {roleOptions.map((role) => (
              <option key={role.value} value={role.value}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-4 flex justify-end gap-3">
          <Link
            href="/dashboard/settings/team"
            className="px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border-2 border-slate-200"
          >
            {tModals("AddMember.cancel")}
          </Link>
          <button 
            onClick={handleInvite}
            disabled={isInviting || !inviteEmail.trim()}
            className="px-6 py-3 text-sm font-semibold text-white bg-[#005bbc] hover:bg-[#004a9f] rounded-lg transition-colors border-2 border-[#005bbc] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isInviting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              tModals("AddMember.submit")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
