import { prisma } from "@/lib/prisma";

import DashboardCard from "@/components/Dashboard/DashboardCard";
import RegistrationTable from "@/components/Dashboard/RegistrationTable";
import LatestUsers from "@/components/Dashboard/LatestUsers";
import TopEvents from "@/components/Dashboard/TopEvents";

import RegistrationChart from "@/components/Dashboard/RegistrationChart";
import CategoryPieChart from "@/components/Dashboard/CategoryPieChart";
import ActivityFeed from "@/components/Dashboard/ActivityFeed";
import QuickActions from "@/components/Dashboard/QuickActions";

import Link from "next/link";

export default async function AdminPage() {
  const [registrations, users, events] = await Promise.all([

    prisma.registration.findMany({
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        eventTitle: true,
        fullName: true,
        email: true,
        phone: true,
        college: true,
        branch: true,
        year: true,
        createdAt: true,

        certificateIssued: true,
        certificateId: true,
      },
    }),

    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),

  ]);

  const totalRegistrations = registrations.length;
  const totalUsers = users.length;
  const totalEvents = events.length;

  const today = new Date().toDateString();

  const todayRegistrations = registrations.filter(
    (registration) =>
      new Date(registration.createdAt).toDateString() === today
  ).length;

  const eventCounts = registrations.reduce((acc, registration) => {
    acc[registration.eventTitle] =
      (acc[registration.eventTitle] || 0) + 1;

    return acc;
  }, {} as Record<string, number>);

  const topEvents = Object.entries(eventCounts)
    .map(([eventTitle, count]) => ({
      eventTitle,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const chartData = Object.entries(eventCounts).map(
    ([name, registrations]) => ({
      name,
      registrations,
    })
  );

  const categoryCounts = events.reduce((acc, event) => {
    acc[event.category] =
      (acc[event.category] || 0) + 1;

    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryCounts).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  const activities = [
    {
      id: 1,
      title: "New User Registered",
      description: "A new student joined Event Aggregator.",
      time: "2 Minutes Ago",
      type: "user" as const,
    },
    {
      id: 2,
      title: "New Event Added",
      description: "Hackathon 2026 was created.",
      time: "10 Minutes Ago",
      type: "event" as const,
    },
    {
      id: 3,
      title: "Registration Completed",
      description: "A student registered successfully.",
      time: "30 Minutes Ago",
      type: "registration" as const,
    },
    {
      id: 4,
      title: "Old Registration Deleted",
      description: "Admin removed an old registration.",
      time: "1 Hour Ago",
      type: "delete" as const,
    },
  ];

  return (
    <main>

      {/* Header */}

      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6 mb-10">

        <div>

          <h1 className="text-4xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Overview of your Event Aggregator platform.
          </p>

        </div>

        <div className="flex gap-4 flex-wrap">

          <Link
            href="/admin/events/add"
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            + Add Event
          </Link>

          <Link
            href="/admin/registrations"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            View Registrations
          </Link>

        </div>

      </div>

      {/* Dashboard Cards */}

      <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">

        <DashboardCard
          title="Total Users"
          value={totalUsers}
          icon="👨‍🎓"
          description="Registered Students"
        />

        <DashboardCard
          title="Total Events"
          value={totalEvents}
          icon="🎯"
          description="Available Events"
        />

        <DashboardCard
          title="Registrations"
          value={totalRegistrations}
          icon="📝"
          description="Overall Registrations"
        />

        <DashboardCard
          title="Today's Registration"
          value={todayRegistrations}
          icon="📅"
          description="Today's Activity"
        />

      </div>

      {/* Users + Top Events */}

      <div className="grid lg:grid-cols-2 gap-8 mt-10">

        <LatestUsers users={users} />

        <TopEvents events={topEvents} />

      </div>

      {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-8 mt-10">

        <RegistrationChart
          data={chartData}
        />

        <CategoryPieChart
          data={pieData}
        />

      </div>

      {/* Activity */}

      <div className="mt-10">

        <ActivityFeed
          activities={activities}
        />

      </div>

      {/* Quick Actions */}

      <div className="mt-10">

        <QuickActions />

      </div>

      {/* Recent Registrations */}

      <div className="mt-10">

        <RegistrationTable
          registrations={registrations.slice(0, 5)}
        />

      </div>

    </main>
  );
}