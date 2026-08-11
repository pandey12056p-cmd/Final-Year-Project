import { prisma } from "@/lib/prisma";
import Link from "next/link";
import IssueCertificateButton from "@/components/Certificates/IssueCertificateButton";

export default async function AdminCertificatesPage() {
  const registrations = await prisma.registration.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800">
            Certificate Management
          </h1>

          <p className="text-gray-500 mt-2">
            Issue and manage student certificates.
          </p>
        </div>

        <Link
          href="/admin"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-700 text-white">
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Event</th>
              <th className="p-4 text-left">Email</th>
              <th className="p-4 text-center">Status</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {registrations.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-gray-500"
                >
                  No registrations found.
                </td>
              </tr>
            ) : (
              registrations.map((registration) => (
                <tr
                  key={registration.id}
                  className="border-b hover:bg-slate-50"
                >
                  <td className="p-4 font-semibold">
                    {registration.fullName}
                  </td>

                  <td className="p-4">
                    {registration.eventTitle}
                  </td>

                  <td className="p-4">
                    {registration.email}
                  </td>

                  <td className="p-4 text-center">
                    {registration.certificateIssued ? (
                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Issued
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-semibold">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="p-4 text-center">
                    {registration.certificateIssued ? (
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/certificate/${registration.id}`}
                          target="_blank"
                          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded-lg"
                        >
                          👁 View
                        </Link>

                        <Link
                          href={`/certificate/${registration.id}`}
                          target="_blank"
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                        >
                          📄 Download
                        </Link>

                        <button
                          disabled
                          className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg"
                        >
                          Issued
                        </button>
                      </div>
                    ) : (
                      <IssueCertificateButton
                        registrationId={registration.id}
                      />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}