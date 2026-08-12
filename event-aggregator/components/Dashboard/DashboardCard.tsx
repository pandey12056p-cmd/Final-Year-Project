import React from "react";

type DashboardCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend: string;
  iconBg: string;
};

export default function DashboardCard({
  title,
  value,
  icon,
  trend,
  iconBg,
}: DashboardCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all duration-200">
      
      <div className="flex items-center justify-between">
        {/* Icon */}
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shadow-sm ${iconBg}`}>
          {icon}
        </div>
        
        {/* Labels */}
        <div className="text-right">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            {title}
          </p>
          <h3 className="text-2xl font-extrabold text-slate-800 mt-1">
            {value}
          </h3>
        </div>
      </div>

      {/* Trend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] text-emerald-600 font-bold">
        <span>{trend}</span>
      </div>

    </div>
  );
}