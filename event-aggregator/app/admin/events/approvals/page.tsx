"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/date";

type College = {
  name: string;
  code: string;
  status: string;
  verificationDoc: string | null;
};

type Event = {
  id: number;
  title: string;
  category: string;
  date: string;
  mode: string;
  location: string;
  organizer: string;
  description: string;
  maxParticipants: number;
  prize: string;
  teamSize: string;
  status: string;
  registrationDeadline: string;
  isPaid: boolean;
  registrationFee: number;
  eligibleColleges: string | null;
  eligibleCourses: string | null;
  eligibleBranches: string | null;
  eligibleYears: string | null;
  requiredDocuments: string | null;
  termsAndConditions: string | null;
  contactDetails: string | null;
  officialRegistrationLink: string | null;
  certificateAvailable: boolean;
  submittedAt: string | null;
  college: College | null;
};

export default function AdminEventApprovalsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal / Detail states
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalAction, setModalAction] = useState<"REJECT" | "REQUEST_CHANGES" | null>(null);
  const [reasonText, setReasonText] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  async function fetchPendingEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events?status=PENDING_APPROVAL");
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(data.events);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(eventId: number) {
    if (!confirm("Are you sure you want to approve this event? It will become visible and open for registrations to students immediately.")) return;

    try {
      const res = await fetch("/api/admin/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, action: "APPROVE" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Event approved and published successfully!");
        setSelectedEvent(null);
        fetchPendingEvents();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleActionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedEvent || !modalAction) return;

    setSubmitLoading(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: selectedEvent.id,
          action: modalAction,
          reason: reasonText,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`Event status updated successfully.`);
        setSelectedEvent(null);
        setModalAction(null);
        setReasonText("");
        fetchPendingEvents();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  }

  return (
    <main className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Event Approvals Queue</h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5 font-medium">Verify event specifics, eligibility details, and organizer compliance.</p>
        </div>
        <div className="bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
          Pending Events: {events.length}
        </div>
      </div>

      {/* Events Table List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold animate-pulse">
            Loading approval queue...
          </div>
        ) : events.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <span className="text-3xl block">📋</span>
            <h3 className="text-sm font-bold text-slate-800">Queue is empty</h3>
            <p className="text-xs text-slate-400 font-semibold">There are no events awaiting verification.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/75 border-b border-slate-200">
              <tr className="text-slate-400 uppercase tracking-widest font-extrabold text-[9px]">
                <th className="px-5 py-3.5">Event Name</th>
                <th className="px-5 py-3.5">College Organizer</th>
                <th className="px-5 py-3.5">Submitted Date</th>
                <th className="px-5 py-3.5">Mode / Date</th>
                <th className="px-5 py-3.5">Participation Cost</th>
                <th className="px-5 py-3.5 text-right">Review</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {events.map((evt) => (
                <tr key={evt.id} className="hover:bg-slate-50/30 transition text-xs">
                  <td className="px-5 py-4 font-bold text-slate-800">{evt.title}</td>
                  <td className="px-5 py-4 font-semibold text-slate-500">
                    <div className="space-y-0.5">
                      <p className="text-slate-700">{evt.college?.name || evt.organizer}</p>
                      {evt.college && (
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                          evt.college.status === "VERIFIED"
                            ? "bg-green-50 text-green-600 border-green-150"
                            : "bg-amber-50 text-amber-600 border-amber-150"
                        }`}>
                          College: {evt.college.status}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-450 font-bold">
                    {evt.submittedAt ? formatDate(evt.submittedAt) : "Not recorded"}
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-medium">
                    {evt.mode} • <span className="font-bold text-[10px]">{formatDate(evt.date)}</span>
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-700">
                    {evt.isPaid ? `₹${evt.registrationFee}` : "Free"}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => setSelectedEvent(evt)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer shadow-xs transition"
                    >
                      🔍 Inspect Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Inspect Event Modal Drawer */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl p-6 md:p-8 shadow-2xl relative space-y-6">
            
            {/* Close */}
            <button
              onClick={() => {
                setSelectedEvent(null);
                setModalAction(null);
                setReasonText("");
              }}
              className="absolute right-5 top-5 bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full cursor-pointer transition"
            >
              ✕
            </button>

            {/* Title */}
            <div className="border-b border-slate-100 pb-3">
              <span className="bg-blue-50 text-blue-700 border border-blue-150 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                Event Verification Panel
              </span>
              <h2 className="text-xl font-black text-slate-800 mt-1">{selectedEvent.title}</h2>
            </div>

            {/* Layout details */}
            <div className="grid md:grid-cols-2 gap-6 text-xs">
              
              {/* Event basics */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5">1. Description & Schedule</h3>
                <p className="text-slate-500 font-semibold leading-relaxed">{selectedEvent.description}</p>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-black block uppercase">Event Date</span>
                    <span className="font-bold text-slate-700">{formatDate(selectedEvent.date)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-black block uppercase">Reg Deadline</span>
                    <span className="font-bold text-slate-700">{formatDate(selectedEvent.registrationDeadline)}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-black block uppercase">Mode & Venue</span>
                    <span className="font-bold text-slate-700">{selectedEvent.mode} ({selectedEvent.location})</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-black block uppercase">Category / Prize</span>
                    <span className="font-bold text-slate-700">{selectedEvent.category} (₹{selectedEvent.prize})</span>
                  </div>
                </div>
              </div>

              {/* Eligibility & College */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-1.5">2. Eligibility & Organizer Details</h3>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-black block uppercase">Eligible Courses</span>
                    <span className="font-bold text-slate-750">{selectedEvent.eligibleCourses || "All"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-black block uppercase">Eligible Branches</span>
                    <span className="font-bold text-slate-750">{selectedEvent.eligibleBranches || "All"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-black block uppercase">Eligible Years</span>
                    <span className="font-bold text-slate-750">{selectedEvent.eligibleYears || "All"}</span>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl">
                    <span className="text-[9px] text-slate-400 font-black block uppercase">Max Capacity</span>
                    <span className="font-bold text-slate-750">{selectedEvent.maxParticipants} Seats</span>
                  </div>
                </div>

                <div className="p-4 bg-blue-50/50 border border-blue-150 rounded-2xl space-y-2">
                  <div className="font-bold text-slate-750">Institution Verification Context</div>
                  {selectedEvent.college ? (
                    <div className="space-y-1 font-semibold text-slate-650">
                      <p>Institution: <span className="text-slate-800 font-bold">{selectedEvent.college.name}</span></p>
                      <p>Verification Status: <span className="font-extrabold uppercase text-green-700">{selectedEvent.college.status}</span></p>
                      {selectedEvent.college.verificationDoc && (
                        <a
                          href={selectedEvent.college.verificationDoc}
                          target="_blank"
                          className="text-xs text-blue-600 underline font-black block pt-1"
                        >
                          📄 Inspect Dean Signatory Authorization Document
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="font-semibold text-slate-400">Created by Event Aggregator Staff (Internal)</p>
                  )}
                </div>
              </div>

            </div>

            {/* Verification Actions */}
            <div className="border-t border-slate-100 pt-5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleApprove(selectedEvent.id)}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-xl font-bold transition shadow-md shadow-green-500/10 cursor-pointer text-xs"
                >
                  ✓ Approve & Publish Event
                </button>
                <button
                  type="button"
                  onClick={() => setModalAction("REQUEST_CHANGES")}
                  className="flex-1 sm:flex-none bg-blue-50 border border-blue-200 hover:bg-blue-100 text-blue-700 px-5 py-2.5 rounded-xl font-bold cursor-pointer text-xs"
                >
                  ✏️ Request Changes
                </button>
                <button
                  type="button"
                  onClick={() => setModalAction("REJECT")}
                  className="flex-1 sm:flex-none bg-rose-50 border border-rose-200 hover:bg-rose-100 text-rose-700 px-5 py-2.5 rounded-xl font-bold cursor-pointer text-xs"
                >
                  ✕ Reject Event
                </button>
              </div>
              
              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="text-slate-400 hover:text-slate-650 font-bold"
              >
                Close Inspect
              </button>
            </div>

            {/* Modal for rejecting/requesting changes reason input */}
            {modalAction && (
              <form
                onSubmit={handleActionSubmit}
                className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-4"
              >
                <div className="font-bold text-slate-800 border-b border-slate-200 pb-1.5 text-xs">
                  {modalAction === "REJECT" ? "Enter Rejection Reason" : "Enter Changes Requested Feedback Details"}
                </div>
                <div className="flex flex-col">
                  <textarea
                    required
                    rows={3}
                    value={reasonText}
                    onChange={(e) => setReasonText(e.target.value)}
                    placeholder="Enter review comments for the college representative..."
                    className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      setModalAction(null);
                      setReasonText("");
                    }}
                    className="border border-slate-250 px-4 py-2 rounded-xl font-bold cursor-pointer hover:bg-slate-100 text-slate-700 bg-white"
                  >
                    Cancel Action
                  </button>
                  <button
                    type="submit"
                    disabled={submitLoading}
                    className="bg-blue-650 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-bold cursor-pointer"
                  >
                    {submitLoading ? "Submitting Review..." : "Confirm Review Comments"}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </main>
  );
}
