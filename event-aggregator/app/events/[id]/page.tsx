import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/date";

import EventHeroActions from "@/components/EventCard/EventHeroActions";
import EventAboutSection from "@/components/EventCard/EventAboutSection";
import EventMatchChecker from "@/components/EventCard/EventMatchChecker";
import EventFeedbackForm from "@/components/EventCard/EventFeedbackForm";
import ReportEventModal from "@/components/EventCard/ReportEventModal";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EventDetailsPage({ params }: Props) {
  const { id } = await params;
  const eventId = Number(id);

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { college: true },
  });

  if (!event) {
    notFound();
  }

  const registrationsCount = await prisma.registration.count({
    where: { eventId: event.id },
  });

  const now = new Date();
  const deadline = new Date(event.registrationDeadline);
  const eventDate = new Date(event.date);

  const isExpired = now > deadline;
  const isFull = registrationsCount >= event.maxParticipants;
  const remainingSeats = Math.max(0, event.maxParticipants - registrationsCount);
  const capacityPercentage = Math.min(100, Math.round((registrationsCount / event.maxParticipants) * 100));

  // Dynamic Deadline Calculation
  const diffDays = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  let deadlineBadge = "";
  if (isExpired) {
    deadlineBadge = "Registration Closed";
  } else if (diffDays === 0) {
    deadlineBadge = "Last Day to Register!";
  } else if (diffDays === 1) {
    deadlineBadge = "1 Day Remaining";
  } else {
    deadlineBadge = `${diffDays} Days Remaining`;
  }

  // Status visual badge color
  let statusBg = "bg-blue-600 text-white";
  if (event.status === "Completed") statusBg = "bg-slate-700 text-white";
  else if (event.status === "Ongoing") statusBg = "bg-emerald-600 text-white";
  else if (isExpired || isFull) statusBg = "bg-red-600 text-white";

  return (
    <main className="min-h-screen bg-slate-100 pb-20 pt-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Back Link */}
        <div>
          <Link href="/events" className="text-xs font-bold text-slate-600 hover:text-blue-700 transition flex items-center gap-1">
            <span>←</span> Back to All Events
          </Link>
        </div>

        {/* 1. HERO SECTION (2-Col Desktop / Vertical Mobile) */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-10">
          <div className="grid lg:grid-cols-12 gap-8 items-start">

            {/* Left: Event Image */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-md group">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-72 md:h-96 object-cover transition duration-300 group-hover:scale-105"
              />
              <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {event.category}
              </span>
            </div>

            {/* Right: Event Summary & Hero Actions */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider ${statusBg}`}>
                  {isExpired ? "Registration Closed" : isFull ? "Event Full" : event.status}
                </span>

                {event.certificateAvailable && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                    📜 Verified Certificate Available
                  </span>
                )}

                {/* Verified Event Badge */}
                {(event.status === "APPROVED" || event.status === "Upcoming" || event.status === "Ongoing") && (
                  <span className="bg-blue-50 text-blue-700 text-[10px] font-black px-3 py-1 rounded-full border border-blue-200">
                    ✓ Verified Event
                  </span>
                )}

                {/* Verified College Badge */}
                {event.college?.status === "VERIFIED" && (
                  <span className="bg-indigo-50 text-indigo-700 text-[10px] font-black px-3 py-1 rounded-full border border-indigo-200">
                    ✓ Verified College
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                {event.title}
              </h1>

              <p className="text-slate-600 text-xs md:text-sm line-clamp-3 leading-relaxed">
                {event.description}
              </p>

              {/* Highlights Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Date</span>
                  <span className="font-bold text-slate-900">📅 {formatDate(event.date)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Location</span>
                  <span className="font-bold text-slate-900">📍 {event.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Mode</span>
                  <span className="font-bold text-slate-900">💻 {event.mode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Prize Pool</span>
                  <span className="font-bold text-emerald-700">🏆 ₹{event.prize}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Team Size</span>
                  <span className="font-bold text-slate-900">👥 {event.teamSize}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Organizer</span>
                  <span className="font-bold text-slate-900">🏢 {event.organizer}</span>
                </div>
              </div>

              {/* Client Hero Actions */}
              <EventHeroActions
                eventId={event.id}
                eventTitle={event.title}
                isExpired={isExpired}
                isFull={isFull}
                status={event.status}
              />
            </div>

          </div>
        </div>

        {/* 2 & 3. DEADLINE & CAPACITY STATUS CARDS */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* Registration Deadline Card */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registration Deadline</span>
              <h3 className="text-xl font-black text-slate-900">{formatDate(event.registrationDeadline)}</h3>
              <p className="text-xs font-semibold text-slate-500">Ensure seat reservation prior to closing date.</p>
            </div>

            <div className={`px-4 py-2.5 rounded-2xl text-center shrink-0 font-extrabold text-xs shadow-xs ${
              isExpired ? "bg-red-100 text-red-800" : diffDays <= 2 ? "bg-amber-100 text-amber-900 border border-amber-300" : "bg-blue-100 text-blue-900"
            }`}>
              ⏳ {deadlineBadge}
            </div>
          </div>

          {/* Participation Capacity Card */}
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">Capacity & Available Seats</span>
              <span className="text-blue-700">{registrationsCount} / {event.maxParticipants} Registered</span>
            </div>

            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  capacityPercentage >= 90 ? "bg-red-500" : capacityPercentage >= 60 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${capacityPercentage}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs font-bold text-slate-600">
              <span>{isFull ? "Registration Full 🚫" : `${remainingSeats} seats remaining`}</span>
              <span className="text-slate-400 text-[11px]">{capacityPercentage}% Seats Occupied</span>
            </div>
          </div>

        </div>

        {/* 4 & 5. EVENT ABOUT & INFORMATION GRID */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-200/80 space-y-8">
          <EventAboutSection description={event.description} />

          {/* Clean Information Grid */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <span>📋</span> Event Details & Specification Grid
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Date & Time</span>
                <span className="font-bold text-slate-900 text-sm mt-1 block">📅 {formatDate(event.date)}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Venue Location</span>
                <span className="font-bold text-slate-900 text-sm mt-1 block">📍 {event.location}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Participation Mode</span>
                <span className="font-bold text-slate-900 text-sm mt-1 block">💻 {event.mode}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Organizing Entity</span>
                <span className="font-bold text-slate-900 text-sm mt-1 block">🏢 {event.organizer}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Allowed Team Size</span>
                <span className="font-bold text-slate-900 text-sm mt-1 block">👥 {event.teamSize}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Prize Pool</span>
                <span className="font-bold text-emerald-700 text-sm mt-1 block">🏆 ₹{event.prize}</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Certificate Status</span>
                <span className="font-bold text-slate-900 text-sm mt-1 block">
                  {event.certificateAvailable ? "📜 Issued Post-Event" : "❌ Not Available"}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
                <span className="text-slate-400 text-[10px] font-bold uppercase block">Max Capacity</span>
                <span className="font-bold text-slate-900 text-sm mt-1 block">👨‍🎓 {event.maxParticipants} Students</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6. EVENT TIMELINE */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-200/80 space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span>🗓️</span> Event Schedule Timeline
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-1">
              <span className="text-blue-800 font-bold text-[10px] uppercase">Step 1 — Registration Deadline</span>
              <h4 className="font-extrabold text-slate-900">{formatDate(event.registrationDeadline)}</h4>
              <p className="text-slate-600 text-[11px]">Seat reservation portal closes.</p>
            </div>

            <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-1">
              <span className="text-indigo-800 font-bold text-[10px] uppercase">Step 2 — Main Event Date</span>
              <h4 className="font-extrabold text-slate-900">{formatDate(event.date)}</h4>
              <p className="text-slate-600 text-[11px]">Live event execution & participation.</p>
            </div>

            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-1">
              <span className="text-emerald-800 font-bold text-[10px] uppercase">Step 3 — Certificate Issuance</span>
              <h4 className="font-extrabold text-slate-900">
                {event.certificateAvailable ? "Post-Event Completion" : "Not Applicable"}
              </h4>
              <p className="text-slate-600 text-[11px]">Admin issues QR-verifiable certificate.</p>
            </div>
          </div>
        </div>

        {/* 7. AI ELIGIBILITY ASSISTANT */}
        <div>
          <EventMatchChecker eventId={event.id} eventTitle={event.title} />
        </div>

        {/* 8. ORGANIZED BY SECTION */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-bold">
              🏢
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Organized By {event.organizer}</h3>
              <p className="text-xs text-slate-500">Official Campus Event Partner • Verified Authority</p>
            </div>
          </div>
          <ReportEventModal eventId={event.id} />
        </div>

        {/* 9. EVENT FEEDBACK FORM (FOR COMPLETED EVENTS) */}
        {event.status === "Completed" && (
          <div>
            <EventFeedbackForm eventId={event.id} eventTitle={event.title} />
          </div>
        )}

      </div>

      {/* STICKY MOBILE REGISTRATION CTA BAR */}
      {!isExpired && !isFull && event.status !== "Completed" && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-3.5 z-50 flex items-center justify-between gap-3 shadow-2xl">
          <div>
            <span className="text-white text-xs font-bold block">{event.title}</span>
            <span className="text-emerald-400 text-[10px] font-semibold">{remainingSeats} seats left</span>
          </div>

          <Link
            href={`/events/${event.id}/register`}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shrink-0 shadow"
          >
            Register Now →
          </Link>
        </div>
      )}
    </main>
  );
}