"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "../Button/Button";

type EventCardProps = {
  id: number;
  title: string;
  image: string;
  date: string;
  location: string;
  description: string;
};

export default function EventCard({
  id,
  title,
  image,
  date,
  location,
  description,
}: EventCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleToggleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/saved-events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSaved(data.saved);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 overflow-hidden hover:shadow-xl transition duration-300 flex flex-col justify-between">
      <div>
        <div className="relative">
          <img
            src={image}
            alt={title}
            className="w-full h-52 object-cover"
          />

          <button
            onClick={handleToggleSave}
            disabled={saving}
            className={`absolute top-3 right-3 px-3 py-1.5 rounded-full text-xs font-extrabold backdrop-blur-md shadow transition flex items-center gap-1 ${
              isSaved
                ? "bg-pink-600 text-white"
                : "bg-white/90 text-slate-800 hover:bg-white"
            }`}
          >
            <span>{isSaved ? "♥ Saved" : "♡ Save Event"}</span>
          </button>
        </div>

        <div className="p-6 space-y-3">
          <h2 className="text-xl font-bold text-slate-900 leading-snug">
            {title}
          </h2>

          <div className="text-xs text-slate-600 space-y-1">
            <p>📅 <strong>Date:</strong> {date}</p>
            <p>📍 <strong>Location:</strong> {location}</p>
          </div>

          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      <div className="p-6 pt-0">
        <Link href={`/events/${id}`}>
          <Button>
            View Event & Register →
          </Button>
        </Link>
      </div>
    </div>
  );
}