'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Bot, MessageSquare, ArrowRight, Globe, MessageCircle } from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role?: string;
  status: string;
  avatar?: string;
  isWebsiteEnabled?: boolean;
  isWhatsappEnabled?: boolean;
  isDmEnabled?: boolean;
}

interface AgentsWidgetProps {
  agents: Agent[];
  title?: string;
  viewAllLink?: string;
  maxItems?: number;
}

export const AgentsWidget: React.FC<AgentsWidgetProps> = ({ 
  agents, 
  title = "Active Agents",
  viewAllLink = "/dashboard/agents",
  maxItems = 3
}) => {
  const displayAgents = agents.slice(0, maxItems);
  const statusColors = {
    active: 'bg-[#10B981]/10 text-[#10B981] border-[#10B981]/20',
    inactive: 'bg-slate-100 text-slate-700 border-slate-200',
    training: 'bg-[#005bbc]/10 text-[#005bbc] border-[#005bbc]/20'
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between pb-4 border-b-2 border-slate-100">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        {viewAllLink && (
          <Link href={viewAllLink} className="text-sm text-[#005bbc] hover:underline font-medium">
            View All
          </Link>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {displayAgents.length > 0 ? (
          <div className="space-y-4">
            {displayAgents.map((agent) => (
              <div 
                key={agent.id}
                className="group bg-white border-2 border-slate-200 rounded-xl p-4 hover:border-[#005bbc]/30 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-900 font-bold text-lg border-2 border-slate-200 group-hover:scale-105 transition-transform overflow-hidden">
                      {agent.avatar ? (
                        <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                      ) : (
                        agent.name.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">{agent.name}</h3>
                      {agent.role && (
                        <p className="text-xs text-slate-600 capitalize">{agent.role}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[agent.status as keyof typeof statusColors] || statusColors.active}`}>
                    {agent.status}
                  </span>
                </div>
                <div className="flex gap-2 mb-3">
                  {agent.isWebsiteEnabled && (
                    <div className="p-1.5 bg-[#005bbc]/10 text-[#005bbc] rounded-lg border border-[#005bbc]/20" title="Website Widget">
                      <Globe className="w-3 h-3" />
                    </div>
                  )}
                  {agent.isWhatsappEnabled && (
                    <div className="p-1.5 bg-[#10B981]/10 text-[#10B981] rounded-lg border border-[#10B981]/20" title="WhatsApp">
                      <MessageCircle className="w-3 h-3" />
                    </div>
                  )}
                  {agent.isDmEnabled && (
                    <div className="p-1.5 bg-[#ffd600]/10 text-[#ffd600] rounded-lg border border-[#ffd600]/20" title="Direct Message">
                      <MessageSquare className="w-3 h-3" />
                    </div>
                  )}
                </div>
                <Link 
                  href={`/dashboard/agents/${agent.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-50 text-slate-900 font-medium hover:bg-[#005bbc] hover:text-white border-2 border-slate-200 hover:border-[#005bbc] transition-all text-sm"
                >
                  View Dashboard
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Bot className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <p className="text-slate-500 text-sm">No agents found.</p>
            {viewAllLink && (
              <Link href={viewAllLink}>
                <button className="mt-3 text-sm text-[#005bbc] hover:underline font-medium">
                  Create Agent
                </button>
              </Link>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

