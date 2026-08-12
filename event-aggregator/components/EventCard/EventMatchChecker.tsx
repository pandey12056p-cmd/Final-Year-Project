"use client";

import { useState } from "react";
import { EventMatchAnalysis } from "@/types/event";

type Props = {
  eventId: number;
  eventTitle: string;
};

export default function EventMatchChecker({ eventId, eventTitle }: Props) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EventMatchAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckMatch() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/event-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to analyze match.");
      }

      setResult(data.match);
    } catch (err: any) {
      setError(err.message || "AI service is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-gradient-to-br from-indigo-900 via-blue-950 to-slate-900 text-white rounded-3xl p-6 shadow-xl border border-indigo-800/60 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/20">
            <span>🤖</span> AI Eligibility Assistant
          </div>
          <h3 className="text-xl font-bold mt-2">Am I Suitable For This Event?</h3>
          <p className="text-xs text-slate-300">
            Analyze how your profile, branch, and current skills align with {eventTitle}.
          </p>
        </div>

        <button
          onClick={handleCheckMatch}
          disabled={loading}
          className="bg-white hover:bg-blue-50 text-slate-950 font-extrabold px-6 py-3 rounded-2xl transition text-xs shadow-lg disabled:opacity-50 shrink-0 flex items-center gap-2"
        >
          {loading ? (
            <>
              <span className="animate-spin">⏳</span> AI is Analyzing...
            </>
          ) : (
            <>
              <span>🤖</span> Check My Match
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-200">
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div className="p-5 bg-white/10 backdrop-blur border border-white/15 rounded-2xl space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-black text-emerald-400">{result.matchScore}%</div>
              <div>
                <span className="bg-emerald-500/30 text-emerald-300 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  {result.matchLabel}
                </span>
                <p className="text-xs text-slate-300 mt-0.5">{result.recommendationStatement}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <p><strong className="text-blue-200">Why You Match:</strong> {result.whyMatch}</p>

            <div className="grid sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <p className="font-bold text-emerald-300 mb-1">✅ Skills You Already Have:</p>
                <div className="flex flex-wrap gap-1">
                  {result.skillsAlreadyHad.map((skill) => (
                    <span key={skill} className="bg-emerald-950/80 text-emerald-200 px-2 py-0.5 rounded text-[10px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <p className="font-bold text-blue-300 mb-1">🚀 Skills You Can Gain:</p>
                <div className="flex flex-wrap gap-1">
                  {result.skillsMayNeed.map((skill) => (
                    <span key={skill} className="bg-blue-950/80 text-blue-200 px-2 py-0.5 rounded text-[10px]">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
