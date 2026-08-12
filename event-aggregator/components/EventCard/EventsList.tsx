"use client";

import { useMemo, useState } from "react";
import EventCard from "./EventCard";
import { Event } from "@/types/event";
import { formatDate } from "@/lib/date";

export default function EventsList({
  events,
}: {
  events: Event[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState("All");
  const [status, setStatus] = useState("All");

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchSearch = event.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchCategory =
        category === "All" || event.category === category;

      const matchMode =
        mode === "All" || event.mode === mode;

      const matchStatus =
        status === "All" || event.status === status;

      return (
        matchSearch &&
        matchCategory &&
        matchMode &&
        matchStatus
      );
    });
  }, [events, search, category, mode, status]);

  return (
    <>
      <div className="max-w-7xl mx-auto mt-10 grid md:grid-cols-4 gap-4">
        <input
          placeholder="Search Event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-xl p-3"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option>All</option>
          <option>Hackathon</option>
          <option>Workshop</option>
          <option>Seminar</option>
          <option>Sports</option>
          <option>Cultural</option>
          <option>Placement Drive</option>
        </select>

        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option>All</option>
          <option>Offline</option>
          <option>Online</option>
          <option>Hybrid</option>
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border rounded-xl p-3"
        >
          <option>All</option>
          <option>Upcoming</option>
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Closed</option>
        </select>
      </div>

      <div className="max-w-7xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl shadow p-8">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-bold text-slate-700">No Events Found</h2>
            <p className="text-gray-500 mt-2">Try adjusting your search filters.</p>
          </div>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.title}
              image={event.image}
              date={formatDate(event.date)}
              location={event.location}
              description={event.description}
            />
          ))
        )}
      </div>
    </>
  );
}