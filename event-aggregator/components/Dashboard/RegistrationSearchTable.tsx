"use client";

import { useMemo, useState } from "react";
import DeleteRegistrationButton from "./DeleteRegistrationButton";
import { formatDate } from "@/lib/date";

type Registration = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  studentId?: string | null;
  gender?: string | null;
  college: string;
  branch: string;
  year: string;
  semester?: string | null;
  specialization?: string | null;
  cgpa?: string | null;
  technicalSkills?: string | null;
  eventTitle: string;
  participationType?: string | null;
  teamName?: string | null;
  teamMembers?: string | null;
  reason?: string | null;
  previousExperience?: string | null;
  relevantSkills?: string | null;
  portfolioUrl?: string | null;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  emergencyContactName?: string | null;
  emergencyContactRelation?: string | null;
  emergencyContactPhone?: string | null;
  dietaryPreference?: string | null;
  tshirtSize?: string | null;
  accessibilityNeeds?: string | null;
  certificateIssued?: boolean;
  createdAt: Date | string;
};

export default function RegistrationSearchTable({
  registrations,
}: {
  registrations: Registration[];
}) {
  const [search, setSearch] = useState("");
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null);

  const filteredRegistrations = useMemo(() => {
    return registrations.filter((item) => {
      const value = search.toLowerCase();

      return (
        item.fullName.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value) ||
        item.college.toLowerCase().includes(value) ||
        item.eventTitle.toLowerCase().includes(value) ||
        (item.studentId && item.studentId.toLowerCase().includes(value)) ||
        (item.teamName && item.teamName.toLowerCase().includes(value))
      );
    });
  }, [registrations, search]);

  return (
    <>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by student, student ID, email, team, college or event..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-3.5 text-xs text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
        />
      </div>

      {/* Main Admin Registrations Table */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b132b] text-white">
              <tr>
                <th className="p-4 font-bold">Student Name</th>
                <th className="p-4 font-bold">Student ID</th>
                <th className="p-4 font-bold">Event Title</th>
                <th className="p-4 font-bold">College & Branch</th>
                <th className="p-4 font-bold">Type / Team</th>
                <th className="p-4 font-bold">Reg Date</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredRegistrations.map((reg) => (
                <tr key={reg.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-bold text-slate-900">
                    <div>{reg.fullName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{reg.email}</div>
                  </td>

                  <td className="p-4 font-mono font-bold text-blue-700">
                    {reg.studentId || "N/A"}
                  </td>

                  <td className="p-4 font-semibold text-slate-800">
                    {reg.eventTitle}
                  </td>

                  <td className="p-4 text-slate-700">
                    <div>{reg.college}</div>
                    <div className="text-[10px] text-slate-400">{reg.branch} ({reg.year})</div>
                  </td>

                  <td className="p-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      reg.participationType === "Team"
                        ? "bg-purple-100 text-purple-800 border border-purple-200"
                        : "bg-blue-100 text-blue-800 border border-blue-200"
                    }`}>
                      {reg.participationType || "Individual"}
                    </span>
                    {reg.teamName && (
                      <div className="text-[10px] font-semibold text-slate-600 mt-1">Team: {reg.teamName}</div>
                    )}
                  </td>

                  <td className="p-4 text-slate-500 whitespace-nowrap">
                    {formatDate(reg.createdAt)}
                  </td>

                  <td className="p-4 text-center space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedReg(reg)}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 text-[11px] font-bold px-3 py-1.5 rounded-xl border border-blue-200 transition"
                    >
                      👁 View Details
                    </button>
                    <DeleteRegistrationButton id={reg.id} />
                  </td>
                </tr>
              ))}

              {filteredRegistrations.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-slate-400">
                    No registrations found matching search criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal for Complete Field Inspection */}
      {selectedReg && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 space-y-6 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  Registration #{selectedReg.id}
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-1">{selectedReg.fullName}</h3>
                <p className="text-xs text-slate-500">{selectedReg.eventTitle}</p>
              </div>

              <button
                onClick={() => setSelectedReg(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Section 1: Identification & Contact */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Student Identification</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <p><strong className="text-slate-500">Student ID:</strong> {selectedReg.studentId || "N/A"}</p>
                  <p><strong className="text-slate-500">Gender:</strong> {selectedReg.gender || "N/A"}</p>
                  <p><strong className="text-slate-500">Email:</strong> {selectedReg.email}</p>
                  <p><strong className="text-slate-500">Phone:</strong> {selectedReg.phone}</p>
                </div>
              </div>

              {/* Section 2: Academic & Skills */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Academic Details</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <p><strong className="text-slate-500">College:</strong> {selectedReg.college}</p>
                  <p><strong className="text-slate-500">Branch & Year:</strong> {selectedReg.branch} ({selectedReg.year})</p>
                  <p><strong className="text-slate-500">Semester:</strong> {selectedReg.semester || "N/A"}</p>
                  <p><strong className="text-slate-500">Specialization:</strong> {selectedReg.specialization || "N/A"}</p>
                  <p><strong className="text-slate-500">CGPA / %:</strong> {selectedReg.cgpa || "N/A"}</p>
                  <p><strong className="text-slate-500">Technical Skills:</strong> {selectedReg.technicalSkills || "N/A"}</p>
                </div>
              </div>

              {/* Section 3: Participation & Team */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Event Participation</h4>
                <div className="space-y-1 text-slate-700">
                  <p><strong className="text-slate-500">Participation Type:</strong> {selectedReg.participationType || "Individual"}</p>
                  {selectedReg.teamName && <p><strong className="text-slate-500">Team Name:</strong> {selectedReg.teamName}</p>}
                  {selectedReg.teamMembers && <p><strong className="text-slate-500">Team Members:</strong> {selectedReg.teamMembers}</p>}
                  <p><strong className="text-slate-500">Reason:</strong> {selectedReg.reason}</p>
                </div>
              </div>

              {/* Section 4: Emergency Contact & Logistics */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Emergency Contact & Logistics</h4>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <p><strong className="text-slate-500">Emergency Contact:</strong> {selectedReg.emergencyContactName || "N/A"} ({selectedReg.emergencyContactRelation || "N/A"})</p>
                  <p><strong className="text-slate-500">Emergency Phone:</strong> {selectedReg.emergencyContactPhone || "N/A"}</p>
                  <p><strong className="text-slate-500">Dietary Preference:</strong> {selectedReg.dietaryPreference || "N/A"}</p>
                  <p><strong className="text-slate-500">T-Shirt Size:</strong> {selectedReg.tshirtSize || "N/A"}</p>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedReg(null)}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}