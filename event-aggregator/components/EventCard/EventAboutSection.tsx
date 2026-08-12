"use client";

import { useState } from "react";

export default function EventAboutSection({ description }: { description: string }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = description.length > 250;

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
        <span>📖</span> About This Event
      </h2>

      <p className={`text-slate-700 text-sm leading-relaxed ${!expanded && isLong ? "line-clamp-4" : ""}`}>
        {description}
      </p>

      {isLong && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1 pt-1"
        >
          <span>{expanded ? "Read Less ▲" : "Read More ▼"}</span>
        </button>
      )}
    </div>
  );
}
