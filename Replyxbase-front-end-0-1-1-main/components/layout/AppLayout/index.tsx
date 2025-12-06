
"use client";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/navigation";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { AppLayoutProps } from "./types";

/**
 * Hook for responsive sidebar state management
 * Automatically closes on mobile (< 1024px) and opens on desktop
 */
function useResponsiveSidebar() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    function handleResize() {
      if (typeof window !== "undefined") {
        if (window.innerWidth < 1024) {
          setIsOpen(false);
        } else {
          setIsOpen(true);
      }
    }
    }
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return [isOpen, setIsOpen] as const;
}

export function AppLayout({ children, agents }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useResponsiveSidebar();
  
  // Use translations - should be available from NextIntlClientProvider in root layout
  const t = useTranslations("Dashboard");

  const router = useRouter();

  const handleAgentClick = (agentId: string) => {
    router.push(`/dashboard/agents/${agentId}`);
  };

  const handleCreateAgent = () => {
    router.push("/dashboard/agents/new");
  };

  return (
    <div className="flex h-screen bg-slate-50" aria-label="Application layout">
      <Sidebar
        sidebarOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        agents={agents}
        onAgentClick={handleAgentClick}
        onCreateAgent={handleCreateAgent}
        t={t}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <Header
          onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
          t={t}
        />

        <main className="flex-1 overflow-auto bg-slate-50" role="main">
          <div className="h-full w-full min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
