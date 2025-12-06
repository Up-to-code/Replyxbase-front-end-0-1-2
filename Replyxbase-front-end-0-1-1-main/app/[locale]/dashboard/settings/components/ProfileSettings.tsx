"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Camera, Loader2, Check } from 'lucide-react';
import { User } from '@prisma/client';
import { useUploadThing } from '@/lib/uploadthing';
import { toast } from 'sonner';
import { updateProfile, updateAvatar } from '@/app/actions/settings/profile';

interface ProfileSettingsProps {
  user: User;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({ user }) => {
  const t = useTranslations("Dashboard.Settings.Profile");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [bio, setBio] = useState(() => {
    // Load bio from user metadata
    if (user.metadata && typeof user.metadata === 'object') {
      const metadata = user.metadata as Record<string, any>;
      return metadata.bio || "";
    }
    return "";
  });
  const [avatarUrl, setAvatarUrl] = useState(user.image || "");

  // UploadThing hook for avatar
  const { startUpload } = useUploadThing("avatarUploader", {
    onClientUploadComplete: async (res) => {
      if (res && res[0]) {
        const newAvatarUrl = res[0].url;
        setAvatarUrl(newAvatarUrl);
        
        // Update avatar in database
        const result = await updateAvatar(newAvatarUrl);
        if (result.success) {
          toast.success("Avatar updated successfully!");
        } else {
          toast.error(result.error || "Failed to update avatar");
        }
      }
      setIsUploading(false);
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
      toast.error("Failed to upload avatar");
      setIsUploading(false);
    },
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    await startUpload([file]);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateProfile({
        name: name || undefined,
        bio: bio || undefined,
      });
      
      if (result.success) {
        toast.success("Profile updated successfully!");
      } else {
        toast.error(result.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-slate-900">{t("title")}</h2>
        <p className="text-base text-slate-500 mt-2">{t("description")}</p>
      </div>

      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="flex items-center gap-8 p-6 bg-slate-50 rounded-xl border-2 border-slate-200">
          <div className="relative group cursor-pointer">
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center border-2 border-white overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name || "User"} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl font-medium text-slate-400">
                  {name ? name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <label className="inline-block">
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                disabled={isUploading}
                className="hidden"
              />
              <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 bg-transparent border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300 px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50">
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
              Change Photo
                  </>
                )}
              </span>
            </label>
            <p className="text-sm text-slate-500 mt-3">JPG, GIF or PNG. Max size of 4MB</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-8">
          <div className="grid gap-3">
            <label className="text-sm font-semibold text-slate-700">{t("form.fullName")}</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 rounded-xl px-5 py-4 text-base text-slate-900 transition-all duration-200"
            />
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-slate-700">{t("form.email")}</label>
            <input 
              type="email" 
              value={user.email || ""}
              disabled
              className="bg-slate-50 border-2 border-transparent focus:bg-white focus:border-slate-200 focus:ring-0 rounded-xl px-5 py-4 text-base text-slate-900 transition-all duration-200 opacity-60 cursor-not-allowed"
            />
          </div>

          <div className="grid gap-3">
            <label className="text-sm font-semibold text-slate-700">{t("form.bio")}</label>
            <textarea 
              rows={5}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-slate-50 border-2 border-transparent focus:bg-white focus:border-[#005bbc] focus:ring-0 rounded-xl px-5 py-4 text-base text-slate-900 transition-all duration-200 resize-none"
              placeholder="Tell us about yourself..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-6 border-t-2 border-slate-200">
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
