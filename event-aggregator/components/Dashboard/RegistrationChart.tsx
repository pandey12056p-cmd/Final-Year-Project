type ChartData = {
  name: string;
  registrations: number;
};

type Props = {
  data: ChartData[];
};

export default function RegistrationChart({
  data,
}: Props) {
  const maxValue =
    data.length > 0
      ? Math.max(...data.map((item) => item.registrations))
      : 1;

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">

      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-8 py-6">

        <h2 className="text-3xl font-bold text-white">
          Registration Analytics
        </h2>

        <p className="text-blue-100 mt-2">
          Event Wise Registration Report
        </p>

      </div>

      {/* Body */}

      <div className="p-8 space-y-8">

        {data.length === 0 ? (

          <div className="text-center text-gray-500 py-12">
            No analytics available.
          </div>

        ) : (

          data.map((item) => {

            const percentage =
              (item.registrations / maxValue) * 100;

            return (

              <div key={item.name}>

                <div className="flex justify-between mb-2">

                  <span className="font-semibold text-slate-700">
                    {item.name}
                  </span>

                  <span className="font-bold text-blue-700">
                    {item.registrations}
                  </span>

                </div>

                <div className="w-full h-5 bg-slate-200 rounded-full overflow-hidden">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 transition-all duration-1000"
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
  );
}