"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date";

type Event = {
  id: number;
  title: string;
  category: string;
  date: string;
  mode: string;
  location: string;
  status: string;
  createdAt: string;
  reviewReason: string | null;
  registrationDeadline: string;
};

export default function CollegeEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  const [feedbackEvent, setFeedbackEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    setLoading(true);
    try {
      const res = await fetch("/api/college/events");
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

  async function handleSubmitForApproval(eventId: number) {
    if (!confirm("Are you sure you want to submit this event for admin approval?")) return;

    try {
      const res = await fetch(`/api/college/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "PENDING_APPROVAL" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Event submitted for approval successfully!");
        fetchEvents();
      } else {
        alert(data.message || "Failed to submit event");
      }
    } catch (err) {
      console.error(err);
      alert("Submission failed");
    }
  }

  async function handleCancelEvent(eventId: number) {
    if (!confirm("WARNING: Are you sure you want to cancel this event? Registered students will be notified automatically.")) return;

    try {
      const res = await fetch(`/api/college/events/${eventId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("Event cancelled successfully.");
        fetchEvents();
      } else {
        alert(data.message || "Failed to cancel event");
      }
    } catch (err) {
      console.error(err);
      alert("Cancellation failed");
    }
  }

  // Filter events based on active tab
  const filteredEvents = events.filter((e) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "PENDING") return e.status === "PENDING_APPROVAL";
    if (activeTab === "APPROVED") return e.status === "APPROVED" || e.status === "Upcoming" || e.status === "Ongoing";
    if (activeTab === "CHANGES") return e.status === "CHANGES_REQUIRED";
    return e.status.toUpperCase() === activeTab;
  });

  const tabs = [
    { key: "ALL", label: "All Events" },
    { key: "DRAFT", label: "Drafts" },
    { key: "PENDING", label: "Pending Approval" },
    { key: "APPROVED", label: "Approved" },
    { key: "CHANGES", label: "Changes Required" },
    { key: "REJECTED", label: "Rejected" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
  ];

  function getStatusStyle(status: string) {
    switch (status) {
      case "APPROVED":
      case "Upcoming":
      case "Ongoing":
        return "bg-green-50 text-green-600 border-green-100";
      case "PENDING_APPROVAL":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "CHANGES_REQUIRED":
        return "bg-blue-50 text-blue-600 border-blue-100 animate-pulse";
      case "REJECTED":
        return "bg-rose-50 text-rose-600 border-rose-100";
      case "CANCELLED":
        return "bg-slate-100 text-slate-500 border-slate-200";
      case "Completed":
        return "bg-slate-50 text-slate-600 border-slate-200";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  }

  return (
    <main className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Manage Events</h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">View, modify, and submit your college event listings.</p>
        </div>
        <Link
          href="/college/events/add"
          className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-blue-500/10 transition cursor-pointer"
        >
          ➕ Create Event
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
              activeTab === tab.key
                ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Events Table Container */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold animate-pulse">
            Loading events...
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <span className="text-3xl block">📅</span>
            <h3 className="text-sm font-bold text-slate-800">No events found</h3>
            <p className="text-xs text-slate-400 font-semibold">There are no events matching this status.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/75 border-b border-slate-200">
              <tr className="text-slate-400 uppercase tracking-widest font-extrabold text-[9px]">
                <th className="px-5 py-3.5">Event Name</th>
                <th className="px-5 py-3.5">Category</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Mode / Venue</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEvents.map((event) => {
                const isApproved = event.status === "APPROVED" || event.status === "Upcoming" || event.status === "Ongoing";
                const isDraft = event.status === "DRAFT";
                const isChanges = event.status === "CHANGES_REQUIRED";
                const isRejected = event.status === "REJECTED";
                
                return (
                  <tr key={event.id} className="hover:bg-slate-50/30 transition text-xs">
                    <td className="px-5 py-4 font-bold text-slate-800">
                      {event.title}
                    </td>
                    <td className="px-5 py-4 text-slate-500 font-semibold">{event.category}</td>
                    <td className="px-5 py-4 text-slate-500 font-medium">{formatDate(event.date)}</td>
                    <td className="px-5 py-4 text-slate-500 font-medium">
                      {event.mode} • <span className="text-[10px]">{event.location}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${getStatusStyle(event.status)}`}>
                        {event.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                      {/* View admin feedback trigger */}
                      {(isChanges || isRejected) && event.reviewReason && (
                        <button
                          onClick={() => setFeedbackEvent(event)}
                          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          💬 Feedback
                        </button>
                      )}

                      {/* View Link */}
                      {isApproved && (
                        <Link
                          href={`/events/${event.id}`}
                          target="_blank"
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg font-bold text-[10px] inline-block"
                        >
                          👁️ View public
                        </Link>
                      )}

                      {/* Preview (for unapproved events) */}
                      {!isApproved && (
                        <Link
                          href={`/college/events/preview/${event.id}`}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg font-bold text-[10px] inline-block"
                        >
                          👁️ Preview
                        </Link>
                      )}

                      {/* Edit (Drafts & Changes Required only) */}
                      {(isDraft || isChanges || isApproved) && (
                        <Link
                          href={`/college/events/edit/${event.id}`}
                          className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-2.5 py-1.5 rounded-lg font-bold text-[10px] inline-block"
                        >
                          ✏️ Edit
                        </Link>
                      )}

                      {/* Submit / Resubmit */}
                      {isDraft && (
                        <button
                          onClick={() => handleSubmitForApproval(event.id)}
                          className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          🚀 Submit
                        </button>
                      )}

                      {isChanges && (
                        <button
                          onClick={() => handleSubmitForApproval(event.id)}
                          className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          🚀 Resubmit
                        </button>
                      )}

                      {/* Cancel (Approved events only) */}
                      {isApproved && (
                        <button
                          onClick={() => handleCancelEvent(event.id)}
                          className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          🛑 Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Admin Feedback Dialog Modal */}
      {feedbackEvent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-800">Admin Review Feedback</h2>
              <button
                onClick={() => setFeedbackEvent(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Event</h4>
              <p className="text-xs font-bold text-slate-700">{feedbackEvent.title}</p>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase">Status</h4>
              <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border inline-block ${getStatusStyle(feedbackEvent.status)}`}>
                {feedbackEvent.status}
              </span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase">Feedback Comment</h4>
              <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
                "{feedbackEvent.reviewReason || "No comment provided."}"
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setFeedbackEvent(null)}
                className="bg-blue-650 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Close Feedback
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
