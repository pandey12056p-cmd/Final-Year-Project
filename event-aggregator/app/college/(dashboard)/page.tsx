import { prisma } from "@/lib/prisma";
import { getServerUser } from "@/lib/auth";
import Link from "next/link";
import DashboardCard from "@/components/Dashboard/DashboardCard";
import RegistrationOverview from "@/components/Dashboard/RegistrationOverview";

export default async function CollegeDashboardPage() {
  const user = await getServerUser();
  if (!user) return null;

  const college = await prisma.college.findUnique({
    where: { userId: user.id },
  });

  if (!college) return null;

  // Fetch college events
  const events = await prisma.event.findMany({
    where: { collegeId: college.id },
    orderBy: { createdAt: "desc" },
  });

  const eventIds = events.map((e) => e.id);

  // Fetch registrations for college events
  const registrations = await prisma.registration.findMany({
    where: { eventId: { in: eventIds } },
    orderBy: { createdAt: "desc" },
  });

  // Calculate metrics
  const totalEvents = events.length;
  const pendingApproval = events.filter((e) => e.status === "PENDING_APPROVAL").length;
  const approvedEvents = events.filter((e) => e.status === "APPROVED" || e.status === "Upcoming" || e.status === "Ongoing").length;
  const activeEvents = events.filter((e) => e.status === "Upcoming" || e.status === "Ongoing").length;
  const totalRegistrations = registrations.length;

  // Calculate daily registrations for registration chart (last 7 days)
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

  // Recent 5 registrations
  const recentRegistrations = registrations.slice(0, 5);

  // Recent 4 events
  const upcomingEvents = events
    .filter((e) => e.status !== "Completed" && e.status !== "CANCELLED")
    .slice(0, 4);

  return (
    <main className="space-y-6">
      
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard Overview 👋
          </h1>
          <p className="text-slate-500 mt-0.5 text-xs font-semibold">
            Track performance and registrations for your institutional events.
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
          trend="All registered events"
          iconBg="bg-blue-50 text-blue-600"
          icon={
            <span className="text-lg">📅</span>
          }
        />
        <DashboardCard
          title="Active Events"
          value={activeEvents}
          trend="Ongoing or upcoming events"
          iconBg="bg-emerald-50 text-emerald-600"
          icon={
            <span className="text-lg">🔥</span>
          }
        />
        <DashboardCard
          title="Pending Approval"
          value={pendingApproval}
          trend="Awaiting admin reviews"
          iconBg="bg-amber-50 text-amber-600"
          icon={
            <span className="text-lg">⌛</span>
          }
        />
        <DashboardCard
          title="Approved Events"
          value={approvedEvents}
          trend="Successfully verified events"
          iconBg="bg-purple-50 text-purple-600"
          icon={
            <span className="text-lg">✅</span>
          }
        />
        <DashboardCard
          title="Total Registrations"
          value={totalRegistrations}
          trend="Joined students count"
          iconBg="bg-orange-50 text-orange-600"
          icon={
            <span className="text-lg">👥</span>
          }
        />
      </div>

      {/* Analytics & Summary Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registration Chart - Left 2 columns */}
        <div className="lg:col-span-2">
          <RegistrationOverview data={dailyCounts} />
        </div>
        
        {/* Quick Actions Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-800">Quick Actions</h2>
            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Manage your event portal tasks</p>
          </div>
          <div className="space-y-3.5 my-6">
            <Link
              href="/college/events/add"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-150 hover:bg-blue-50 hover:border-blue-200 transition text-xs font-bold text-slate-700 hover:text-blue-800"
            >
              <span>➕ Add New Event</span>
              <span>→</span>
            </Link>
            <Link
              href="/college/registrations"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-150 hover:bg-purple-50 hover:border-purple-200 transition text-xs font-bold text-slate-700 hover:text-purple-800"
            >
              <span>📋 View Registrations & CSV</span>
              <span>→</span>
            </Link>
            <Link
              href="/college/profile"
              className="flex items-center justify-between p-3.5 rounded-xl border border-slate-150 hover:bg-emerald-50 hover:border-emerald-200 transition text-xs font-bold text-slate-700 hover:text-emerald-800"
            >
              <span>🏢 Update College Profile</span>
              <span>→</span>
            </Link>
          </div>
          <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-[11px] text-slate-500 font-medium leading-relaxed">
            🎓 Need help? Read our guidelines in Settings or contact support at support@eventaggregator.com.
          </div>
        </div>
      </div>

      {/* Recent Lists Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent Registrations Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between overflow-x-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-800">
                Recent Event Registrations
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Students who joined your college events
              </p>
            </div>
            <Link
              href="/college/registrations"
              className="border border-slate-200 hover:bg-slate-50 transition text-[10px] font-bold text-blue-600 rounded-lg px-2.5 py-1"
            >
              View All
            </Link>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold">
                <th className="py-2.5 font-bold uppercase tracking-wider">Student</th>
                <th className="py-2.5 font-bold uppercase tracking-wider">Event Title</th>
                <th className="py-2.5 font-bold uppercase tracking-wider">College</th>
                <th className="py-2.5 font-bold uppercase tracking-wider text-center">Branch & Year</th>
              </tr>
            </thead>
            <tbody>
              {recentRegistrations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-400 font-bold">
                    No registrations found yet.
                  </td>
                </tr>
              ) : (
                recentRegistrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition">
                    <td className="py-2.5 font-semibold text-slate-700 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                        {reg.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{reg.fullName}</span>
                    </td>
                    <td className="py-2.5 text-slate-600 font-semibold">{reg.eventTitle}</td>
                    <td className="py-2.5 text-slate-500 font-medium">{reg.college}</td>
                    <td className="py-2.5 text-center text-slate-500 font-bold">
                      {reg.branch} • {reg.year}
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
                Your Upcoming Events
              </h2>
              <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                Current active listings
              </p>
            </div>
            <Link
              href="/college/events"
              className="border border-slate-200 hover:bg-slate-50 transition text-[10px] font-bold text-blue-600 rounded-lg px-2.5 py-1"
            >
              View All
            </Link>
          </div>

          <div className="space-y-3.5">
            {upcomingEvents.length === 0 ? (
              <p className="text-center py-6 text-xs text-slate-400 font-bold">
                No active events.
              </p>
            ) : (
              upcomingEvents.map((event) => {
                const eventDate = new Date(event.date);
                const isApproved = event.status === "APPROVED" || event.status === "Upcoming" || event.status === "Ongoing";

                return (
                  <div key={event.id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      {/* Date Block */}
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-150 flex flex-col items-center justify-center font-bold text-slate-700 text-[10px] leading-tight shrink-0">
                        <span className="text-slate-800 font-extrabold text-xs">
                          {eventDate.getDate()}
                        </span>
                        <span className="text-[8px] uppercase tracking-wider text-slate-400">
                          {eventDate.toLocaleDateString("en-IN", { month: "short" })}
                        </span>
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">
                          {event.title}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-semibold mt-0.5 truncate">
                          Mode: {event.mode} • Cat: {event.category}
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider border shrink-0 ${
                      isApproved 
                        ? "bg-green-50 text-green-600 border-green-150" 
                        : event.status === "DRAFT" 
                          ? "bg-slate-50 text-slate-500 border-slate-200" 
                          : "bg-amber-50 text-amber-600 border-amber-150"
                    }`}>
                      {event.status}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

    </main>
  );
}
