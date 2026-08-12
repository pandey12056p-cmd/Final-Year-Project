import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { formatDate } from "@/lib/date";

export default async function EventCalendarPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-red-600">Please Login First</h1>
      </main>
    );
  }

  const decoded = jwt.decode(token) as { id: number };
  if (!decoded?.id) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-red-600">Invalid Token</h1>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold">User Not Found</h1>
      </main>
    );
  }

  const registrations = await prisma.registration.findMany({
    where: { email: user.email },
  });

  const registeredEventIds = registrations.map((r) => r.eventId);

  const upcomingEvents = await prisma.event.findMany({
    where: { status: { in: ["Upcoming", "Ongoing"] } },
    orderBy: { date: "asc" },
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-purple-500/20 text-purple-200 text-xs font-bold px-3 py-1 rounded-full border border-purple-400/20">
            Schedule Overview
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">📅 Event Schedule & Calendar</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Real timeline of your registered events and upcoming college hackathons.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/10 px-4 py-2.5 rounded-2xl text-center shrink-0">
          <span className="text-2xl font-black block">{upcomingEvents.length}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Live DB Events</span>
        </div>
      </div>

      {/* Calendar List Timeline */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span>🗓️</span> Timeline of Upcoming Campus Events
        </h2>

        {upcomingEvents.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            No upcoming events scheduled in the database.
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => {
              const isRegistered = registeredEventIds.includes(event.id);

              return (
                <div
                  key={event.id}
                  className={`p-5 rounded-2xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                    isRegistered
                      ? "bg-emerald-50/60 border-emerald-200"
                      : "bg-slate-50/70 border-slate-200/80"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-700 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                        {event.category}
                      </span>
                      {isRegistered ? (
                        <span className="bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                          ✅ Registered
                        </span>
                      ) : (
                        <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Open
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {event.title}
                    </h3>

                    <div className="text-xs text-slate-600 flex flex-wrap gap-4 pt-1">
                      <span>📅 <strong>Date:</strong> {formatDate(event.date)}</span>
                      <span>📍 <strong>Location:</strong> {event.location} ({event.mode})</span>
                      <span>⏳ <strong>Deadline:</strong> {formatDate(event.registrationDeadline)}</span>
                    </div>
                  </div>

                  <Link
                    href={`/events/${event.id}`}
                    className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shrink-0 shadow transition"
                  >
                    View Details →
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
