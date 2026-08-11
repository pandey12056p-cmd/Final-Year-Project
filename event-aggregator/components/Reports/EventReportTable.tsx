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
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

      <div className="p-8 border-b">

        <h2 className="text-3xl font-bold text-blue-700">
          Event Performance
        </h2>

      </div>

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-blue-700 text-white">

            <tr>

              <th className="p-4 text-left">
                Rank
              </th>

              <th className="p-4 text-left">
                Event
              </th>

              <th className="p-4 text-left">
                Category
              </th>

              <th className="p-4 text-center">
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

                <td className="p-4 font-bold">
                  #{index + 1}
                </td>

                <td className="p-4 font-semibold">
                  {event.eventTitle}
                </td>

                <td className="p-4">
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">
                    {event.category}
                  </span>
                </td>

                <td className="p-4 text-center font-bold text-green-600">
                  {event.registrations}
                </td>

              </tr>

            ))}

            {events.length === 0 && (

              <tr>

                <td
                  colSpan={4}
                  className="text-center py-10 text-gray-500"
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