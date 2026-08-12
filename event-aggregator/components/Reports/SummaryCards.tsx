type Props = {
  totalUsers: number;
  totalEvents: number;
  totalRegistrations: number;
  totalCategories: number;
};

export default function SummaryCards({
  totalUsers,
  totalEvents,
  totalRegistrations,
  totalCategories,
}: Props) {
  const cards = [
    {
      title: "Total Users",
      value: totalUsers,
      icon: "👨‍🎓",
      color: "from-blue-600 to-blue-800",
    },
    {
      title: "Total Events",
      value: totalEvents,
      icon: "🎯",
      color: "from-green-600 to-green-800",
    },
    {
      title: "Registrations",
      value: totalRegistrations,
      icon: "📝",
      color: "from-purple-600 to-purple-800",
    },
    {
      title: "Categories",
      value: totalCategories,
      icon: "📂",
      color: "from-orange-500 to-red-600",
    },
  ];

  return (
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-gradient-to-r ${card.color} rounded-2xl shadow-md p-5 text-white`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs font-semibold opacity-90 uppercase tracking-wider">
                {card.title}
              </p>

              <h2 className="text-2xl font-extrabold mt-2">
                {card.value}
              </h2>
            </div>

            <div className="text-3xl">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}