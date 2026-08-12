import { prisma } from "@/lib/prisma";
import Link from "next/link";
import IssueCertificateButton from "@/components/Certificates/IssueCertificateButton";

export default async function AdminCertificatesPage(props: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await props.searchParams;

  const whereClause =
    status === "issued"
      ? { certificateIssued: true }
      : status === "pending"
      ? { certificateIssued: false }
      : {};

  const registrations = await prisma.registration.findMany({
    where: whereClause,
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Certificate Management
            {status === "issued" && <span className="text-emerald-600 ml-2"> (Issued)</span>}
            {status === "pending" && <span className="text-rose-600 ml-2"> (Pending)</span>}
          </h1>

          <p className="text-slate-500 mt-0.5 text-xs font-semibold">
            {status === "issued"
              ? "Showing issued certificates only."
              : status === "pending"
              ? "Showing pending certificate requests."
              : "Issue and manage student certificates."}
          </p>
        </div>

        <Link
          href="/admin"
          className="border border-slate-200 hover:bg-slate-50 bg-white transition text-xs font-bold text-slate-700 rounded-lg px-3 py-1.5 shadow-sm"
        >
          ← Dashboard
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50/75 border-b border-slate-200">
            <tr>
              <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Student</th>
              <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Event</th>
              <th className="px-5 py-3.5 text-left text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Email</th>
              <th className="px-5 py-3.5 text-center text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Status</th>
              <th className="px-5 py-3.5 text-center text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {registrations.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-10 text-xs text-slate-400"
                >
                  No registrations found.
                </td>
              </tr>
            ) : (
              registrations.map((registration) => (
                <tr
                  key={registration.id}
                  className="hover:bg-slate-50/50 transition"
                >
                  <td className="px-5 py-3 text-xs font-bold text-slate-800">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shadow-sm">
                        {registration.fullName.slice(0, 2).toUpperCase()}
                      </div>
                      <span>{registration.fullName}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3 text-xs font-bold text-slate-700">
                    {registration.eventTitle}
                  </td>

                  <td className="px-5 py-3 text-xs font-semibold text-slate-500">
                    {registration.email}
                  </td>

                  <td className="px-5 py-3 text-center">
                    {registration.certificateIssued ? (
                      <span className="bg-green-50 text-green-600 border border-green-100 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                        Issued
                      </span>
                    ) : (
                      <span className="bg-rose-50 text-rose-600 border border-rose-100 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider">
                        Pending
                      </span>
                    )}
                  </td>

                  <td className="px-5 py-3">
                    {registration.certificateIssued ? (
                      <div className="flex justify-center gap-2">
                        <Link
                          href={`/certificate/${registration.id}`}
                          target="_blank"
                          className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
                        >
                          View
                        </Link>

                        <Link
                          href={`/certificate/${registration.id}`}
                          target="_blank"
                          className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
                        >
                          Download
                        </Link>

                        <span className="bg-slate-100 text-slate-400 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-not-allowed">
                          Issued
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <IssueCertificateButton
                          registrationId={registration.id}
                        />
                      </div>
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