import React from "react";
import { useTranslations } from "next-intl";

export type Translator = ReturnType<typeof useTranslations>;

export interface AppLayoutProps {
  children: React.ReactNode;
  agents: Agent[];
}

export interface Agent {
  id: string;
  organizationId: string;
  name: string;
  role: string;
  status: string;
  avatar: string | null;
  isWebsiteEnabled: boolean;
  isWhatsappEnabled: boolean;
  isDmEnabled: boolean;
  createdAt: Date;
}

export interface NavigationItem {
  label: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
}

export interface Notification {
  id: number;
  label: string;
  time: string;
  type: "message" | "system" | "payment" | "security" | "update";
  read: boolean;
}

export interface ProfileMenuItem {
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
  href?: string;
  action?: string;
  description?: string;
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  createdAt: Date;
  metadata: string | null;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  role: string;
  createdAt: Date;
}
