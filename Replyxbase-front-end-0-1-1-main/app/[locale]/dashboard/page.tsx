import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import DashboardClient from "./components/DashboardClient";
import { getDashboardStats } from "@/app/actions/dashboard";
import { getAgents } from "@/app/actions/agent";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const [dashboardData, agents] = await Promise.all([
    getDashboardStats(),
    getAgents()
  ]);

  if (!dashboardData) {
    return null;
  }
  
  const formatBooking = (booking: typeof dashboardData.bookings[0]) => ({
    customer: booking.customer?.fullName || "Unknown Customer",
    date: booking.date,
    startTime: booking.startTime,
    type: booking.serviceType,
    status: booking.status
  });

  const formattedBookings = dashboardData.bookings.map(formatBooking);
  const formattedTodaysBookings = dashboardData.todaysBookings.map(formatBooking);

  const formattedAgents = agents.map(agent => ({
    id: agent.id,
    name: agent.name,
    role: agent.role || undefined,
    status: agent.status || 'active',
    avatar: agent.avatar || undefined,
    isWebsiteEnabled: agent.isWebsiteEnabled || false,
    isWhatsappEnabled: agent.isWhatsappEnabled || false,
    isDmEnabled: agent.isDmEnabled || false
  }));

  const stats = [
    {
      id: "bookings",
      label: "Upcoming Bookings",
      value: dashboardData.stats.bookings.toString(),
      icon: "Calendar",
      color: "blue" as const
    },
    {
      id: "active_agents",
      label: "Active Agents",
      value: dashboardData.stats.activeAgents.toString(),
      icon: "Bot",
      color: "purple" as const
    },
    {
      id: "total_customers",
      label: "Total Customers",
      value: dashboardData.stats.customers.toString(), 
      icon: "Users",
      color: "orange" as const
    },
    {
      id: "pending_bookings",
      label: "Pending Bookings",
      value: dashboardData.stats.pendingBookings.toString(),
      icon: "Clock",
      color: "green" as const
    }
  ];

  return (
    <DashboardClient 
      stats={stats}
      bookings={formattedBookings}
      todaysBookings={formattedTodaysBookings}
      recentCustomers={dashboardData.recentCustomers}
      agents={formattedAgents}
      monthBookingDates={dashboardData.monthBookingDates || []}
    />
  );
}
