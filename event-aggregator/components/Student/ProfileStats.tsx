type Props = {
  registrations: number;
  certificates: number;
  upcoming: number;
};

export default function ProfileStats({
  registrations,
  certificates,
  upcoming,
}: Props) {
  const stats = [
    {
      title: "Registrations",
      value: registrations,
      color: "text-blue-700",
      icon: "📝",
    },
    {
      title: "Certificates",
      value: certificates,
      color: "text-green-600",
      icon: "🏆",
    },
    {
      title: "Upcoming",
      value: upcoming,
      color: "text-purple-600",
      icon: "📅",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((item) => (
        <div
          key={item.title}
          className="bg-white rounded-3xl shadow-lg p-6"
        >
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500">
                {item.title}
              </p>

              <h2 className={`text-4xl font-bold ${item.color}`}>
                {item.value}
              </h2>
            </div>

            <div className="text-5xl">
              {item.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}