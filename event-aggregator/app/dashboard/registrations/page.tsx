import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { formatDate } from "@/lib/date";

export default async function StudentRegistrationsPage() {
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
    orderBy: { createdAt: "desc" },
  });

  // Fetch full event details for each registration
  const eventIds = registrations.map((r) => r.eventId);
  const events = await prisma.event.findMany({
    where: { id: { in: eventIds } },
  });

  const registeredWithDetails = registrations.map((reg) => {
    const event = events.find((e) => e.id === reg.eventId);
    return {
      ...reg,
      event,
    };
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-500/20 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/20">
            Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">📋 My Event Registrations</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Track your confirmed event registrations, schedules, and certificate statuses.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/10 px-4 py-2.5 rounded-2xl text-center shrink-0">
          <span className="text-2xl font-black block">{registrations.length}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Total Registered</span>
        </div>
      </div>

      {/* Registrations List */}
      {registeredWithDetails.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 shadow-sm border border-slate-200">
          <div className="text-5xl">📋</div>
          <h2 className="text-lg font-bold text-slate-800">No Registrations Found</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You haven't registered for any events yet. Explore upcoming hackathons and workshops!
          </p>
          <Link href="/events" className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {registeredWithDetails.map((item) => {
            const isCompleted = item.event?.status === "Completed";

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md hover:shadow-lg transition space-y-4"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {item.event?.category || "Event"}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-1">
                      {item.eventTitle}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    {item.certificateIssued ? (
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                        <span>🏆</span> Certificate Issued
                      </span>
                    ) : isCompleted ? (
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full border border-blue-200">
                        ✅ Event Completed
                      </span>
                    ) : (
                      <span className="bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full border border-amber-200">
                        ⌛ Confirmed (Upcoming)
                      </span>
                    )}
                  </div>
                </div>

                {/* Information Grid */}
                <div className="grid sm:grid-cols-3 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  <p><strong>📅 Date:</strong> {item.event ? formatDate(item.event.date) : "N/A"}</p>
                  <p><strong>📍 Mode/Location:</strong> {item.event?.mode || "N/A"} ({item.event?.location || "Online"})</p>
                  <p><strong>🕒 Registered On:</strong> {formatDate(item.createdAt)}</p>
                  <p><strong>🏛️ College:</strong> {item.college}</p>
                  <p><strong>🎓 Branch / Year:</strong> {item.branch} ({item.year})</p>
                  <p><strong>🆔 Reg ID:</strong> <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800 font-mono font-bold">#REG-{item.id}</code></p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 pt-1">
                  <Link
                    href={`/events/${item.eventId}`}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl transition"
                  >
                    View Event Details
                  </Link>

                  {item.certificateIssued && (
                    <>
                      <Link
                        href={`/certificate/${item.id}`}
                        target="_blank"
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow"
                      >
                        👁 View Certificate
                      </Link>

                      <Link
                        href={`/certificate/${item.id}?autoDownload=true`}
                        target="_blank"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition shadow flex items-center gap-1"
                      >
                        <span>📄</span> PDF Download
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
