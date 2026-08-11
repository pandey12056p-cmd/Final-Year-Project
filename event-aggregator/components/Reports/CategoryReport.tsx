type Props = {
  categories: {
    name: string;
    value: number;
  }[];
};

export default function CategoryReport({
  categories,
}: Props) {
  const total =
    categories.reduce(
      (sum, item) => sum + item.value,
      0
    ) || 1;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-3xl font-bold text-blue-700 mb-8">
        Category Distribution
      </h2>

      <div className="space-y-6">

        {categories.map((category) => {

          const width =
            (category.value / total) * 100;

          return (

            <div key={category.name}>

              <div className="flex justify-between mb-2">

                <span className="font-semibold">
                  {category.name}
                </span>

                <span>
                  {category.value}
                </span>

              </div>

              <div className="bg-slate-200 rounded-full h-4">

                <div
                  className="bg-blue-700 rounded-full h-4"
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