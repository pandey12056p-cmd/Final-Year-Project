type PieData = {
  name: string;
  value: number;
};

type Props = {
  data: PieData[];
};

const colors = [
  "bg-blue-600",
  "bg-green-600",
  "bg-purple-600",
  "bg-orange-500",
  "bg-pink-600",
  "bg-cyan-600",
  "bg-red-600",
];

export default function CategoryPieChart({
  data,
}: Props) {
  const total =
    data.reduce((sum, item) => sum + item.value, 0) || 1;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-green-600 to-emerald-700 px-8 py-6">

        <h2 className="text-3xl font-bold text-white">
          Event Categories
        </h2>

        <p className="text-green-100 mt-2">
          Distribution of Events
        </p>

      </div>

      {/* Body */}

      <div className="p-8">

        {/* Circle */}

        <div className="flex justify-center">

          <div className="relative w-52 h-52 rounded-full bg-slate-100 flex items-center justify-center shadow-inner">

            <div className="absolute w-36 h-36 rounded-full bg-white shadow flex items-center justify-center">

              <div className="text-center">

                <p className="text-gray-500 text-sm">
                  Total
                </p>

                <h2 className="text-4xl font-bold text-slate-800">
                  {total}
                </h2>

              </div>

            </div>

          </div>

        </div>

        {/* Legend */}

        <div className="mt-10 space-y-5">

          {data.length === 0 ? (

            <p className="text-center text-gray-500">
              No category data available.
            </p>

          ) : (

            data.map((item, index) => {

              const percentage = Math.round(
                (item.value / total) * 100
              );

              return (

                <div
                  key={item.name}
                  className="space-y-2"
                >

                  <div className="flex justify-between">

                    <div className="flex items-center gap-3">

                      <div
                        className={`w-4 h-4 rounded-full ${
                          colors[index % colors.length]
                        }`}
                      />

                      <span className="font-semibold text-slate-700">
                        {item.name}
                      </span>

                    </div>

                    <span className="font-bold">
                      {percentage}%
                    </span>

                  </div>

                  <div className="w-full h-3 rounded-full bg-slate-200 overflow-hidden">

                    <div
                      className={`h-full rounded-full ${
                        colors[index % colors.length]
                      } transition-all duration-700`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>

              );
            })

          )}

        </div>

      </div>

    </div>
  );
}