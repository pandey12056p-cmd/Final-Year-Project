"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Read theme from localStorage or document element
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const currentTheme = savedTheme || (document.documentElement.getAttribute("data-theme") as "light" | "dark") || "light";
    setTheme(currentTheme);
    setMounted(true);
  }, []);

  function toggleTheme() {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  }

  function logout() {
    localStorage.removeItem("user");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  }

  const isHomeActive = pathname === "/";
  const isEventsActive = pathname === "/events";

  return (
    <nav className="bg-[#0b0f19] border-b border-slate-800/80 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3.5">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
            <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-lg font-bold tracking-wide bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
            Event Aggregator
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-[13px] font-semibold text-slate-300">
          <Link
            href="/"
            className={`hover:text-white transition-colors py-1 relative ${isHomeActive ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500" : ""
              }`}
          >
            Home
          </Link>
          <Link
            href="/events"
            className={`hover:text-white transition-colors py-1 relative ${isEventsActive ? "text-white after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500" : ""
              }`}
          >
            Explore Events
          </Link>
          <Link href="/#colleges" className="hover:text-white transition-colors py-1">
            Colleges
          </Link>
          <Link href="/#categories" className="hover:text-white transition-colors py-1">
            Categories
          </Link>
          <Link href="/#about" className="hover:text-white transition-colors py-1">
            About Us
          </Link>
        </div>

        {/* Auth Actions */}
        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-2 mr-1 rounded-lg hover:bg-slate-800/60 text-slate-300 hover:text-white transition duration-200 cursor-pointer theme-toggle"
              aria-label="Toggle Theme"
            >
              {theme === "light" ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-11.314l.707.707m11.314 11.314l.707-.707M12 7a5 5 0 100 10 5 5 0 000-10z" />
                </svg>
              )}
            </button>
          )}
          {!user ? (
            <>
              <Link
                href="/login"
                className="border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              {user.role === "admin" ? (
                <Link
                  href="/admin"
                  className="border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  Admin Panel
                </Link>
              ) : user.role === "college" ? (
                <Link
                  href="/college"
                  className="border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  College Panel
                </Link>
              ) : (
                <Link
                  href="/dashboard"
                  className="border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer"
                >
                  Dashboard
                </Link>
              )}
              <button
                onClick={logout}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                Logout
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
}
