"use client";

import { useState } from "react";
import StudentSidebar from "@/components/Student/StudentSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">

      {/* Desktop Permanent Sidebar */}
      <div className="hidden md:block shrink-0">
        <StudentSidebar />
      </div>

      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-[#0b132b] text-white p-4 flex items-center justify-between border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-base">
            🎓
          </div>
          <span className="font-extrabold text-sm tracking-tight">Event Aggregator</span>
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="bg-slate-800 p-2 rounded-xl text-slate-200 text-sm font-bold border border-slate-700"
        >
          {mobileOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      {/* Mobile Sidebar Overlay Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex">
          <div className="w-64 max-w-[80%] h-full">
            <StudentSidebar />
          </div>
          <div className="flex-1 h-full" onClick={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Dashboard Content Area */}
      <div className="flex-1 overflow-x-hidden">
        {children}
      </div>

    </div>
  );
}