"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type Props = {
  eventId: number;
  eventTitle: string;
  isExpired: boolean;
  isFull: boolean;
  status: string;
};

export default function EventHeroActions({
  eventId,
  eventTitle,
  isExpired,
  isFull,
  status,
}: Props) {
  const [isSaved, setIsSaved] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loadingSave, setLoadingSave] = useState(false);

  useEffect(() => {
    // Check saved state
    fetch("/api/saved-events")
      .then((res) => res.json())
      .then((data) => {
        if (data.savedEventIds && data.savedEventIds.includes(eventId)) {
          setIsSaved(true);
        }
      })
      .catch(() => {});

    // Check registration state
    fetch("/api/my-registrations")
      .then((res) => res.json())
      .then((data) => {
        if (data.registrations) {
          const registered = data.registrations.some((r: any) => r.eventId === eventId);
          if (registered) setIsRegistered(true);
        }
      })
      .catch(() => {});
  }, [eventId]);

  async function handleToggleSave() {
    setLoadingSave(true);
    try {
      const res = await fetch("/api/saved-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingSave(false);
    }
  }

  async function handleShare() {
    const shareUrl = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: eventTitle,
          text: `Check out this campus event: ${eventTitle}`,
          url: shareUrl,
        });
        return;
      } catch (e) {
        // Fallback to clipboard
      }
    }

    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const isClosed = isExpired || status === "Completed" || status === "Closed";

  return (
    <div className="space-y-4">

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        {isRegistered ? (
          <div className="bg-emerald-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow flex items-center gap-2">
            <span>✅</span> You Are Registered
          </div>
        ) : isClosed ? (
          <div className="bg-slate-300 text-slate-700 font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow cursor-not-allowed">
            🚫 Registration Closed
          </div>
        ) : isFull ? (
          <div className="bg-amber-600 text-white font-extrabold text-xs px-6 py-3.5 rounded-2xl shadow cursor-not-allowed">
            🚫 Capacity Full
          </div>
        ) : (
          <Link
            href={`/events/${eventId}/register`}
            className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-800 text-white font-black text-xs px-7 py-3.5 rounded-2xl shadow-lg transition duration-200 flex items-center gap-2"
          >
            <span>Register Now</span>
            <span>→</span>
          </Link>
        )}

        {/* Wishlist Save Button */}
        <button
          onClick={handleToggleSave}
          disabled={loadingSave}
          className={`px-4 py-3.5 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 border shadow-xs ${
            isSaved
              ? "bg-pink-600 text-white border-pink-600"
              : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
          }`}
        >
          <span>{isSaved ? "♥ Saved" : "♡ Save Event"}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-4 py-3.5 rounded-2xl text-xs font-bold transition shadow-xs flex items-center gap-1.5"
        >
          <span>🔗</span>
          <span>{copied ? "Link Copied ✓" : "Share"}</span>
        </button>
      </div>

      {copied && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold px-3 py-1.5 rounded-xl inline-block">
          ✨ Event link copied to clipboard!
        </div>
      )}

    </div>
  );
}
