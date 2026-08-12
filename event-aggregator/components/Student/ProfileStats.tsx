import Link from "next/link";

type Props = {
  registrations: number;
  certificates: number;
  pendingCertificates: number;
  upcoming: number;
};

export default function ProfileStats({
  registrations,
  certificates,
  pendingCertificates,
  upcoming,
}: Props) {
  const stats = [
    {
      title: "Registered Events",
      value: registrations,
      description: "Confirmed registrations",
      badge: "Active",
      gradient: "from-blue-600 to-indigo-600",
      bgLight: "bg-blue-50/70 border-blue-100 text-blue-900",
      icon: "📝",
      href: "#registrations",
    },
    {
      title: "Issued Certificates",
      value: certificates,
      description: "Ready for download & verification",
      badge: certificates > 0 ? "Issued" : "None Yet",
      gradient: "from-emerald-600 to-teal-600",
      bgLight: "bg-emerald-50/70 border-emerald-100 text-emerald-900",
      icon: "🏆",
      href: "/dashboard/certificates",
    },
    {
      title: "Pending Certificates",
      value: pendingCertificates,
      description: "Awaiting admin approval",
      badge: "In Review",
      gradient: "from-amber-600 to-orange-600",
      bgLight: "bg-amber-50/70 border-amber-100 text-amber-900",
      icon: "⌛",
      href: "#registrations",
    },
    {
      title: "Upcoming Events",
      value: upcoming,
      description: "Live on platform",
      badge: "Explore",
      gradient: "from-purple-600 to-indigo-600",
      bgLight: "bg-purple-50/70 border-purple-100 text-purple-900",
      icon: "🎯",
      href: "/events",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((item) => (
        <Link
          key={item.title}
          href={item.href}
          className="group relative bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 hover:shadow-lg hover:-translate-y-0.5 transition duration-200 flex flex-col justify-between overflow-hidden"
        >
          {/* Accent Top Line */}
          <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.gradient}`} />

          <div className="flex items-start justify-between gap-2">
            <div className="space-y-1">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${item.bgLight}`}>
                {item.badge}
              </span>
              <p className="text-slate-700 font-bold text-xs sm:text-sm pt-1.5">
                {item.title}
              </p>
            </div>

            <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${item.gradient} text-white text-lg font-bold flex items-center justify-center shadow-sm group-hover:scale-105 transition duration-200 shrink-0`}>
              {item.icon}
            </div>
          </div>

          <div className="mt-3 flex items-baseline justify-between">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {item.value}
            </h2>
            <span className="text-[11px] font-bold text-blue-600 group-hover:underline flex items-center gap-1">
              View →
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}