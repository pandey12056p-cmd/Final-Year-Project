type Props = {
  data: {
    month: string;
    count: number;
  }[];
};

export default function MonthlyRegistrations({
  data,
}: Props) {
  const max =
    Math.max(...data.map((item) => item.count), 1);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-3xl font-bold text-blue-700 mb-8">
        Monthly Registrations
      </h2>

      <div className="space-y-6">

        {data.map((item) => {

          const width =
            (item.count / max) * 100;

          return (

            <div key={item.month}>

              <div className="flex justify-between mb-2">

                <span className="font-semibold">
                  {item.month}
                </span>

                <span className="font-bold">
                  {item.count}
                </span>

              </div>

              <div className="bg-slate-200 rounded-full h-5">

                <div
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 h-5 rounded-full transition-all duration-500"
                  style={{
                    width: `${width}%`,
                  }}
                />

              </div>

            </div>

          );

        })}

      </div>

    </div>
  );
}