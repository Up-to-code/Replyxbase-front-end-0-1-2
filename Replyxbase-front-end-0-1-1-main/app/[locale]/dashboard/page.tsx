import { getSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";
import DashboardClient from "./components/DashboardClient";
import { getDashboardStats } from "@/app/actions/dashboard";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  // Fetch real aggregated data
  const dashboardData = await getDashboardStats();

  if (!dashboardData) {
      // Handle edge case where no data or org found
      return null;
  }
  
  // Transform Bookings for DashboardClient
  const formattedBookings = dashboardData.bookings.map(booking => ({
    customer: booking.customer?.fullName || "Unknown Customer",
    date: booking.date,
    startTime: booking.startTime,
    type: booking.serviceType,
    status: booking.status
  }));

  const formattedTodaysBookings = dashboardData.todaysBookings.map(booking => ({
    customer: booking.customer?.fullName || "Unknown Customer",
    date: booking.date,
    startTime: booking.startTime,
    type: booking.serviceType,
    status: booking.status
  }));

  // Construct Real Stats
  const stats = [
    {
      id: "bookings",
      label: "Upcoming Bookings",
      value: dashboardData.stats.bookings.toString(),
      icon: "Calendar",
      color: "blue"
    },
    {
      id: "active_agents",
      label: "Active Agents",
      value: dashboardData.stats.activeAgents.toString(),
      icon: "Bot",
      color: "purple"
    },
    {
      id: "total_customers",
       label: "Total Customers",
      value: dashboardData.stats.customers.toString(), 
      icon: "Users",
      color: "orange"
    },
    {
      id: "pending_bookings",
      label: "Pending Bookings",
      value: dashboardData.stats.pendingBookings.toString(),
      icon: "Clock",
      color: "green"
    }
  ];

  return (
    <DashboardClient 
      stats={stats}
      bookings={formattedBookings}
      todaysBookings={formattedTodaysBookings}
      recentCustomers={dashboardData.recentCustomers}
    />
  );
}
