"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

type Props = {
  children: React.ReactNode;
  college: {
    id: number;
    name: string;
    code: string;
    logo: string | null;
    status: string;
    rejectReason: string | null;
    officialEmail: string;
  };
  user: {
    id: number;
    email: string;
    role: string;
  };
};

export default function CollegeLayoutClient({ children, college, user }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const menuItems = [
    { href: "/college", label: "Dashboard", icon: "🏠" },
    { href: "/college/events", label: "Events", icon: "📅" },
    { href: "/college/events/add", label: "Add Event", icon: "➕" },
    { href: "/college/registrations", label: "Registrations", icon: "📋" },
    { href: "/college/analytics", label: "Analytics", icon: "📈" },
    { href: "/college/notifications", label: "Notifications", icon: "🔔" },
    { href: "/college/profile", label: "College Profile", icon: "🏢" },
    { href: "/college/settings", label: "Settings", icon: "⚙️" },
  ];

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      router.push("/login");
    } catch (e) {
      window.location.href = "/login";
    }
  }

  // Sidebar link component helper
  const renderLink = (href: string, label: string, icon: string) => {
    const active = pathname === href || (href !== "/college" && pathname.startsWith(href));
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setIsMobileOpen(false)}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition text-xs font-bold ${
          active
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/10"
            : "text-slate-400 hover:bg-slate-800/30 hover:text-white"
        }`}
      >
        <span className="text-sm shrink-0">{icon}</span>
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      
      {/* 1. Status Alert Banners */}
      {college.status === "PENDING_VERIFICATION" && (
        <div className="bg-amber-500 text-slate-950 font-bold px-4 py-2 text-center text-xs tracking-wide shadow-sm flex items-center justify-center gap-2">
          <span>⏳</span>
          <span>Your college profile is pending verification. You can save events as drafts, but cannot publish or submit events for approval.</span>
        </div>
      )}
      {college.status === "REJECTED" && (
        <div className="bg-rose-600 text-white font-bold px-4 py-2.5 text-center text-xs tracking-wide shadow-sm flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3">
          <div className="flex items-center gap-2">
            <span>❌</span>
            <span>Your college verification was REJECTED.</span>
          </div>
          {college.rejectReason && (
            <span className="bg-rose-800/40 px-2 py-0.5 rounded text-[11px] font-semibold border border-rose-500/20">
              Reason: {college.rejectReason}
            </span>
          )}
          <Link href="/college/profile" className="underline text-[11px] hover:text-rose-100 font-extrabold uppercase tracking-wider mt-1 sm:mt-0">
            Edit Profile & Resubmit →
          </Link>
        </div>
      )}
      {college.status === "SUSPENDED" && (
        <div className="bg-slate-900 text-rose-400 font-bold px-4 py-3 text-center text-xs tracking-wide shadow-sm flex items-center justify-center gap-2 border-b border-rose-950">
          <span>🛑</span>
          <span>Your account is SUSPENDED. All your events have been hidden. Please contact the administrator.</span>
        </div>
      )}

      <div className="flex flex-1 relative">
        
        {/* 2. Desktop Sidebar */}
        <aside className="w-72 hidden lg:flex flex-col sticky top-0 h-[calc(100vh-40px)] bg-[#0f172a] border-r border-slate-800 shadow-xl text-slate-300 overflow-y-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              {college.logo ? (
                <img src={college.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
              ) : (
                <span className="text-lg">🏢</span>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-xs font-black text-white tracking-wider uppercase truncate">
                {college.name}
              </h1>
              <p className="text-[9px] text-slate-500 font-black tracking-widest uppercase mt-0.5">
                Code: {college.code}
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {menuItems.map((item) => renderLink(item.href, item.label, item.icon))}
          </nav>

          {/* Logout Section */}
          <div className="border-t border-slate-800 p-4 shrink-0">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-white cursor-pointer"
            >
              <span className="text-sm">🚪</span>
              <span>Sign Out Panel</span>
            </button>
          </div>
        </aside>

        {/* 3. Mobile Sidebar Overlay Drawer */}
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsMobileOpen(false)}
            />
            {/* Drawer Container */}
            <div className="relative flex w-72 max-w-xs flex-1 flex-col bg-[#0f172a] shadow-2xl transition-transform duration-300 ease-in-out">
              <div className="absolute right-4 top-4 z-50">
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-850 text-slate-400 border border-slate-700 bg-[#0f172a] cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Logo Section */}
              <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800 shrink-0">
                <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                  {college.logo ? (
                    <img src={college.logo} alt="Logo" className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <span className="text-lg">🏢</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h1 className="text-xs font-black text-white tracking-wider uppercase truncate">
                    {college.name}
                  </h1>
                  <p className="text-[9px] text-slate-500 font-black tracking-widest uppercase mt-0.5">
                    {college.code}
                  </p>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 px-4 py-6 space-y-1">
                {menuItems.map((item) => renderLink(item.href, item.label, item.icon))}
              </nav>

              {/* Logout Section */}
              <div className="border-t border-slate-800 p-4 shrink-0">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-white cursor-pointer"
                >
                  <span className="text-sm">🚪</span>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Main content area */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Top Navbar */}
          <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-xs">
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-650 transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className="hidden lg:block text-slate-500 text-xs font-bold">
              Organizing Dashboard for <span className="text-slate-800 font-black">{college.name}</span>
            </div>

            {/* Profile Avatar */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <h3 className="text-xs font-black text-slate-800 leading-none">{college.name}</h3>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 inline-block">
                  {college.status} Profile
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold shadow-sm">
                {college.logo ? (
                  <img src={college.logo} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                ) : (
                  college.name.slice(0, 2).toUpperCase()
                )}
              </div>
            </div>
          </header>

          {/* Sub-page content */}
          <div className="p-6 flex-1 max-w-7xl w-full mx-auto">
            {children}
          </div>
        </div>

      </div>
    </div>
  );
}
