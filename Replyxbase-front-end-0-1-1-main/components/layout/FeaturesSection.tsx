"use client";
import React from "react";
import { Bot, MessageSquare, BarChart3, Zap, Shield, Globe } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import FeatureCard from "@/components/ui/FeatureCard";

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Bot,
      title: "AI Agents",
      description: "Create custom AI agents that never sleep, answering queries and booking appointments 24/7.",
      delay: 0,
    },
    {
      icon: MessageSquare,
      title: "Unified Inbox",
      description: "Manage all customer conversations from WhatsApp, Email, and Website in one place.",
      delay: 0.1,
    },
    {
      icon: BarChart3,
      title: "Analytics",
      description: "Track performance, response times, and customer satisfaction in real-time.",
      delay: 0.2,
    },
    {
      icon: Zap,
      title: "Smart Automation",
      description: "Automate repetitive tasks and let AI handle routine customer inquiries.",
      delay: 0.3,
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level encryption and compliance with GDPR, SOC 2, and ISO 27001.",
      delay: 0.4,
    },
    {
      icon: Globe,
      title: "Multi-Channel",
      description: "Connect with customers across all channels seamlessly.",
      delay: 0.5,
    },
  ];

  return (
    <section id="features" className="py-20 lg:py-28 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <SectionHeader
            badge="Features"
            title="Everything you need to deliver exceptional customer experiences"
            description="Powerful tools and integrations to help you build, deploy, and scale your AI support agents."
            center
            className="mb-16"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                glow={index === 0}
                delay={feature.delay}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;


