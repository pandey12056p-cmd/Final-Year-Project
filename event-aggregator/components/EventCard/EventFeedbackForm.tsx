"use client";

import { useState } from "react";

type Props = {
  eventId: number;
  eventTitle: string;
};

export default function EventFeedbackForm({ eventId, eventTitle }: Props) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit feedback.");

      setStatus({ type: "success", message: "Thank you for your feedback!" });
    } catch (err: any) {
      setStatus({ type: "error", message: err.message || "Could not submit feedback." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200 space-y-4">
      <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
        <span>⭐</span> Event Feedback & Rating
      </h3>
      <p className="text-xs text-slate-500">
        Registered students can submit feedback for completed event "{eventTitle}".
      </p>

      {status && (
        <div className={`p-3 rounded-xl text-xs font-bold ${
          status.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"
        }`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Rating (1 to 5 Stars):</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-2xl transition ${star <= rating ? "text-amber-400 scale-110" : "text-slate-300"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Feedback Comment:</label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Feedback"}
        </button>
      </form>
    </div>
  );
}
