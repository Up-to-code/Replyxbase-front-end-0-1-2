"use client";

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Bell, Mail, Loader2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { getNotificationPreferences, updateNotificationPreferences, type NotificationPreferences } from '@/app/actions/settings/notifications';

export const NotificationsSettings: React.FC = () => {
  const t = useTranslations("Dashboard.Settings.Notifications");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [emailNotifications, setEmailNotifications] = useState({
    marketing: true,
    security: true,
    updates: false,
  });

  const [pushNotifications, setPushNotifications] = useState({
    comments: true,
    mentions: true,
    reminders: true,
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    setIsLoading(true);
    try {
      const result = await getNotificationPreferences();
      if (result.success && result.data) {
        setEmailNotifications(result.data.email);
        setPushNotifications(result.data.push);
      }
    } catch (error) {
      console.error("Failed to load preferences:", error);
      toast.error("Failed to load notification preferences");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailToggle = (key: keyof typeof emailNotifications) => {
    setEmailNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      setHasChanges(true);
      return updated;
    });
  };

  const handlePushToggle = (key: keyof typeof pushNotifications) => {
    setPushNotifications(prev => {
      const updated = { ...prev, [key]: !prev[key] };
      setHasChanges(true);
      return updated;
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const preferences: NotificationPreferences = {
        email: emailNotifications,
        push: pushNotifications,
      };

      const result = await updateNotificationPreferences(preferences);
      if (result.success) {
        toast.success("Notification preferences saved!");
        setHasChanges(false);
      } else {
        toast.error(result.error || "Failed to save preferences");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Failed to save notification preferences");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="animate-fade-in">
        <div className="mb-10">
          <div className="h-8 w-64 bg-slate-200 rounded-lg animate-pulse mb-3" />
          <div className="h-5 w-96 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="bg-white border-2 border-slate-200 rounded-xl p-8 space-y-4">
              <div className="h-6 w-48 bg-slate-100 rounded animate-pulse" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-16 bg-slate-50 rounded-xl animate-pulse" />
              ))}
            </div>
          ))}
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
        {/* Email Notifications */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#005bbc]/10 flex items-center justify-center border-2 border-[#005bbc]/20">
              <Mail className="w-5 h-5 text-[#005bbc]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t("email.title")}</h3>
              <p className="text-sm text-slate-500">{t("email.description")}</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(emailNotifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                <div>
                  <span className="block text-sm font-semibold text-slate-900 capitalize">{key}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Receive emails about {key}</span>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors relative border-2 ${value ? 'bg-[#005bbc] border-[#005bbc]' : 'bg-slate-200 border-slate-200'}`}>
                  <input 
                    type="checkbox" 
                    checked={value}
                    onChange={() => handleEmailToggle(key as keyof typeof emailNotifications)}
                    disabled={isSaving}
                    className="opacity-0 w-full h-full absolute inset-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className={`w-5 h-5 bg-white rounded-full border-2 border-slate-200 absolute top-0.5 transition-transform ${value ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Push Notifications */}
        <div className="bg-white border-2 border-slate-200 rounded-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#005bbc]/10 flex items-center justify-center border-2 border-[#005bbc]/20">
              <Bell className="w-5 h-5 text-[#005bbc]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">{t("push.title")}</h3>
              <p className="text-sm text-slate-500">{t("push.description")}</p>
            </div>
          </div>

          <div className="space-y-4">
            {Object.entries(pushNotifications).map(([key, value]) => (
              <label key={key} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                <div>
                  <span className="block text-sm font-semibold text-slate-900 capitalize">{key}</span>
                  <span className="block text-xs text-slate-500 mt-0.5">Receive push notifications for {key}</span>
                </div>
                <div className={`w-11 h-6 rounded-full transition-colors relative border-2 ${value ? 'bg-[#005bbc] border-[#005bbc]' : 'bg-slate-200 border-slate-200'}`}>
                  <input 
                    type="checkbox" 
                    checked={value}
                    onChange={() => handlePushToggle(key as keyof typeof pushNotifications)}
                    disabled={isSaving}
                    className="opacity-0 w-full h-full absolute inset-0 cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div className={`w-5 h-5 bg-white rounded-full border-2 border-slate-200 absolute top-0.5 transition-transform ${value ? 'left-[22px]' : 'left-0.5'}`} />
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Save Button */}
        {hasChanges && (
          <div className="pt-6 border-t-2 border-slate-200 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-3.5 bg-[#005bbc] hover:bg-[#004a9f] text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 border-2 border-[#005bbc]"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Save Preferences
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
