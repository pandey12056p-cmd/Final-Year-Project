import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { formatDate } from "@/lib/date";

export default async function SavedEventsPage() {
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

  const savedRecords = await prisma.savedEvent.findMany({
    where: { userId: decoded.id },
    orderBy: { createdAt: "desc" },
  });

  const eventIds = savedRecords.map((s) => s.eventId);

  const events = await prisma.event.findMany({
    where: { id: { in: eventIds } },
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-pink-500/20 text-pink-200 text-xs font-bold px-3 py-1 rounded-full border border-pink-400/20">
            Wishlist
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">❤️ Saved Events</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Events you have bookmarked to review or register later.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/10 px-4 py-2.5 rounded-2xl text-center shrink-0">
          <span className="text-2xl font-black block">{events.length}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Saved Items</span>
        </div>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center space-y-3 shadow-sm border border-slate-200">
          <div className="text-5xl">🤍</div>
          <h2 className="text-lg font-bold text-slate-800">No Saved Events Yet</h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click the "♡ Save Event" button on any event card or details page to bookmark it here.
          </p>
          <Link href="/events" className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow">
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-md hover:shadow-lg transition space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-40 object-cover rounded-2xl border border-slate-100"
                />

                <div className="flex items-center justify-between">
                  <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    {event.category}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{event.mode}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 leading-tight">
                  {event.title}
                </h3>

                <div className="text-xs text-slate-600 space-y-1">
                  <p>📅 <strong>Date:</strong> {formatDate(event.date)}</p>
                  <p>📍 <strong>Location:</strong> {event.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <Link
                  href={`/events/${event.id}`}
                  className="flex-1 text-center bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold py-2.5 rounded-xl transition shadow"
                >
                  View / Register
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
