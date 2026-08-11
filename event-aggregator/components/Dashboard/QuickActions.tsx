import Link from "next/link";

const actions = [
  {
    title: "Add Event",
    description: "Create a new event",
    icon: "➕",
    href: "/admin/events/add",
    color: "from-blue-600 to-blue-800",
  },
  {
    title: "Manage Events",
    description: "View all events",
    icon: "🎯",
    href: "/admin/events",
    color: "from-purple-600 to-purple-800",
  },
  {
    title: "Registrations",
    description: "View registrations",
    icon: "📝",
    href: "/admin/registrations",
    color: "from-green-600 to-green-800",
  },
  {
    title: "Users",
    description: "Manage students",
    icon: "👨‍🎓",
    href: "/admin/users",
    color: "from-orange-500 to-red-600",
  },
  {
    title: "Reports",
    description: "Analytics & reports",
    icon: "📊",
    href: "/admin/reports",
    color: "from-cyan-600 to-blue-700",
  },
  {
    title: "Settings",
    description: "Application settings",
    icon: "⚙️",
    href: "/admin/settings",
    color: "from-slate-600 to-slate-800",
  },
];

export default function QuickActions() {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-8 py-6">
        <h2 className="text-3xl font-bold text-white">
          Quick Actions
        </h2>

        <p className="text-blue-100 mt-2">
          Frequently used admin shortcuts
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-8">

        {actions.map((action) => (

          <Link
            key={action.title}
            href={action.href}
            className={`rounded-2xl bg-gradient-to-r ${action.color} text-white p-6 hover:scale-105 transition duration-300 shadow-lg`}
          >

            <div className="text-5xl mb-4">
              {action.icon}
            </div>

            <h3 className="text-2xl font-bold">
              {action.title}
            </h3>

            <p className="mt-2 text-white/90">
              {action.description}
            </p>

          </Link>

        ))}

      </div>

    </div>
  );
}