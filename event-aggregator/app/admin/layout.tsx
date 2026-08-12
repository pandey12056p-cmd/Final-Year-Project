"use client";

import { useState } from "react";
import Sidebar from "@/components/Admin/Sidebar";
import Navbar from "@/components/Admin/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <div className="flex flex-1">

        {/* Desktop Sidebar (visible only on desktop) */}

        <div className="hidden lg:block">

          <Sidebar />

        </div>

        {/* Mobile / Tablet Drawer Sidebar Overlay */}

        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Blurred Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsMobileOpen(false)}
            />

            {/* Sidebar drawer container */}
            <div className="relative flex w-72 max-w-xs flex-1 flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out">
              {/* Close Button inside Sidebar */}
              <div className="absolute right-4 top-4 z-50">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 bg-white shadow-sm border border-slate-200 cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <Sidebar onClose={() => setIsMobileOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Panel Content */}

        <div className="flex-1 min-w-0">

          <div className="p-4 md:p-6">

            <Navbar onMenuClick={() => setIsMobileOpen(true)} />

            <div className="mt-6">

              {children}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}