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
    <main className="min-h-screen bg-slate-100 p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Events
          </h1>
          <p className="text-slate-500 mt-0.5 text-xs font-medium">
            List and manage all college events
          </p>
        </div>

        <Link
          href="/admin/events/add"
          className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-semibold transition text-sm cursor-pointer shadow-sm"
        >
          + Add Event
        </Link>
      </div>


      {/* Table */}

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">

        <table className="w-full text-left border-collapse">

          <thead className="bg-slate-50/75 border-b border-slate-200">
            <tr>

              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Title</th>

              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Date</th>

              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Location</th>

              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Prize</th>

              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Team Size</th>

              <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold text-center">Action</th>

            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">

            {events.map((event) => (

              <tr
                key={event.id}
                className="hover:bg-slate-50/50 transition"
              >

                <td className="px-5 py-3 text-xs font-bold text-slate-800">
                  {event.title}
                </td>

                <td className="px-5 py-3 text-xs font-semibold text-slate-500">
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </td>

                <td className="px-5 py-3 text-xs font-semibold text-slate-600">
                  {event.location}
                </td>

                <td className="px-5 py-3 text-xs font-bold text-slate-700">
                  {event.prize === "0" || event.prize === "" ? "Free" : `₹${event.prize}`}
                </td>

                <td className="px-5 py-3 text-xs font-semibold text-slate-500">
                  {event.teamSize} Member(s)
                </td>

                <td className="px-5 py-3">

                  <div className="flex justify-center gap-2.5">

                    <Link
                      href={`/admin/events/edit/${event.id}`}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
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