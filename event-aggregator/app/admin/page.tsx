import { prisma } from "@/lib/prisma";
import Link from "next/link";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import CategoryPieChart from "@/components/Dashboard/CategoryPieChart";
import RegistrationOverview from "@/components/Dashboard/RegistrationOverview";
import TopEvents from "@/components/Dashboard/TopEvents";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const todayDate = new Date();

  const [
    events,
    registrations,
    users,
    upcomingEventsCount,
    certificatesIssuedCount,
  ] = await Promise.all([
    prisma.event.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.registration.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.event.count({
      where: {
        date: {
          gte: todayDate,
        },
      },
    }),
    prisma.registration.count({
      where: {
        certificateIssued: true,
      },
    }),
  ]);

  const totalEvents = events.length;
  const totalRegistrations = registrations.length;
  const totalStudents = users.filter((u) => u.role === "student").length;

  // Calculate Last 7 Days counts for RegistrationOverview
  const dailyCounts = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const label = d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    const matchString = d.toDateString();
    const count = registrations.filter(
      (r) => new Date(r.createdAt).toDateString() === matchString
    ).length;
    return { label, value: count };
  });

  // Calculate top events counts
  const eventCounts = registrations.reduce((acc, registration) => {
    acc[registration.eventTitle] = (acc[registration.eventTitle] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topEvents = Object.entries(eventCounts)
    .map(([eventTitle, count]) => ({
      eventTitle,
      count,
    }))
    .sort((a, b) => b.count - a.count);

  // Calculate categories distribution
  const categoryCounts = events.reduce((acc, event) => {
    acc[event.category] = (acc[event.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Fetch upcoming events details for list
  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= todayDate)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 4);

  return (
    <main className="space-y-6">
      
      {/* Welcome & Calendar Picker Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Welcome back, Admin! 👋
          </h1>
          <p className="text-slate-500 mt-0.5 text-xs font-semibold">
            Here's what's happening with your events today.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-extrabold text-slate-700 shadow-sm">
          <span>📅</span>
          <span>
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Metrics Row (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        <DashboardCard
          title="Total Events"
          value={totalEvents}
          trend="↑ 12.5% this month"
          iconBg="bg-blue-50 text-blue-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <DashboardCard
          title="Upcoming Events"
          value={upcomingEventsCount}
          trend="↑ 8.4% this month"
          iconBg="bg-purple-50 text-purple-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <DashboardCard
          title="Registrations"
          value={totalRegistrations}
          trend="↑ 16.7% this month"
          iconBg="bg-orange-50 text-orange-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          }
        />
        <DashboardCard
          title="Students"
          value={totalStudents}
          trend="↑ 16.2% this month"
          iconBg="bg-emerald-50 text-emerald-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />
        <DashboardCard
          title="Certificates Issued"
          value={certificatesIssuedCount}
          trend="↑ 14.8% this month"
          iconBg="bg-amber-50 text-amber-600"
          icon={
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
            </svg>
          }
        />
      </div>

      {/* Middle Row Charts (3 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div>
          <CategoryPieChart data={pieData} />
        </div>
        <div>
          <RegistrationOverview data={dailyCounts} />
        </div>
        <div>
          <TopEvents events={topEvents} />
        </div>
      </div>

      {/* Bottom Listings Row (2 Columns: Wide Registrations and Narrow Upcoming Events) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Registrations Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Recent Registrations
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Latest student registrations
              </p>
            </div>
            <Link
              href="/admin/registrations"
              className="border border-slate-200 hover:bg-slate-50 transition text-[10px] font-bold text-blue-600 rounded-lg px-2.5 py-1"
            >
              View All
            </Link>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold">
                <th className="py-2.5 font-bold uppercase tracking-wider">Student</th>
                <th className="py-2.5 font-bold uppercase tracking-wider">Event</th>
                <th className="py-2.5 font-bold uppercase tracking-wider">Date</th>
                <th className="py-2.5 font-bold uppercase tracking-wider text-center">Status</th>
                <th className="py-2.5 text-center"></th>
              </tr>
            </thead>
            <tbody>
              {registrations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-slate-400">
                    No registrations found.
                  </td>
                </tr>
              ) : (
                registrations.slice(0, 5).map((reg) => (
                  <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-2.5 font-semibold text-slate-700 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                        {reg.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{reg.fullName}</span>
                    </td>
                    <td className="py-2.5 text-slate-600">{reg.eventTitle}</td>
                    <td className="py-2.5 text-slate-500 font-medium">
                      {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                        Registered
                      </span>
                    </td>
                    <td className="py-2.5 text-center text-slate-400 hover:text-slate-700 cursor-pointer">
                      •••
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Upcoming Events List */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Upcoming Events
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Events happening soon
              </p>
            </div>
            <Link
              href="/admin/events"
              className="border border-slate-200 hover:bg-slate-50 transition text-[10px] font-bold text-blue-600 rounded-lg px-2.5 py-1"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3.5">
            {upcomingEvents.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400">
                No upcoming events scheduled.
              </p>
            ) : (
              upcomingEvents.map((event) => {
                const eventDate = new Date(event.date);
                const diffTime = eventDate.getTime() - todayDate.getTime();
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                return (
                  <div key={event.id} className="flex items-center justify-between gap-3 text-xs">
                    
                    <div className="flex items-center gap-3">
                      {/* Date Block */}
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-150 flex flex-col items-center justify-center font-bold text-slate-700 text-[10px] leading-tight">
                        <span className="text-slate-800 font-extrabold text-xs">
                          {eventDate.getDate()}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider text-slate-400">
                          {eventDate.toLocaleDateString("en-IN", { month: "short" })}
                        </span>
                      </div>

                      {/* Details */}
                      <div>
                        <h4 className="font-bold text-slate-800 line-clamp-1">
                          {event.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                          {event.location}
                        </p>
                      </div>
                    </div>

                    {/* Time Left Status Tag */}
                    <span className="bg-purple-50 text-purple-600 border border-purple-100 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider whitespace-nowrap">
                      {diffDays <= 0 ? "Today" : `${diffDays} days left`}
                    </span>

                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Footer copyright */}
      <footer className="pt-4 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-400 font-bold">
        <span>© 2026 Event Aggregator. All rights reserved.</span>
        <span>Made with ❤️ for better events</span>
      </footer>

    </main>
  );
}