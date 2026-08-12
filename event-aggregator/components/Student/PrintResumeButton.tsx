"use client";

export default function PrintResumeButton() {
  return (
    <button
      onClick={() => window.print()}
      className="bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition shadow flex items-center gap-2"
    >
      <span>🖨️</span> Print Resume / Save PDF
    </button>
  );
}
