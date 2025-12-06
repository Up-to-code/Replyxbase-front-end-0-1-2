"use client";

import React from "react";
import { usePathname, useRouter } from "@/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Zap,
  Plus,
  Sparkles,
  User,
} from "lucide-react";
import { Agent, NavigationItem, Translator } from "./types";
import { NAVIGATION } from "./constants";
import { useRTL } from "@/hooks/useRTL";

/**
 * Logo Section Component
 * Displays the app logo and sidebar toggle button
 */
function LogoSection({
  sidebarOpen,
  onToggle,
}: {
  sidebarOpen: boolean;
  onToggle: () => void;
}) {
  const { isRTL } = useRTL();
  
  return (
    <div className="h-16 border-b-2 border-slate-200 flex items-center px-4 sm:px-6 bg-white shrink-0">
      <div className="flex items-center justify-between w-full">
        {sidebarOpen && (
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-8 h-8 bg-[#005bbc] rounded-xl flex items-center justify-center border-2 border-[#005bbc] shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-slate-900 text-lg font-bold truncate">Replyxbase</h1>
              <p className="text-slate-500 text-xs truncate">AI Platform</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-slate-600 p-2 rounded-xl hover:bg-slate-50 transition-all duration-200 border-2 border-transparent hover:border-slate-200 active:scale-95 flex-shrink-0"
          aria-label="Toggle sidebar"
          aria-expanded={sidebarOpen}
          type="button"
        >
          {sidebarOpen ? (
            isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />
          ) : (
            isRTL ? <ChevronLeft className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
}

/**
 * Navigation Button Component
 * Individual navigation item with active state styling
 */
function NavigationButton({
  item,
  isActive,
  sidebarOpen,
  onClick,
  label,
}: {
  item: NavigationItem;
  isActive: boolean;
  sidebarOpen: boolean;
  onClick: () => void;
  label: string;
}) {
  const Icon = item.icon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 group border-2 active:scale-[0.98] ${
        isActive
          ? "bg-[#005bbc] text-white border-[#005bbc] shadow-sm"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent hover:border-slate-200"
      }`}
      aria-current={isActive ? "page" : undefined}
      aria-label={sidebarOpen ? undefined : label}
    >
      <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"}`} />
      {sidebarOpen && <span className="ms-3 font-medium truncate">{label}</span>}
    </button>
  );
}

/**
 * Agent Button Component
 * Individual agent item with status indicator
 */
function AgentButton({
  agent,
  isActive,
  onClick,
}: {
  agent: Agent;
  isActive: boolean;
  onClick: () => void;
}) {
  const AgentIcon = User;
  
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center w-full px-4 py-3 rounded-xl transition-all duration-200 text-start group border-2 active:scale-[0.98] ${
        isActive
          ? "bg-[#005bbc]/10 text-[#005bbc] border-[#005bbc]/20"
          : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-transparent hover:border-slate-200"
      }`}
      aria-label={`Agent: ${agent.name}`}
    >
      <div className="flex items-center gap-3 w-full min-w-0">
        <div className="relative flex items-center justify-center shrink-0">
            <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center bg-slate-100 border-2 border-slate-200">
               {agent.avatar ? (
              <img 
                src={agent.avatar} 
                alt={agent.name} 
                className="w-full h-full object-cover" 
              />
               ) : (
                  <AgentIcon className={`w-3 h-3 ${isActive ? "text-[#005bbc]" : "text-slate-400 group-hover:text-slate-600"}`} />
               )}
            </div>
            <div
              className={`absolute -top-0.5 -end-0.5 w-2 h-2 rounded-full border-2 border-white ${
                  agent.status === 'active' ? 'bg-green-500' : 'bg-slate-400'
              }`}
            aria-label={agent.status === 'active' ? 'Active' : 'Inactive'}
            />
        </div>
        <span className="truncate text-sm font-medium flex-1 min-w-0">{agent.name}</span>
        {isActive && (
          <Sparkles className="w-3 h-3 text-[#005bbc] shrink-0" aria-hidden="true" />
        )}
      </div>
    </button>
  );
}



export function Sidebar({
  sidebarOpen,
  onToggle,
  agents,
  onAgentClick,
  onCreateAgent,
  t,
}: {
  sidebarOpen: boolean;
  onToggle: () => void;
  agents: Agent[];
  onAgentClick: (agentId: string) => void;
  onCreateAgent: () => void;
  t: Translator;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const isActiveRoute = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === href || (!!pathname && pathname.startsWith(href + "/"));

  return (
    <aside
      className={`bg-white border-e-2 border-slate-200 flex flex-col transition-all duration-300 ease-in-out h-full sticky top-0 z-30 ${
        sidebarOpen ? "w-64" : "w-20"
      }`}
      aria-label="Sidebar navigation"
    >
      <LogoSection sidebarOpen={sidebarOpen} onToggle={onToggle} />

      {/* Navigation */}
      <nav 
        className="flex-1 p-4 space-y-1 overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent"
        aria-label="Main navigation"
      >
        {/* Main Navigation */}
        <div className="space-y-1">
        {NAVIGATION.map((item) => (
          <NavigationButton
            key={item.href}
            item={item}
            isActive={isActiveRoute(item.href)}
            sidebarOpen={sidebarOpen}
            onClick={() => router.push(item.href)}
            label={t(`Sidebar.${item.label.toLowerCase()}`)}
          />
        ))}
        </div>

        {/* Divider */}
        <div className="border-t-2 border-slate-200 my-4" />

        {/* Create Agent Button */}
        <button
          onClick={onCreateAgent}
          className="flex items-center w-full px-4 py-3 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-all duration-200 group border-2 border-transparent hover:border-slate-200 active:scale-[0.98]"
          aria-label={sidebarOpen ? t("createAgent") : "Create agent"}
        >
          <Plus className="w-5 h-5 group-hover:text-[#005bbc] transition-colors flex-shrink-0" />
          {sidebarOpen && (
            <span className="ms-3 font-medium">{t("createAgent")}</span>
          )}
        </button>

        {/* Existing Agents Section */}
        {sidebarOpen && agents.length > 0 && (
          <div className="mt-6">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-3 px-1">
              {t("existingAgents")}
            </h3>
            <div className="space-y-1">
              {agents.map((agent) => (
                <AgentButton
                  key={agent.id}
                  agent={agent}
                  isActive={pathname === `/dashboard/agents/${agent.id}`}
                  onClick={() => onAgentClick(agent.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State for Agents */}
        {sidebarOpen && agents.length === 0 && (
          <div className="mt-6 p-4 text-center">
            <p className="text-xs text-slate-400">
              {t("existingAgents")}
            </p>
            <p className="text-xs text-slate-300 mt-1">
              No agents yet
            </p>
          </div>
        )}
      </nav>
    </aside>
  );
}
