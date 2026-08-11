import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteButton from "@/components/Dashboard/DeleteButton";

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
        <h1 className="text-6xl font-bold text-blue-700">
          Manage Events
        </h1>

        <Link
          href="/admin/events/add"
          className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-4 rounded-xl font-semibold"
        >
          + Add Event
        </Link>
      </div>

      {/* Table */}

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

        <table className="w-full">

          <thead className="bg-blue-700 text-white">
            <tr>

              <th className="p-4 text-left">Title</th>

              <th className="p-4 text-left">Date</th>

              <th className="p-4 text-left">Location</th>

              <th className="p-4 text-left">Prize</th>

              <th className="p-4 text-left">Team Size</th>

              <th className="p-4 text-center">Action</th>

            </tr>
          </thead>

          <tbody>

            {events.map((event) => (

              <tr
                key={event.id}
                className="border-b hover:bg-slate-50"
              >

                <td className="p-4">
                  {event.title}
                </td>

                <td className="p-4">
                  {new Date(event.date).toLocaleDateString("en-IN")}
                </td>

                <td className="p-4">
                  {event.location}
                </td>

                <td className="p-4">
                  {event.prize}
                </td>

                <td className="p-4">
                  {event.teamSize}
                </td>

                <td className="p-4">

                  <div className="flex justify-center gap-3">

                    <Link
                      href={`/admin/events/edit/${event.id}`}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                      Edit
                    </Link>

                    <DeleteButton id={event.id} />

                  </div>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </main>
  );
}