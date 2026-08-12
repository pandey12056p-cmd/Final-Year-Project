"use client";

import React from "react";
import Link from "next/link";

type TopEvent = {
  eventTitle: string;
  count: number;
};

type TopEventsProps = {
  events: TopEvent[];
};

export default function TopEvents({ events }: TopEventsProps) {
  // Gradients for ranking thumbnails
  const gradients = [
    "from-blue-600 to-indigo-700",
    "from-purple-600 to-pink-700",
    "from-emerald-600 to-teal-700",
    "from-orange-500 to-amber-600",
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Top Events
          </h2>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
            Most registered events
          </p>
        </div>

        <Link
          href="/admin/events"
          className="border border-slate-200 hover:bg-slate-50 transition text-[10px] font-bold text-blue-600 rounded-lg px-2.5 py-1"
        >
          View All
        </Link>
      </div>

      {/* List items */}
      <div className="mt-4 flex-1 space-y-3">
        {events.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400">
            No event data available.
          </div>
        ) : (
          events.slice(0, 4).map((event, index) => (
            <div key={event.eventTitle} className="flex items-center justify-between gap-3 text-xs">
              
              <div className="flex items-center gap-3">
                {/* Index Rank */}
                <span className="font-extrabold text-slate-400 w-3 text-center">
                  {index + 1}
                </span>

                {/* Thumbnail Icon */}
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradients[index % gradients.length]} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                  {event.eventTitle.slice(0, 2).toUpperCase()}
                </div>

                {/* Info */}
                <div>
                  <h4 className="font-bold text-slate-800 line-clamp-1">
                    {event.eventTitle}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {event.count} registrations
                  </p>
                </div>
              </div>

              {/* Status Pill */}
              <span className="bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider shadow-sm border border-emerald-100">
                Active
              </span>

            </div>
          ))
        )}
      </div>

    </div>
  );
}