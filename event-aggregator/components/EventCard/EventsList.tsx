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
  const [certFilter, setCertFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Upcoming");

  const filteredEvents = useMemo(() => {
    let result = events.filter((event) => {
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        event.title.toLowerCase().includes(q) ||
        event.organizer.toLowerCase().includes(q) ||
        event.description.toLowerCase().includes(q);

      const matchCategory = category === "All" || event.category === category;
      const matchMode = mode === "All" || event.mode === mode;
      const matchStatus = status === "All" || event.status === status;
      const matchCert =
        certFilter === "All" ||
        (certFilter === "Available" && event.certificateAvailable);

      return matchSearch && matchCategory && matchMode && matchStatus && matchCert;
    });

    // Sorting
    if (sortBy === "Upcoming") {
      result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    } else if (sortBy === "Latest") {
      result.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
    } else if (sortBy === "Deadline") {
      result.sort((a, b) => new Date(a.registrationDeadline).getTime() - new Date(b.registrationDeadline).getTime());
    } else if (sortBy === "Popular") {
      result.sort((a, b) => b.maxParticipants - a.maxParticipants);
    }

    return result;
  }, [events, search, category, mode, status, certFilter, sortBy]);

  return (
    <>
      {/* Enhanced Multi-Filter Bar */}
      <div className="max-w-7xl mx-auto mt-8 bg-white p-6 rounded-3xl shadow-md border border-slate-200/80 space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <input
            placeholder="🔍 Search events by title, organizer or keywords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl p-3.5 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none w-full"
          />

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-2xl p-3.5 text-xs font-bold text-slate-800 outline-none shrink-0"
          >
            <option value="Upcoming">Sort by: Upcoming Date</option>
            <option value="Latest">Sort by: Recently Added</option>
            <option value="Deadline">Sort by: Closing Soon</option>
            <option value="Popular">Sort by: Popular Seats</option>
          </select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-2xl p-3 outline-none"
          >
            <option value="All">Category: All</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Workshop">Workshop</option>
            <option value="Seminar">Seminar</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Placement Drive">Placement Drive</option>
          </select>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-2xl p-3 outline-none"
          >
            <option value="All">Mode: All</option>
            <option value="Offline">Offline</option>
            <option value="Online">Online</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-2xl p-3 outline-none"
          >
            <option value="All">Status: All</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={certFilter}
            onChange={(e) => setCertFilter(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-2xl p-3 outline-none"
          >
            <option value="All">Certificates: All</option>
            <option value="Available">Certificate Available</option>
          </select>
        </div>
      </div>

      {/* Events Grid */}
      <div className="max-w-7xl mx-auto mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="text-xl font-bold text-slate-800">No Events Found</h2>
            <p className="text-slate-500 text-xs mt-1">Try resetting your filters or search keywords.</p>
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