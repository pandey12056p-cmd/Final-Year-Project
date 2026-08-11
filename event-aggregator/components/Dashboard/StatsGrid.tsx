type StatsGridProps = {
  totalRegistrations: number;
  upcomingEvents: number;
  certificates: number;
  role: string;
};

export default function StatsGrid({
  totalRegistrations,
  upcomingEvents,
  certificates,
  role,
}: StatsGridProps) {
  const stats = [
    {
      title: "Registered Events",
      value: totalRegistrations,
      icon: "📅",
    },
    {
      title: "Upcoming Events",
      value: upcomingEvents,
      icon: "🎉",
    },
    {
      title: "Certificates",
      value: certificates,
      icon: "🏆",
    },
    {
      title: "Profile",
      value: role,
      icon: "👤",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">{item.title}</p>
              <h2 className="text-3xl font-bold text-blue-700 mt-2 capitalize">
                {item.value}
              </h2>
            </div>

            <div className="text-4xl">{item.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
}