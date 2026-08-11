type TopEvent = {
  eventTitle: string;
  count: number;
};

type TopEventsProps = {
  events: TopEvent[];
};

export default function TopEvents({ events }: TopEventsProps) {
  const maxCount =
    events.length > 0
      ? Math.max(...events.map((e) => e.count))
      : 1;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-6">

        <h2 className="text-3xl font-bold text-white">
          Top Popular Events
        </h2>

        <p className="text-green-100 mt-2">
          Most registered events
        </p>

      </div>

      <div className="p-6 space-y-6">

        {events.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No event registrations yet.
          </div>
        ) : (
          events.map((event, index) => {
            const percentage =
              (event.count / maxCount) * 100;

            const medal =
              index === 0
                ? "🥇"
                : index === 1
                ? "🥈"
                : index === 2
                ? "🥉"
                : "🏅";

            return (
              <div
                key={event.eventTitle}
                className="rounded-2xl border border-slate-200 p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between items-center">

                  <div className="flex items-center gap-4">

                    <div className="text-3xl">
                      {medal}
                    </div>

                    <div>

                      <h3 className="font-bold text-lg text-slate-800">
                        {event.eventTitle}
                      </h3>

                      <p className="text-gray-500 text-sm">
                        Rank #{index + 1}
                      </p>

                    </div>

                  </div>

                  <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold">
                    {event.count}
                  </div>

                </div>

                {/* Progress */}

                <div className="mt-4">

                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">

                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-700"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>

              </div>
            );
          })
        )}

      </div>

    </div>
  );
}