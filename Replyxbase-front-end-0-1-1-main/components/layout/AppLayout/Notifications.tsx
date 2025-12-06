"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { Bell } from "lucide-react";
import { NOTIFICATIONS, NOTIFICATION_ICONS } from "./constants";
import { Notification, Translator } from "./types";

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

function NotificationItem({ notification, t }: { notification: Notification; t: Translator }) {
  const NotificationIcon = NOTIFICATION_ICONS[notification.type] || NOTIFICATION_ICONS.default;
  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'message': return 'text-blue-500';
      case 'payment': return 'text-green-500';
      case 'security': return 'text-red-500';
      case 'update': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className={`w-full p-3 rounded-xl border-2 transition-all duration-200 group cursor-pointer relative overflow-hidden ${
      !notification.read 
        ? 'bg-white border-[#005bbc]/20' 
        : 'bg-white border-slate-200 hover:border-slate-300'
    }`}>
      {!notification.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#005bbc] rounded-l-xl" />
      )}
      <div className="flex items-start gap-3 pl-2">
        <div className={`p-2 rounded-xl ${getNotificationColor(notification.type)} bg-slate-50 group-hover:bg-white transition-all duration-200 border-2 border-slate-200`}>
          <NotificationIcon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-semibold leading-snug ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
              {t(`Header.Notifications.${notification.label}`)}
            </p>
            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded-md border-2 border-slate-200">
              {t(`Header.Notifications.${notification.time}`)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Notifications Component
 * Displays notification bell with unread count and dropdown
 */
export function Notifications({ t }: { t: Translator }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const closeDropdown = useCallback(() => setIsOpen(false), []);
  const ref = useClickOutside(closeDropdown);
  const unreadCount = NOTIFICATIONS.filter(n => !n.read).length;

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-all duration-200 border-2 border-transparent hover:border-slate-200 active:scale-95"
        aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span 
            className="absolute -top-1 -end-1 w-5 h-5 bg-[#005bbc] text-white text-xs font-medium rounded-full flex items-center justify-center border-2 border-white min-w-[1.25rem]"
            aria-label={`${unreadCount} unread notifications`}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className="absolute end-0 top-full mt-2 w-80 sm:w-96 bg-white border-2 border-slate-200 rounded-2xl z-100 overflow-hidden animate-in fade-in zoom-in-95 duration-100 shadow-lg"
          role="menu"
          aria-label="Notifications menu"
        >
          <div className="p-4 border-b-2 border-slate-200 bg-white flex items-center justify-between sticky top-0 z-10">
            <div className="min-w-0 flex-1">
              <h3 className="font-bold text-slate-900 text-base">{t("Header.notifications")}</h3>
              <p className="text-slate-500 text-xs mt-0.5 font-medium">
                {t("Header.unreadMessages", { count: unreadCount })}
              </p>
            </div>
            {unreadCount > 0 && (
              <button 
                className="text-xs font-semibold text-[#005bbc] hover:text-[#004a9f] hover:bg-[#005bbc]/10 px-2.5 py-1.5 rounded-xl transition-colors border-2 border-transparent hover:border-[#005bbc]/20 active:scale-95 flex-shrink-0 ml-2"
                aria-label="Mark all as read"
              >
                {t("Header.markAllRead")}
              </button>
            )}
          </div>
          
          <div className="max-h-[28rem] overflow-y-auto bg-slate-50/50 p-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {NOTIFICATIONS.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-sm text-slate-400">No notifications</p>
              </div>
            ) : (
              NOTIFICATIONS.map((item) => (
              <NotificationItem key={item.id} notification={item} t={t} />
              ))
            )}
          </div>
          
          <div className="p-3 border-t-2 border-slate-200 bg-white sticky bottom-0 z-10">
            <button
              className="w-full py-2.5 text-sm text-slate-700 hover:text-slate-900 font-semibold hover:bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-[#005bbc]/30 transition-all duration-200 active:scale-[0.98]"
              type="button"
            >
              {t("Header.viewAllNotifications")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
