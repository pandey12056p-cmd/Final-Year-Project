"use client";

type Props = {
  data: {
    month: string;
    count: number;
  }[];
};

const BAR_COLORS = [
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
  "#ec4899", "#f97316", "#10b981", "#06b6d4",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7",
];

export default function MonthlyRegistrations({ data }: Props) {
  const max = Math.max(...data.map((d) => d.count), 1);
  const chartHeight = 160;
  const barWidth = 28;
  const gap = 8;
  const totalWidth = data.length * (barWidth + gap);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-1">
        Monthly Registrations
      </h2>
      <p className="text-[10px] text-slate-400 font-medium mb-4">
        Number of registrations per month
      </p>

      <div className="overflow-x-auto">
        <svg
          width={totalWidth + 40}
          height={chartHeight + 40}
          className="overflow-visible"
        >
          {/* Y-axis guide lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = chartHeight - frac * chartHeight;
            const val = Math.round(frac * max);
            return (
              <g key={frac}>
                <line
                  x1={32}
                  x2={totalWidth + 32}
                  y1={y}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth={1}
                />
                <text
                  x={28}
                  y={y + 4}
                  textAnchor="end"
                  fontSize={9}
                  fill="#94a3b8"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, i) => {
            const barH = Math.max((item.count / max) * chartHeight, item.count > 0 ? 4 : 0);
            const x = 32 + i * (barWidth + gap);
            const y = chartHeight - barH;
            const color = BAR_COLORS[i % BAR_COLORS.length];

            return (
              <g key={item.month}>
                {/* Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barH}
                  rx={4}
                  fill={color}
                  opacity={0.85}
                  className="hover:opacity-100 transition-opacity duration-150"
                />

                {/* Value label on top */}
                {item.count > 0 && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 4}
                    textAnchor="middle"
                    fontSize={9}
                    fontWeight="bold"
                    fill={color}
                  >
                    {item.count}
                  </text>
                )}

                {/* Month label below */}
                <text
                  x={x + barWidth / 2}
                  y={chartHeight + 14}
                  textAnchor="middle"
                  fontSize={9}
                  fill="#64748b"
                  fontWeight="600"
                >
                  {item.month}
                </text>
              </g>
            );
          })}

          {/* X-axis line */}
          <line
            x1={32}
            x2={totalWidth + 32}
            y1={chartHeight}
            y2={chartHeight}
            stroke="#e2e8f0"
            strokeWidth={1}
          />
        </svg>
      </div>
    </div>
  );
}