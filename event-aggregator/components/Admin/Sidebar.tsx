"use client";

import { useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

type SidebarProps = {
  onClose?: () => void;
};

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status");

  const isEventsActive = pathname.startsWith("/admin/events");
  const isCertificatesActive = pathname.startsWith("/admin/certificates");

  const [eventsOpen, setEventsOpen] = useState(isEventsActive);
  const [certificatesOpen, setCertificatesOpen] = useState(isCertificatesActive);

  const renderLink = (href: string, title: string, icon: React.ReactNode, hasChevron = true) => {
    const active = pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"));
    return (
      <Link
        href={href}
        onClick={onClose}
        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl transition text-xs font-semibold cursor-pointer ${
          active
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/15"
            : "text-slate-400 hover:bg-slate-800/30 hover:text-white"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className={`w-4 h-4 flex items-center justify-center ${active ? "text-white" : "text-slate-500"}`}>
            {icon}
          </span>
          <span>{title}</span>
        </div>
        {hasChevron && (
          <svg className={`w-3 h-3 ${active ? "text-white" : "text-slate-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        )}
      </Link>
    );
  };

  return (
    <aside className="w-72 h-screen sticky top-0 bg-[#0f172a] border-r border-slate-800 shadow-2xl flex flex-col z-30 overflow-y-auto">

      {/* Logo Section */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 className="text-xs font-bold text-white tracking-widest uppercase">
            Event Aggregator
          </h1>
          <p className="text-[9px] text-slate-500 font-extrabold tracking-widest uppercase mt-0.5">
            Admin Panel
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-4">

        {/* Dashboard Link */}
        <div className="space-y-1">
          {renderLink("/admin", "Dashboard", (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          ), false)}
        </div>

        {/* Event Management */}
        <div className="space-y-1">
          <div className="px-3.5 pb-1 text-[9px] font-bold text-slate-500 tracking-widest uppercase">
            Event Management
          </div>

          {/* Expandable Events Accordion */}
          <div className="flex flex-col">
            <button
              onClick={() => setEventsOpen(!eventsOpen)}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition text-xs font-semibold cursor-pointer ${
                isEventsActive
                  ? "bg-slate-800/40 text-white"
                  : "text-slate-400 hover:bg-slate-800/30 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-4 h-4 flex items-center justify-center ${isEventsActive ? "text-blue-500" : "text-slate-500"}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
                <span>Events</span>
              </div>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${eventsOpen ? "rotate-90 text-white" : "text-slate-600"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {eventsOpen && (
              <div className="mt-1 ml-4 pl-3.5 border-l border-slate-800 flex flex-col gap-1 py-1">
                <Link
                  href="/admin/events"
                  onClick={onClose}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                    pathname === "/admin/events" && !currentStatus
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/20"
                  }`}
                >
                  All Events
                </Link>
                <Link
                  href="/admin/events/add"
                  onClick={onClose}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                    pathname === "/admin/events/add"
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/20"
                  }`}
                >
                  Add Event
                </Link>
              </div>
            )}
          </div>

          {renderLink("/admin/registrations", "Registrations", (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          ))}
        </div>

        {/* User Management */}
        <div className="space-y-1">
          <div className="px-3.5 pb-1 text-[9px] font-bold text-slate-500 tracking-widest uppercase">
            User Management
          </div>
          {renderLink("/admin/users", "Users", (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ))}
        </div>

        {/* Certificates Accordion */}
        <div className="space-y-1">
          <div className="px-3.5 pb-1 text-[9px] font-bold text-slate-500 tracking-widest uppercase">
            Certificates
          </div>

          <div className="flex flex-col">
            <button
              onClick={() => setCertificatesOpen(!certificatesOpen)}
              className={`flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl transition text-xs font-semibold cursor-pointer ${
                isCertificatesActive
                  ? "bg-slate-800/40 text-white"
                  : "text-slate-400 hover:bg-slate-800/30 hover:text-white"
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-4 h-4 flex items-center justify-center ${isCertificatesActive ? "text-blue-500" : "text-slate-500"}`}>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                  </svg>
                </span>
                <span>Certificates</span>
              </div>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${certificatesOpen ? "rotate-90 text-white" : "text-slate-600"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {certificatesOpen && (
              <div className="mt-1 ml-4 pl-3.5 border-l border-slate-800 flex flex-col gap-1 py-1">
                <Link
                  href="/admin/certificates?status=issued"
                  onClick={onClose}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                    pathname === "/admin/certificates" && currentStatus === "issued"
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/20"
                  }`}
                >
                  Issued
                </Link>
                <Link
                  href="/admin/certificates?status=pending"
                  onClick={onClose}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                    pathname === "/admin/certificates" && currentStatus === "pending"
                      ? "text-blue-400 bg-blue-500/10"
                      : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/20"
                  }`}
                >
                  Pending
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Insights */}
        <div className="space-y-1">
          <div className="px-3.5 pb-1 text-[9px] font-bold text-slate-500 tracking-widest uppercase">
            Insights
          </div>
          {renderLink("/admin/reports", "Reports", (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
            </svg>
          ))}
        </div>

        {/* Settings */}
        <div className="space-y-1">
          <div className="px-3.5 pb-1 text-[9px] font-bold text-slate-500 tracking-widest uppercase">
            Settings
          </div>
          {renderLink("/admin/settings", "Settings", (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ))}
        </div>

      </nav>

      {/* Footer & Logout */}
      <div className="border-t border-slate-800 p-4">
        {/* Logout */}
        <Link
          href="/logout"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition cursor-pointer"
        >
          <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Logout</span>
        </Link>
      </div>

    </aside>
  );
}