"use client";

import { useMemo, useState } from "react";
import DeleteRegistrationButton from "./DeleteRegistrationButton";

type Registration = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  eventTitle: string;
  year: string;
  createdAt: Date;
};

export default function RegistrationSearchTable({
  registrations,
}: {
  registrations: Registration[];
}) {
  const [search, setSearch] = useState("");

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const value = search.toLowerCase();

      return (
        item.fullName.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.college.toLowerCase().includes(value) ||
        item.eventTitle.toLowerCase().includes(value)
      );
    });
  }, [registrations, search]);

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by student, email, college or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-xl px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/75 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Student</th>
              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Email</th>
              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Phone</th>
              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">College</th>
              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Event</th>
              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Year</th>
              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Date</th>
              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold text-center">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredRegistrations.map((reg) => (
              <tr
                key={reg.id}
                className="hover:bg-slate-50/50 transition"
              >
                <td className="px-5 py-3 text-xs font-bold text-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shadow-sm">
                      {reg.fullName.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{reg.fullName}</span>
                  </div>
                </td>

                <td className="px-5 py-3 text-xs font-semibold text-slate-500">{reg.email}</td>

                <td className="px-5 py-3 text-xs font-semibold text-slate-500">{reg.phone}</td>

                <td className="px-5 py-3 text-xs font-semibold text-slate-600">{reg.college}</td>

                <td className="px-5 py-3 text-xs font-bold text-slate-700">{reg.eventTitle}</td>

                <td className="px-5 py-3 text-xs font-semibold text-slate-500">{reg.year}</td>

                <td className="px-5 py-3 text-xs font-semibold text-slate-500">
                  {new Date(reg.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="px-5 py-3 text-center">
                  <DeleteRegistrationButton id={reg.id} />
                </td>
              </tr>
            ))}

            {filteredRegistrations.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-10 text-xs text-slate-400"
                >
                  No registrations found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}