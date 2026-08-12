type Props = {
  events: {
    eventTitle: string;
    category: string;
    registrations: number;
  }[];
};

export default function EventReportTable({
  events,
}: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">

      <div className="px-5 py-4 border-b border-slate-200">

        <h2 className="text-sm font-bold text-slate-700">
          Event Performance
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-slate-700 text-white">

            <tr>

              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                Rank
              </th>

              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                Event
              </th>

              <th className="px-4 py-2.5 text-left text-xs font-bold uppercase tracking-wider">
                Category
              </th>

              <th className="px-4 py-2.5 text-center text-xs font-bold uppercase tracking-wider">
                Registrations
              </th>

            </tr>

          </thead>

          <tbody>

            {events.map((event, index) => (

              <tr
                key={event.eventTitle}
                className="border-b hover:bg-slate-50"
              >

                <td className="px-4 py-2.5 text-xs font-bold text-slate-500">
                  #{index + 1}
                </td>

                <td className="px-4 py-2.5 text-xs font-semibold text-slate-800">
                  {event.eventTitle}
                </td>

                <td className="px-4 py-2.5">
                  <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full text-[10px] font-bold">
                    {event.category}
                  </span>
                </td>

                <td className="px-4 py-2.5 text-center text-xs font-bold text-green-600">
                  {event.registrations}
                </td>

              </tr>

            ))}

            {events.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="text-center py-8 text-xs text-slate-400"
                >
                  No registrations found.
                </td>

              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}