type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: string;
  description: string;
};

export default function DashboardCard({
  title,
  value,
  icon,
  description,
}: DashboardCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-slate-200">

      {/* Gradient Top Border */}
      <div className="h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

      <div className="p-7">

        <div className="flex justify-between items-center">

          <div>

            <p className="text-gray-500 font-medium text-lg">
              {title}
            </p>

            <h2 className="mt-3 text-5xl font-extrabold text-slate-800">
              {value}
            </h2>

          </div>

          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-5xl group-hover:scale-110 transition">
            {icon}
          </div>

        </div>

        <div className="mt-6 border-t pt-4">

          <p className="text-gray-500">
            {description}
          </p>

        </div>

      </div>

    </div>
  );
}