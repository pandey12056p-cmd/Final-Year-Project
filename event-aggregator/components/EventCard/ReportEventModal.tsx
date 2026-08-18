"use client";

import { useState } from "react";

type Props = {
  eventId: number;
};

export default function ReportEventModal({ eventId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("Incorrect Information");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`/api/events/${eventId}/report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason, comment }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          setIsOpen(false);
          setSuccess(false);
          setComment("");
        }, 2000);
      } else {
        setError(data.message || "Failed to submit report. Please log in as a student.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-xs text-rose-600 hover:text-rose-800 font-extrabold cursor-pointer border border-rose-200 hover:border-rose-350 bg-rose-50 px-3 py-1.5 rounded-xl transition"
      >
        🚩 Report Event
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-3xl border border-slate-205 w-full max-w-md p-6 shadow-2xl space-y-4 text-xs"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-800 flex items-center gap-1">
                <span>🚩</span> Report Suspect Event
              </h2>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-650 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-xl font-bold text-center">
                ✅ Report submitted. Administrators will review it.
              </div>
            )}

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl font-bold">
                ⚠️ {error}
              </div>
            )}

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Report Reason
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold"
              >
                <option>Incorrect Information</option>
                <option>Fake Event</option>
                <option>Suspicious Registration Link</option>
                <option>Wrong Dates / Location</option>
                <option>Spam / Abusive</option>
                <option>Other</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                Detailed Comments (Optional)
              </label>
              <textarea
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Please describe why you are flagging this event..."
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium resize-none placeholder-slate-400"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 text-xs">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="border border-slate-200 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 text-slate-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-rose-600 hover:bg-rose-700 disabled:bg-rose-350 text-white px-5 py-2 rounded-xl font-bold cursor-pointer transition shadow-md shadow-rose-500/10"
              >
                {loading ? "Submitting..." : "Submit Flag"}
              </button>
            </div>

          </form>
        </div>
      )}
    </>
  );
}
