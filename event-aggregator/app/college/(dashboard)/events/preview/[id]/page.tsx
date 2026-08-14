"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/date";

export default function EventPreviewPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  async function fetchEventDetails() {
    setLoading(true);
    try {
      const res = await fetch(`/api/college/events/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        setEvent(data.event);
      } else {
        setError(data.message || "Failed to load event");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch event data.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center space-y-3">
          <div className="text-4xl animate-bounce">⏳</div>
          <h1 className="text-lg font-bold text-slate-800">Loading Event Preview...</h1>
        </div>
      </main>
    );
  }

  if (error || !event) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center space-y-4">
          <div className="text-4xl">❌</div>
          <h1 className="text-2xl font-bold text-red-600">Event Not Found</h1>
          <Link href="/college/events" className="inline-block bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow">
            Back to Manage Events
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 pb-20 pt-6 px-4 md:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Link */}
        <div className="flex items-center justify-between">
          <Link href="/college/events" className="text-xs font-bold text-slate-600 hover:text-blue-700 transition flex items-center gap-1">
            <span>←</span> Back to Manage Events
          </Link>
          <span className="text-xs font-bold text-slate-400">Preview Mode • Status: {event.status}</span>
        </div>

        {/* Warning Banner */}
        <div className="bg-indigo-50 border border-indigo-200 text-indigo-900 px-5 py-3 rounded-2xl text-xs font-bold shadow-xs">
          👁️ **STUDENT MOCKUP VIEW:** Below is how the event page will look to students once approved. The registration buttons are disabled during preview.
        </div>

        {/* 1. HERO SECTION */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 md:p-10">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Image */}
            <div className="lg:col-span-5 relative rounded-3xl overflow-hidden shadow-md">
              <img
                src={event.image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                alt={event.title}
                className="w-full h-72 md:h-96 object-cover"
              />
              <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                {event.category}
              </span>
            </div>

            {/* Right Summary */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  Upcoming (Preview)
                </span>
                {event.certificateAvailable && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                    📜 Verified Certificate Available
                  </span>
                )}
                {event.isPaid ? (
                  <span className="bg-rose-100 text-rose-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-rose-200">
                    ₹{event.registrationFee} Registration Fee
                  </span>
                ) : (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-3 py-1 rounded-full border border-emerald-200">
                    FREE Registration
                  </span>
                )}
              </div>

              <h1 className="text-2xl md:text-4xl font-black text-slate-900 leading-tight">
                {event.title}
              </h1>

              <p className="text-slate-600 text-xs md:text-sm leading-relaxed">
                {event.description}
              </p>

              {/* Highlights Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Date</span>
                  <span className="font-bold text-slate-900">📅 {formatDate(event.date)}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Location / Venue</span>
                  <span className="font-bold text-slate-900">📍 {event.location}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Mode</span>
                  <span className="font-bold text-slate-900">💻 {event.mode}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase block">Prize Pool</span>
                  <span className="font-bold text-emerald-700">🏆 {event.prize}</span>
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

              {/* Disabled CTA Button */}
              <div className="pt-2">
                <button
                  disabled
                  className="w-full sm:w-auto bg-slate-200 text-slate-500 font-bold px-8 py-3 rounded-xl cursor-not-allowed text-xs"
                >
                  Registration Disabled (Preview Mode)
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 2 & 3. DEADLINE & CAPACITY CARDS */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Registration Deadline</span>
              <h3 className="text-xl font-black text-slate-900">{formatDate(event.registrationDeadline)}</h3>
              <p className="text-xs font-semibold text-slate-500">Ensure seat reservation prior to closing date.</p>
            </div>
            <div className="px-4 py-2.5 rounded-2xl text-center bg-blue-100 text-blue-900 font-extrabold text-xs shrink-0">
              ⏳ Pending Verification
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider text-[10px]">Seat Capacity</span>
              <span className="text-blue-700">Max {event.maxParticipants} Students</span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-emerald-500" style={{ width: "0%" }} />
            </div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-650">
              <span>{event.maxParticipants} seats remaining</span>
              <span className="text-slate-400 text-[11px]">0% Seats Occupied</span>
            </div>
          </div>
        </div>

        {/* 4 & 5. ELIGIBILITY DETAILS */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-slate-200/80 space-y-6">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <span>🎓</span> Eligibility & Rules Grid
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Colleges</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">{event.eligibleColleges || "All Colleges"}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Courses</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">{event.eligibleCourses || "All Courses"}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Branches</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">{event.eligibleBranches || "All Branches"}</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70">
              <span className="text-slate-400 text-[10px] font-bold uppercase block">Years</span>
              <span className="font-bold text-slate-900 text-sm mt-1 block">{event.eligibleYears || "All Years"}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-4 border-t border-slate-100">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Required Documents</span>
              <p className="font-extrabold text-slate-800">{event.requiredDocuments || "None"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Terms & Guidelines</span>
              <p className="font-extrabold text-slate-800">{event.termsAndConditions || "Standard Guidelines"}</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-1">
              <span className="text-slate-400 text-[10px] font-bold uppercase">Official Contact</span>
              <p className="font-extrabold text-slate-800">{event.contactDetails || "None"}</p>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}
