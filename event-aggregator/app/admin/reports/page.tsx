import { prisma } from "@/lib/prisma";

import SummaryCards from "@/components/Reports/SummaryCards";
import CategoryReport from "@/components/Reports/CategoryReport";
import EventReportTable from "@/components/Reports/EventReportTable";
import MonthlyRegistrations from "@/components/Reports/MonthlyRegistrations";
import ExportButtons from "@/components/Reports/ExportButtons";

export const dynamic = "force-dynamic";

export default async function ReportsPage() {

  const [users, events, registrations] = await Promise.all([

    prisma.user.findMany(),

    prisma.event.findMany(),

    prisma.registration.findMany({
      orderBy: {
        createdAt: "asc",
      },
    }),

  ]);

  /* ===============================
          Summary Cards
  =============================== */

  const totalUsers = users.length;
  const totalEvents = events.length;
  const totalRegistrations = registrations.length;

  const totalCategories = new Set(
    events.map((event) => event.category)
  ).size;

  /* ===============================
          Category Report
  =============================== */

  const categoryMap: Record<string, number> = {};

  events.forEach((event) => {
    categoryMap[event.category] =
      (categoryMap[event.category] || 0) + 1;
  });

  const categories = Object.entries(categoryMap).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  /* ===============================
          Event Report
  =============================== */

  const eventMap: Record<string, number> = {};

  registrations.forEach((registration) => {
    eventMap[registration.eventTitle] =
      (eventMap[registration.eventTitle] || 0) + 1;
  });

  const eventReport = Object.entries(eventMap)
    .map(([eventTitle, registrations]) => {

      const event = events.find(
        (e) => e.title === eventTitle
      );

      return {
        eventTitle,
        category: event?.category || "Unknown",
        registrations,
      };
    })
    .sort(
      (a, b) =>
        b.registrations - a.registrations
    );

  /* ===============================
      Monthly Registration Report
  =============================== */

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const monthMap: Record<string, number> = {};

  registrations.forEach((registration) => {

    const month =
      months[
        new Date(
          registration.createdAt
        ).getMonth()
      ];

    monthMap[month] =
      (monthMap[month] || 0) + 1;

  });

  const monthlyData = months.map((month) => ({
    month,
    count: monthMap[month] || 0,
  }));

  return (
    <main className="space-y-10">

      {/* Heading */}

      <div>

        <h1 className="text-xl font-bold text-slate-800">
          Reports Dashboard
        </h1>

        <p className="text-xs text-slate-400 mt-1">
          Complete analytics of Event Aggregator
        </p>

      </div>

      {/* Summary */}

      <SummaryCards
        totalUsers={totalUsers}
        totalEvents={totalEvents}
        totalRegistrations={totalRegistrations}
        totalCategories={totalCategories}
      />

      {/* Charts */}

      <div className="grid lg:grid-cols-2 gap-8">

        <MonthlyRegistrations
          data={monthlyData}
        />

        <CategoryReport
          categories={categories}
        />

      </div>

      {/* Event Table */}

      <EventReportTable
        events={eventReport}
      />

      {/* Export */}

      <ExportButtons
        monthlyData={monthlyData}
        categories={categories}
        events={eventReport}
        totalUsers={totalUsers}
        totalEvents={totalEvents}
        totalRegistrations={totalRegistrations}
      />

    </main>
  );
}