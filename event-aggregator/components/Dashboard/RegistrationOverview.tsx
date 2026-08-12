"use client";

import React from "react";

type DayCount = {
  label: string;
  value: number;
};

type Props = {
  data: DayCount[];
};

export default function RegistrationOverview({ data }: Props) {
  // SVG Dimensions
  const width = 500;
  const height = 180;
  const padding = 20;

  // Find max value to scale chart y-axis
  const maxVal = Math.max(...data.map((d) => d.value), 4) * 1.2;

  // Map coordinates
  const points = data.map((d, index) => {
    const x = padding + (index * (width - padding * 2)) / (data.length - 1);
    const y = height - padding - (d.value / maxVal) * (height - padding * 2);
    return { x, y, ...d };
  });

  // Generate SVG path for line
  const linePath = points.reduce((path, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${path} L ${p.x} ${p.y}`;
  }, "");

  // Generate SVG path for gradient fill
  const fillPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
    : "";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm h-full flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-800">
            Registration Overview
          </h2>
          <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
            Registrations trend over the last 7 days
          </p>
        </div>

        {/* Dropdown Selector */}
        <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg px-2.5 py-1 text-[11px] font-bold text-slate-600 bg-slate-50">
          <span>7 Days</span>
          <span className="text-[8px] text-slate-400">▼</span>
        </div>
      </div>

      {/* SVG Line Chart */}
      <div className="mt-4 w-full flex-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            {/* Gradient fill */}
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
            </linearGradient>
          </defs>

          {/* Grid Lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#f1f5f9" strokeWidth={1.5} />
          <line x1={padding} y1={(height - padding) / 2 + padding / 2} x2={width - padding} y2={(height - padding) / 2 + padding / 2} stroke="#f1f5f9" strokeWidth={1.5} strokeDasharray="4 4" />
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="#f1f5f9" strokeWidth={1.5} strokeDasharray="4 4" />

          {/* Gradient Area Fill */}
          {fillPath && <path d={fillPath} fill="url(#chartGradient)" />}

          {/* Blue Line Path */}
          {linePath && (
            <path
              d={linePath}
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Interactive dots */}
          {points.map((p, i) => (
            <g key={i} className="group/point">
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill="#ffffff"
                stroke="#3b82f6"
                strokeWidth={2.5}
                className="transition duration-150 group-hover/point:r-6 cursor-pointer"
              />
              {/* Tooltip on hover */}
              <text
                x={p.x}
                y={p.y - 10}
                textAnchor="middle"
                className="hidden group-hover/point:block text-[9px] font-extrabold fill-slate-800 bg-white"
              >
                {p.value}
              </text>
            </g>
          ))}

          {/* X Axis Labels */}
          {points.map((p, i) => (
            <text
              key={i}
              x={p.x}
              y={height - 2}
              textAnchor="middle"
              className="text-[9px] font-bold fill-slate-400"
            >
              {p.label}
            </text>
          ))}
        </svg>
      </div>

    </div>
  );
}
