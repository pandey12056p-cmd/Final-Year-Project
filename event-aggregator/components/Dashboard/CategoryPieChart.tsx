"use client";

import React from "react";

type PieData = {
  name: string;
  value: number;
};

type Props = {
  data: PieData[];
  title?: string;
  subtitle?: string;
};

const colors = [
  "#3b82f6", // Blue
  "#8b5cf6", // Purple
  "#f97316", // Orange
  "#10b981", // Green
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#ef4444", // Red
];

const tailwindTextColors = [
  "text-blue-500",
  "text-purple-500",
  "text-orange-500",
  "text-emerald-500",
  "text-pink-500",
  "text-cyan-500",
  "text-rose-500",
];

const tailwindBgColors = [
  "bg-blue-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-emerald-500",
  "bg-pink-500",
  "bg-cyan-500",
  "bg-rose-500",
];

export default function CategoryPieChart({ data, title = "Event Categories", subtitle = "Distribution of events by category" }: Props) {
  const total = data.reduce((sum, item) => sum + item.value, 0) || 1;

  // Calculate segment angles/stroke values for Donut
  let accumulatedPercent = 0;
  const segments = data.map((item, index) => {
    const percent = (item.value / total) * 100;
    const strokeDasharray = `${percent} ${100 - percent}`;
    const strokeDashoffset = 100 - accumulatedPercent + 25; // offset to start from top
    accumulatedPercent += percent;
    return {
      ...item,
      percent: Math.round(percent),
      strokeDasharray,
      strokeDashoffset,
      color: colors[index % colors.length],
      textColor: tailwindTextColors[index % tailwindTextColors.length],
      bgColor: tailwindBgColors[index % tailwindBgColors.length],
    };
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex flex-col justify-between">
      
      {/* Title */}
      <div>
        <h2 className="text-sm font-bold text-slate-800">
          {title}
        </h2>
        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
          {subtitle}
        </p>
      </div>

      {/* Chart Body */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mt-4">
        
        {/* SVG Donut Chart */}
        <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
            {/* Background Grey Circle */}
            <circle
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke="#f1f5f9"
              strokeWidth="3.8"
            />

            {/* Segment Circles */}
            {segments.map((seg, i) => (
              <circle
                key={i}
                cx="18"
                cy="18"
                r="15.915"
                fill="transparent"
                stroke={seg.color}
                strokeWidth="3.8"
                strokeDasharray={seg.strokeDasharray}
                strokeDashoffset={seg.strokeDashoffset}
                className="transition-all duration-500 ease-out"
              />
            ))}
          </svg>

          {/* Center Text */}
          <div className="absolute text-center">
            <h2 className="text-xl font-extrabold text-slate-800">
              {total === 1 && data.length === 0 ? 0 : total}
            </h2>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
              Total
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2 max-h-[160px] overflow-y-auto pr-1">
          {data.length === 0 ? (
            <p className="text-center text-xs text-slate-400 py-6">
              No categories available
            </p>
          ) : (
            segments.map((seg) => (
              <div key={seg.name} className="flex items-center justify-between text-xs py-0.5">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${seg.bgColor}`} />
                  <span className="font-semibold text-slate-700">{seg.name}</span>
                </div>
                <span className="font-bold text-slate-800">
                  {seg.value} <span className="text-[10px] text-slate-400 font-normal">({seg.percent}%)</span>
                </span>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
}