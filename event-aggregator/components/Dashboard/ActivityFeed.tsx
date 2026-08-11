type Activity = {
  id: number;
  title: string;
  description: string;
  time: string;
  type: "user" | "event" | "registration" | "delete";
};

type Props = {
  activities: Activity[];
};

function getIcon(type: Activity["type"]) {
  switch (type) {
    case "user":
      return "👤";
    case "event":
      return "🎯";
    case "registration":
      return "✅";
    case "delete":
      return "🗑";
    default:
      return "📌";
  }
}

function getColor(type: Activity["type"]) {
  switch (type) {
    case "user":
      return "bg-blue-500";
    case "event":
      return "bg-green-500";
    case "registration":
      return "bg-purple-500";
    case "delete":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
}

export default function ActivityFeed({
  activities,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-violet-700 to-purple-700 px-8 py-6">

        <h2 className="text-3xl font-bold text-white">
          Recent Activities
        </h2>

        <p className="text-purple-100 mt-2">
          Latest actions performed in the system
        </p>

      </div>

      {/* Timeline */}

      <div className="p-8">

        {activities.length === 0 ? (

          <div className="text-center py-12 text-gray-500">
            No recent activity.
          </div>

        ) : (

          <div className="space-y-6">

            {activities.map((activity) => (

              <div
                key={activity.id}
                className="flex gap-5 items-start"
              >

                {/* Icon */}

                <div
                  className={`w-14 h-14 rounded-full ${getColor(
                    activity.type
                  )} flex items-center justify-center text-2xl text-white shadow-lg`}
                >
                  {getIcon(activity.type)}
                </div>

                {/* Content */}

                <div className="flex-1 border-b pb-5">

                  <h3 className="text-lg font-bold text-slate-800">
                    {activity.title}
                  </h3>

                  <p className="text-gray-600 mt-1">
                    {activity.description}
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    {activity.time}
                  </p>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}