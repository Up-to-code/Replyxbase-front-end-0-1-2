"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "@/navigation";
import { ChevronDown, LogOut, Loader2 } from "lucide-react";
import { PROFILE_MENU } from "./constants";
import { ProfileMenuItem, Translator } from "./types";
import { useUserStore, useOrganizationStore } from "@/stores";

/**
 * Hook to detect clicks outside of a component
 */
function useClickOutside(callback: () => void) {
 const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [callback]);

  return ref;
}

function MenuItem({ item, onAction, t }: {
  item: ProfileMenuItem;
  onAction: (href?: string, action?: string) => void;
  t: Translator;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={() => onAction(item.href, item.action)}
                className="flex items-start w-full p-3 hover:bg-slate-50 text-start transition-all duration-200 group rounded-xl border-2 border-transparent hover:border-slate-200 active:scale-[0.98]"
    >
      <div className="p-2 rounded-xl bg-slate-50 text-slate-500 group-hover:bg-[#005bbc]/10 group-hover:text-[#005bbc] transition-colors duration-200 me-3 border-2 border-slate-200 group-hover:border-[#005bbc]/20">
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0 pt-1">
        <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 block transition-colors">
          {t(`Header.ProfileMenu.${item.label}`)}
        </span>
        {item.description && (
          <span className="text-xs text-slate-400 group-hover:text-slate-500 mt-0.5 block transition-colors">
            {t(`Header.ProfileMenu.${item.description}`)}
          </span>
        )}
      </div>
    </button>
  );
}

export function UserMenu({ 
  t, 
  showName = false,
  align = "end"
}: { 
  t: Translator;
  showName?: boolean;
  align?: "start" | "end";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const ref = useClickOutside(() => setIsOpen(false));

  // Use Zustand stores
  const { user, isLoading: isLoadingUser, loadUser } = useUserStore();
  const { activeOrganization } = useOrganizationStore();

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleAction = (href?: string, action?: string) => {
    if (action === "logout") {
      setIsOpen(false);
      setShowLogoutModal(true);
    } else if (href) {
      router.push(href);
      setIsOpen(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const { authClient } = await import("@/lib/auth-client");
      await authClient.signOut();
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  // Show loading skeleton with prominent indicator
  if (isLoadingUser || !user) {
    return (
      <div className="flex items-center gap-2 p-1.5">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-200 to-slate-300 animate-pulse border-2 border-slate-200 flex items-center justify-center">
          <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
        </div>
        {showName && (
          <div className="space-y-1.5">
            <div className="h-4 w-24 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded bg-[length:200%_100%] animate-shimmer" />
            <div className="h-3 w-32 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 rounded bg-[length:200%_100%] animate-shimmer" style={{ animationDelay: '0.2s' }} />
          </div>
        )}
      </div>
    );
  }

  // If no user session, return null
  if (!user) {
    return null;
  }

  // Helper to get user avatar
  const getUserAvatar = () => {
    return user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || "User")}&background=005bbc&color=fff`;
  };

  return (
    <>
      <div className="relative" ref={ref}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-slate-200 active:scale-95 ${
            showName ? "w-full" : ""
          }`}
          aria-label="User menu"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <div className="w-8 h-8 rounded-xl flex items-center justify-center overflow-hidden border-2 border-slate-200">
            <img 
              src={getUserAvatar()} 
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          {showName && (
            <div className="flex-1 min-w-0 text-start">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          )}
          <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`} />
        </button>

        {isOpen && (
          <div
            className={`absolute ${align === "end" ? "end-0" : "start-0"} top-full mt-2 w-72 sm:w-80 bg-white border-2 border-slate-200 rounded-2xl z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 shadow-lg`}
            role="menu"
            aria-label="User menu"
          >
            {/* User Header */}
            <div className="p-5 border-b-2 border-slate-200 bg-gradient-to-b from-slate-50/50 to-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center overflow-hidden border-2 border-white">
                  <img 
                    src={getUserAvatar()} 
                    alt="User avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-lg truncate leading-tight">{user.name}</p>
                  <p className="text-sm text-slate-500 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="px-2.5 py-0.5 bg-[#005bbc]/10 text-[#005bbc] text-[11px] font-bold uppercase tracking-wide rounded-full border-2 border-[#005bbc]/20">
                      {activeOrganization?.name || "Personal"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2 bg-white max-h-[20rem] overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
              {PROFILE_MENU.map((item, index) => (
                <div key={item.label}>
                  <MenuItem item={item} onAction={handleAction} t={t} />
                  {index === PROFILE_MENU.length - 2 && <div className="my-2 border-t-2 border-slate-200 mx-2" />}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t-2 border-slate-200 bg-slate-50/50">
              <div className="flex items-center justify-between text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                <span>Last login: Today, 14:30</span>
                <span>v2.4.1</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl border-2 border-slate-200 max-w-md w-full p-6 animate-in zoom-in-95 duration-200 scale-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mb-4 border-2 border-red-200">
                <LogOut className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {t("Header.ProfileMenu.LogoutModal.title")}
              </h3>
              <p className="text-sm text-slate-500 mb-6">
                {t("Header.ProfileMenu.LogoutModal.description")}
              </p>
              <div className="flex items-center gap-3 w-full">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-slate-700 font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  {t("Header.ProfileMenu.LogoutModal.cancel")}
                </button>
                <button
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors border border-red-600 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoggingOut && <Loader2 className="w-4 h-4 animate-spin" />}
                  {t("Header.ProfileMenu.LogoutModal.confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
