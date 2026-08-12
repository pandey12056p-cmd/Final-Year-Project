import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/Dashboard/DeleteButton";
import { formatDate } from "@/lib/date";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      {/* Heading */}

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-blue-700">
          Manage Events
        </h1>

        <Link
          href="/admin/events/add"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-xl font-semibold transition"
        >
          + Add Event
        </Link>
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="p-4">Title</th>
                <th className="p-4">Date</th>
                <th className="p-4">Location</th>
                <th className="p-4">Prize</th>
                <th className="p-4">Team Size</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {events.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500">
                    No events found.
                  </td>
                </tr>
              ) : (
                events.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b hover:bg-slate-50 transition"
                  >
                    <td className="p-4 font-semibold text-slate-800">
                      {event.title}
                    </td>

                    <td className="p-4">
                      {formatDate(event.date)}
                    </td>

                    <td className="p-4">
                      {event.location}
                    </td>

                    <td className="p-4">
                      ₹{event.prize}
                    </td>

                    <td className="p-4">
                      {event.teamSize}
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex justify-center gap-3">
                        <Link
                          href={`/admin/events/edit/${event.id}`}
                          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-medium transition"
                        >
                          Edit
                        </Link>

                        <DeleteButton id={event.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}