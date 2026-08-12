"use client";

import { useMemo, useState } from "react";
import DeleteRegistrationButton from "./DeleteRegistrationButton";
import { formatDate } from "@/lib/date";

type Registration = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  eventTitle: string;
  year: string;
  createdAt: Date | string;
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

      <div className="bg-white rounded-2xl shadow-lg overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-4">Student</th>
              <th className="p-4">Email</th>
              <th className="p-4">Phone</th>
              <th className="p-4">College</th>
              <th className="p-4">Event</th>
              <th className="p-4">Year</th>
              <th className="p-4">Date</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredRegistrations.map((reg) => (
              <tr
                key={reg.id}
                className="border-b hover:bg-slate-50"
              >
                <td className="p-4 font-semibold">
                  {reg.fullName}
                </td>

                <td className="p-4">{reg.email}</td>

                <td className="p-4">{reg.phone}</td>

                <td className="p-4">{reg.college}</td>

                <td className="p-4">{reg.eventTitle}</td>

                <td className="p-4">{reg.year}</td>

                <td className="p-4">
                  {formatDate(reg.createdAt)}
                </td>

                <td className="p-4 text-center">
                  <DeleteRegistrationButton id={reg.id} />
                </td>
              </tr>
            ))}

            {filteredRegistrations.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-10 text-gray-500"
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