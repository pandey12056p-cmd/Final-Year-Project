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
    <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-6">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`bg-gradient-to-r ${card.color} rounded-3xl shadow-xl p-8 text-white`}
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-lg opacity-90">
                {card.title}
              </p>

              <h2 className="text-5xl font-bold mt-3">
                {card.value}
              </h2>
            </div>

            <div className="text-6xl">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}