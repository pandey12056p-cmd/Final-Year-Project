"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/date";

type Registration = {
  id: number;
  eventId: number;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  participationType: string | null;
  teamName: string | null;
  teamMembers: string | null;
  reason: string;
  createdAt: string;
};

export default function CollegeRegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("ALL");
  const [yearFilter, setYearFilter] = useState("ALL");

  useEffect(() => {
    fetchRegistrations();
  }, []);

  async function fetchRegistrations() {
    setLoading(true);
    try {
      const res = await fetch("/api/college/registrations");
      const data = await res.json();
      if (res.ok && data.success) {
        setRegistrations(data.registrations);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  // Get unique event titles to populate filter dropdown
  const uniqueEvents = Array.from(new Set(registrations.map((r) => r.eventTitle)));

  // Filter registrations
  const filtered = registrations.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search);
      
    const matchesEvent = eventFilter === "ALL" || r.eventTitle === eventFilter;
    const matchesYear = yearFilter === "ALL" || r.year === yearFilter;

    return matchesSearch && matchesEvent && matchesYear;
  });

  // Export to CSV
  function handleCSVExport() {
    if (filtered.length === 0) {
      alert("No data to export.");
      return;
    }

    const headers = [
      "ID",
      "Event Title",
      "Full Name",
      "Email",
      "Phone",
      "College",
      "Branch",
      "Year",
      "Participation Type",
      "Team Name",
      "Registration Date",
    ];

    const rows = filtered.map((r) => [
      r.id,
      `"${r.eventTitle.replace(/"/g, '""')}"`,
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${r.email.replace(/"/g, '""')}"`,
      `"${r.phone}"`,
      `"${r.college.replace(/"/g, '""')}"`,
      `"${r.branch.replace(/"/g, '""')}"`,
      `"${r.year}"`,
      `"${r.participationType || "Individual"}"`,
      `"${(r.teamName || "").replace(/"/g, '""')}"`,
      new Date(r.createdAt).toISOString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registrations-${eventFilter.replace(/\s+/g, "_")}-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <main className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Event Registrations</h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">Manage and export participation lists for your college events.</p>
        </div>
        <button
          onClick={handleCSVExport}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-emerald-500/10 transition cursor-pointer flex items-center gap-1.5 shrink-0"
        >
          📥 Export CSV Data
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
        {/* Search */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Search Student</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-850 font-medium placeholder-slate-400"
          />
        </div>

        {/* Filter Event */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Filter by Event</label>
          <select
            value={eventFilter}
            onChange={(e) => setEventFilter(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-850 font-medium"
          >
            <option value="ALL">All Events</option>
            {uniqueEvents.map((evt) => (
              <option key={evt} value={evt}>
                {evt}
              </option>
            ))}
          </select>
        </div>

        {/* Filter Year */}
        <div className="flex flex-col">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Filter by Year</label>
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="border border-slate-200 bg-white rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-850 font-medium"
          >
            <option value="ALL">All Years</option>
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>
        </div>
      </div>

      {/* Registrations List Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold animate-pulse">
            Loading registrations list...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <span className="text-3xl block">👥</span>
            <h3 className="text-sm font-bold text-slate-800">No registrations found</h3>
            <p className="text-xs text-slate-400 font-semibold">Try modifying your search query or filter parameters.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/75 border-b border-slate-200">
              <tr className="text-slate-400 uppercase tracking-widest font-extrabold text-[9px]">
                <th className="px-5 py-3.5">Student Name</th>
                <th className="px-5 py-3.5">Event Title</th>
                <th className="px-5 py-3.5">College</th>
                <th className="px-5 py-3.5">Branch & Year</th>
                <th className="px-5 py-3.5">Contact details</th>
                <th className="px-5 py-3.5">Team Type</th>
                <th className="px-5 py-3.5">Date Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50/30 transition text-xs">
                  <td className="px-5 py-4 font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                      {reg.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p>{reg.fullName}</p>
                      <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{reg.email}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-650 font-bold">{reg.eventTitle}</td>
                  <td className="px-5 py-4 text-slate-500 font-medium">{reg.college}</td>
                  <td className="px-5 py-4 text-slate-500 font-medium">
                    {reg.branch} • <span className="font-bold text-slate-600">{reg.year}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 font-medium">{reg.phone}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${
                      reg.participationType === "Team"
                        ? "bg-purple-50 text-purple-600 border-purple-100"
                        : "bg-slate-50 text-slate-500 border-slate-200"
                    }`}>
                      {reg.participationType === "Team" ? `Team: ${reg.teamName || "Yes"}` : "Individual"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400 font-bold">
                    {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
