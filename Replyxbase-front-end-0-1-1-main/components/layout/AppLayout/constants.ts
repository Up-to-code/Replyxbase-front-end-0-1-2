import {
  LayoutDashboard,
  MessageSquare,
  Bot,
  Users,
  Settings,
  User,
  CreditCard,
  Shield,
  Download,
  HelpCircle,
  LogOut,
  Bell,
  MessageCircle,
  Workflow,
} from "lucide-react";
import { Agent, NavigationItem, Notification, ProfileMenuItem } from "./types";

export const MOCK_AGENTS: Agent[] = [
  { 
    id: "1", 
    organizationId: "org_1",
    name: "Customer Support Bot", 
    role: "support",
    status: "active", 
    avatar: null,
    isWebsiteEnabled: true,
    isWhatsappEnabled: true,
    isDmEnabled: false,
    createdAt: new Date()
  },
  { 
    id: "2", 
    organizationId: "org_1",
    name: "Sales Assistant", 
    role: "sales",
    status: "active", 
    avatar: null,
    isWebsiteEnabled: true,
    isWhatsappEnabled: false,
    isDmEnabled: false,
    createdAt: new Date()
  },
  { 
    id: "3", 
    organizationId: "org_1",
    name: "Lead Qualifier", 
    role: "lead",
    status: "inactive", 
    avatar: null,
    isWebsiteEnabled: false,
    isWhatsappEnabled: true,
    isDmEnabled: false,
    createdAt: new Date()
  },
  { 
    id: "4", 
    organizationId: "org_1",
    name: "FAQ Helper", 
    role: "faq",
    status: "active", 
    avatar: null,
    isWebsiteEnabled: true,
    isWhatsappEnabled: true,
    isDmEnabled: true,
    createdAt: new Date()
  },
];

export const NAVIGATION: NavigationItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inbox", href: "/dashboard/inbox", icon: MessageSquare },
  { label: "Agents", href: "/dashboard/agents", icon: Bot },
  { label: "CRM", href: "/dashboard/crm", icon: Users },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const USER = {
  name: "Alex Johnson",
  email: "alex@example.com",
  role: "Admin",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face",
  plan: "Pro Plan",
};

export const ORGANIZATION = {
  id: "org_1",
  name: "Replyxbase",
  plan: "Enterprise",
  avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=32&h=32&fit=crop&crop=entropy",
};

export const MOCK_ORGANIZATIONS = [
  ORGANIZATION,
  {
    id: "org_2",
    name: "Acme Corp",
    plan: "Pro",
    avatar: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=32&h=32&fit=crop&crop=entropy",
  },
  {
    id: "org_3",
    name: "Startup Inc",
    plan: "Starter",
    avatar: "https://images.unsplash.com/photo-1516876437184-593fda40c7ce?w=32&h=32&fit=crop&crop=entropy",
  },
];

export const NOTIFICATIONS: Notification[] = [
  { id: 1, label: "messageFromSarah", time: "2minAgo", type: "message", read: false },
  { id: 2, label: "paymentReceived", time: "1hourAgo", type: "payment", read: false },
  { id: 3, label: "systemUpdate", time: "2hoursAgo", type: "update", read: true },
  { id: 4, label: "securityAlert", time: "3hoursAgo", type: "security", read: false },
  { id: 5, label: "subscriptionRenew", time: "5hoursAgo", type: "system", read: true },
  { id: 6, label: "newFollower", time: "6hoursAgo", type: "message", read: true },
  { id: 7, label: "downloadCompleted", time: "1dayAgo", type: "system", read: true },
];

export const PROFILE_MENU: ProfileMenuItem[] = [
  { label: "profile", icon: User, href: "/dashboard/settings", description: "profileDesc" },
  { label: "settings", icon: Settings, href: "/dashboard/settings", description: "settingsDesc" },
  { label: "signOut", icon: LogOut, action: "logout", description: "signOutDesc" },
];

// Agent type icons mapping
export const AGENT_ICONS = {
  support: MessageCircle,
  sales: Users,
  lead: Workflow,
  faq: HelpCircle,
  default: Bot,
};

// Notification type icons mapping
export const NOTIFICATION_ICONS = {
  message: MessageSquare,
  system: Settings,
  payment: CreditCard,
  security: Shield,
  update: Download,
  default: Bell,
};
