"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type NavItem = {
  href: string;
  icon: string;
  label: string;
  badge?: string | number;
  badgeColor?: string;
};

export default function StudentSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    fetch("/api/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (data.unreadCount) setUnreadNotifications(data.unreadCount);
      })
      .catch(() => {});
  }, [pathname]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("user");
      router.push("/login");
    } catch (e) {
      window.location.href = "/login";
    }
  }

  const MENU_GROUPS: { category: string; items: NavItem[] }[] = [
    {
      category: "MAIN MENU",
      items: [
        { href: "/dashboard", icon: "🏠", label: "Dashboard" },
        {
          href: "/dashboard/ai",
          icon: "🤖",
          label: "AI Advisor",
          badge: "AI PRO",
          badgeColor: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
        },
        { href: "/dashboard/roadmap", icon: "🧭", label: "Career Roadmap" },
        { href: "/dashboard/registrations", icon: "📋", label: "My Registrations" },
        { href: "/dashboard/saved", icon: "❤️", label: "Saved Events" },
        { href: "/dashboard/calendar", icon: "📅", label: "Event Calendar" },
        {
          href: "/dashboard/certificates",
          icon: "🏆",
          label: "My Certificates",
          badge: "VERIFIED",
          badgeColor: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
        },
      ],
    },
    {
      category: "SERVICES & UPDATES",
      items: [
        {
          href: "/dashboard/notifications",
          icon: "🔔",
          label: "Notifications",
          badge: unreadNotifications > 0 ? unreadNotifications : undefined,
          badgeColor: "bg-amber-500 text-slate-950 font-black",
        },
        { href: "/dashboard/achievements", icon: "🏅", label: "Achievements" },
        { href: "/dashboard/resume", icon: "📄", label: "Resume Profile" },
        { href: "/events", icon: "🎯", label: "Browse Events" },
      ],
    },
    {
      category: "ACCOUNT & SUPPORT",
      items: [
        { href: "/dashboard/profile", icon: "👤", label: "My Profile" },
        { href: "/dashboard/help", icon: "❓", label: "Help & FAQ" },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0b132b] text-slate-300 border-r border-slate-800/80 sticky top-0 h-screen flex flex-col justify-between shadow-2xl shrink-0 z-40 select-none">
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-gradient-to-b from-slate-900 to-[#0b132b]">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-xl shadow-md shadow-blue-500/20 border border-white/10 shrink-0">
              🎓
            </div>
            <div>
              <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">
                Event Aggregator
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Student Portal
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Group Sections */}
        <div className="p-3.5 space-y-4">
          {MENU_GROUPS.map((group) => (
            <div key={group.category} className="space-y-1">
              <h3 className="px-3 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                {group.category}
              </h3>

              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    item.href === "/dashboard"
                      ? pathname === "/dashboard"
                      : pathname === item.href || pathname.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/30"
                          : "text-slate-400 hover:text-white hover:bg-slate-900/90"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-emerald-400 rounded-r-full shadow-sm" />
                      )}

                      <div className="flex items-center gap-2.5">
                        <span className={`text-base transition-transform group-hover:scale-110 ${isActive ? "text-white" : "text-slate-400"}`}>
                          {item.icon}
                        </span>
                        <span className="tracking-wide">{item.label}</span>
                      </div>

                      {item.badge !== undefined && (
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full tracking-wider uppercase ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Logout */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950/60">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white bg-red-950/30 hover:bg-red-600 transition-all duration-200 border border-red-800/40 hover:border-red-600 shadow-xs group"
        >
          <span className="text-sm group-hover:rotate-12 transition-transform">🚪</span>
          <span>Sign Out Account</span>
        </button>
      </div>
    </aside>
  );
}
