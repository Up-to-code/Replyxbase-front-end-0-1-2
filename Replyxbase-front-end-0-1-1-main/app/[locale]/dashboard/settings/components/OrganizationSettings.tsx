"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Upload, Building2, Loader2, Check } from 'lucide-react';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { Organization, Member, User } from '@prisma/client';
import { updateOrganization, updateOrganizationLogo } from '@/app/actions/settings/organization';

interface OrganizationSettingsProps {
  organization: Organization & {
    members: (Member & { user: User })[];
  };
}

export const OrganizationSettings: React.FC<OrganizationSettingsProps> = ({ organization }) => {
  const t = useTranslations("Dashboard.Settings.Organization");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [orgName, setOrgName] = useState(organization.name || "");
  const [orgSlug, setOrgSlug] = useState(organization.slug || "");
  const [logoUrl, setLogoUrl] = useState(organization.logo || "");

  // UploadThing hook
  const { startUpload } = useUploadThing("organizationLogo", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        const newLogoUrl = res[0].url;
        setLogoUrl(newLogoUrl);
        
        // Update organization logo in database
        const result = await updateOrganizationLogo(organization.id, newLogoUrl);
        if (result.success) {
        toast.success("Logo uploaded successfully!");
        } else {
          toast.error(result.error || "Failed to update logo");
        }
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      toast.error("Failed to upload logo");
      setIsUploading(false);
    },
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await startUpload([file]);
  };

  const handleSave = async () => {
    if (!organization) {
      toast.error("No active organization");
      return;
    }

    setIsSaving(true);
    try {
      const result = await updateOrganization({
        organizationId: organization.id,
        name: orgName,
        slug: orgSlug,
        logo: logoUrl,
      });
      
      if (result.success) {
      toast.success("Organization settings updated!");
      } else {
        toast.error(result.error || "Failed to update organization");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update organization");
    } finally {
      setIsSaving(false);
    }
  };

  if (!organization) {
    return (
      <div className="animate-fade-in">
        <div className="text-center py-12">
          <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No Active Organization</h3>
          <p className="text-slate-500">Please select or create an organization to manage settings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900">{t("title")}</h2>
        <p className="text-base text-slate-500 mt-2">{t("description")}</p>
      </div>

      <div className="space-y-8">
        {/* Logo Upload */}
        <div className="flex items-center gap-8 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
          <div className="w-24 h-24 rounded-2xl bg-white flex items-center justify-center border-2 border-slate-200 overflow-hidden">
            {logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logoUrl} alt="Organization logo" className="w-full h-full object-cover" />
            ) : (
              <Building2 className="w-10 h-10 text-slate-400" />
            )}
          </div>
          <div>
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                disabled={isUploading}
                className="hidden"
              />
              <span className="flex items-center gap-2 px-5 py-2.5 bg-transparent hover:bg-slate-50 border-2 border-slate-200 hover:border-slate-300 rounded-xl cursor-pointer transition-all font-medium text-sm text-slate-700 disabled:opacity-50">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    {t("form.logo")}
                  </>
                )}
              </span>
            </label>
            <p className="text-sm text-slate-500 mt-3">Recommended size: 512x512px</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-8">
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-slate-700">{t("form.name")}</label>
            <input 
              type="text" 
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              className="bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-2 focus:ring-[#005bbc]/10 rounded-xl px-5 py-4 text-base text-slate-900 transition-all duration-200 outline-none"
            />
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-slate-700">{t("form.domain")}</label>
            <div className="flex items-center">
              <input 
                type="text" 
                value={orgSlug}
                onChange={(e) => setOrgSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                className="bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-2 focus:ring-[#005bbc]/10 rounded-l-xl px-5 py-4 text-base text-slate-900 transition-all duration-200 flex-1 outline-none"
              />
              <span className="bg-slate-50 border-l-0 border-2 border-slate-200 text-slate-600 px-6 py-4 text-base rounded-r-xl font-medium">
                .replyxbase.com
              </span>
            </div>
          </div>
        </div>

        {/* Organization Details */}
        <div className="grid gap-6 p-6 bg-slate-50 rounded-2xl border-2 border-slate-200">
          <h3 className="text-base font-bold text-slate-900">Organization Details</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Organization ID</p>
              <p className="text-sm font-mono text-slate-900 bg-white px-3 py-2 rounded-lg border-2 border-slate-200">
                {organization.id}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Created</p>
              <p className="text-sm text-slate-900">
                {new Date(organization.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t-2 border-slate-200 flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || isUploading}
            className="px-6 py-2.5 bg-[#005bbc] hover:bg-[#004a9f] text-white rounded-xl text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-[#005bbc] focus:outline-none focus:ring-2 focus:ring-[#005bbc]/20"
          >
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                {t("form.save")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
