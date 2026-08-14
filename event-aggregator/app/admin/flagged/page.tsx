"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/date";

type Report = {
  id: number;
  eventId: number;
  reason: string;
  comment: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
  event: {
    title: string;
    status: string;
    college: {
      name: string;
      code: string;
    } | null;
  };
};

export default function AdminFlaggedPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/reports");
      const data = await res.json();
      if (res.ok && data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(reportId: number, action: "DISMISS" | "CANCEL_EVENT") {
    const confirmation =
      action === "CANCEL_EVENT"
        ? "WARNING: Are you sure you want to cancel this event? This will hide the event, notify registered students, and clear all reports."
        : "Are you sure you want to dismiss this student flag report? The event will remain active.";
        
    if (!confirm(confirmation)) return;

    try {
      const res = await fetch("/api/admin/reports", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId, action }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(data.message || "Action successful.");
        fetchReports();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Flagged Events Moderation</h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5 font-medium">Review reports filed by students regarding suspicious links, fake events, or incorrect dates.</p>
        </div>
        <div className="bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
          Active Flags: {reports.length}
        </div>
      </div>

      {/* Reports Table List */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold animate-pulse">
            Loading moderation queue...
          </div>
        ) : reports.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <span className="text-3xl block">🛡️</span>
            <h3 className="text-sm font-bold text-slate-800">Clear queue</h3>
            <p className="text-xs text-slate-400 font-semibold">No flagged events require moderation.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/75 border-b border-slate-200">
              <tr className="text-slate-400 uppercase tracking-widest font-extrabold text-[9px]">
                <th className="px-5 py-3.5">Reported Event</th>
                <th className="px-5 py-3.5">Flag Reason</th>
                <th className="px-5 py-3.5">Student Detail</th>
                <th className="px-5 py-3.5">Flagged Date</th>
                <th className="px-5 py-3.5">Admin Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((rep) => (
                <tr key={rep.id} className="hover:bg-slate-50/30 transition text-xs">
                  {/* Event */}
                  <td className="px-5 py-4 font-bold text-slate-800">
                    <div className="space-y-0.5">
                      <p className="text-slate-800">{rep.event.title}</p>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        Organizer: {rep.event.college?.name || "Internal Staff"}
                      </span>
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="px-5 py-4">
                    <div className="space-y-1">
                      <span className="bg-rose-50 border border-rose-100 text-rose-700 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                        {rep.reason}
                      </span>
                      {rep.comment && (
                        <p className="text-slate-500 font-medium italic text-[11px] max-w-[250px] leading-relaxed truncate">
                          "{rep.comment}"
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Student */}
                  <td className="px-5 py-4">
                    <div className="space-y-0.5">
                      <p className="text-slate-700 font-bold">{rep.user.name}</p>
                      <span className="text-[10px] text-slate-400 block font-medium">{rep.user.email}</span>
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-5 py-4 text-slate-450 font-bold">
                    {formatDate(rep.createdAt)}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4 space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => handleAction(rep.id, "CANCEL_EVENT")}
                      className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer shadow-xs transition"
                    >
                      🛑 Cancel Event
                    </button>
                    <button
                      onClick={() => handleAction(rep.id, "DISMISS")}
                      className="bg-slate-50 hover:bg-slate-100 border border-slate-250 text-slate-600 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer transition"
                    >
                      ✓ Dismiss Flag
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

    </main>
  );
}
