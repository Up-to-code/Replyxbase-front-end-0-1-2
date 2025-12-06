import React from "react";
import { Metadata } from "next";
import DashboardClient from "./components/DashboardClient";
import { getTranslations } from "next-intl/server";
import { dashboardData } from '@/app/lib/mock-data';
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Dashboard.Home");

  return {
    title: t("title"),
    description: t("subtitle"),
  };
}

export default function DashboardPage() {
  return (
    <DashboardClient
      stats={dashboardData.stats}
      platforms={dashboardData.platforms}
      agents={dashboardData.agents}
      bookings={dashboardData.bookings}
      activity={dashboardData.activity}
      chartData={dashboardData.chartData}
    />
  );
}