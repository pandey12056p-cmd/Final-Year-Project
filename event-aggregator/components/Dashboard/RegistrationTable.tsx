"use client";

import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/date";

type Registration = {
  id: number;
  eventTitle: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  branch: string;
  year: string;
  createdAt: Date | string;

  certificateIssued: boolean;
  certificateId: string | null;
};

type RegistrationTableProps = {
  registrations: Registration[];
};

export default function RegistrationTable({
  registrations,
}: RegistrationTableProps) {
  const router = useRouter();

  async function issueCertificate(registrationId: number) {
    try {
      const res = await fetch("/api/certificate/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationId,
        }),
      });

      const data = await res.json();

      alert(data.message);

      if (data.success) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}

      <div className="flex justify-between items-center px-8 py-6 border-b bg-gradient-to-r from-blue-700 to-indigo-700">
        <div>
          <h2 className="text-3xl font-bold text-white">
            Recent Registrations
          </h2>

          <p className="text-blue-100 mt-1">
            Latest students registered for events
          </p>
        </div>

        <div className="bg-white/20 text-white px-5 py-2 rounded-full font-semibold">
          {registrations.length} Records
        </div>
      </div>

      {/* Table */}

      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-slate-100">
            <tr className="text-left">
              <th className="px-6 py-4 font-bold">#</th>

              <th className="px-6 py-4 font-bold">
                Student
              </th>

              <th className="px-6 py-4 font-bold">
                Contact
              </th>

              <th className="px-6 py-4 font-bold">
                College
              </th>

              <th className="px-6 py-4 font-bold">
                Event
              </th>

              <th className="px-6 py-4 font-bold">
                Year
              </th>

              <th className="px-6 py-4 font-bold">
                Date
              </th>

              <th className="px-6 py-4 font-bold text-center">
                Certificate
              </th>

              <th className="px-6 py-4 font-bold text-center">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="text-center py-12 text-gray-500"
                >
                  No registrations found.
                </td>
              </tr>
            ) : (
              registrations.map((registration, index) => (
                <tr
                  key={registration.id}
                  className="border-b hover:bg-blue-50 transition"
                >
                  <td className="px-6 py-5 font-semibold">
                    {index + 1}
                  </td>

                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-slate-800">
                        {registration.fullName}
                      </p>

                      <p className="text-sm text-gray-500">
                        {registration.branch}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <p>{registration.email}</p>

                    <p className="text-sm text-gray-500">
                      {registration.phone}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    {registration.college}
                  </td>

                  <td className="px-6 py-5">
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      {registration.eventTitle}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    {registration.year}
                  </td>

                  <td className="px-6 py-5">
                    {formatDate(registration.createdAt)}
                  </td>

                  {/* Certificate */}

                  <td className="px-6 py-5 text-center">
                    {registration.certificateIssued ? (
                      <span className="text-green-700 font-semibold">
                        ✅ Issued
                      </span>
                    ) : (
                      <button
                        onClick={() =>
                          issueCertificate(registration.id)
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                      >
                        Issue
                      </button>
                    )}
                  </td>

                  {/* Delete */}

                  <td className="px-6 py-5 text-center">
                    <DeleteButton id={registration.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}