"use client";

import { AppLayoutProps } from "@/components/layout/AppLayout/types";
import { AppLayout } from "@/components/layout/AppLayout";

// Use SSR-first approach - AppLayout is a client component that can hydrate on the server
export function DashboardLayoutClient({ children, agents }: AppLayoutProps) {
  return <AppLayout agents={agents}>{children}</AppLayout>;
}

