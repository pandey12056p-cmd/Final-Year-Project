"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

type SearchResult = {
  events: any[];
  users: any[];
  registrations: any[];
};

type Props = {
  onMenuClick?: () => void;
};

export default function Navbar({ onMenuClick }: Props) {
  const [currentDate, setCurrentDate] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult>({ events: [], users: [], registrations: [] });
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const now = new Date();
    setCurrentDate(
      now.toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    );
  }, []);

  // Debounced search fetch
  useEffect(() => {
    if (!query.trim()) {
      setResults({ events: [], users: [], registrations: [] });
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (res.ok) {
          setResults(data);
          setIsOpen(true);
        }
      } catch (error) {
        console.error("Search fetch failed:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside listener to close search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasResults =
    results.events.length > 0 ||
    results.users.length > 0 ||
    results.registrations.length > 0;

  return (
    <header className="bg-white rounded-3xl shadow-lg border border-slate-200 px-5 py-4 lg:px-8 lg:py-5 flex flex-col lg:flex-row items-center justify-between gap-4 relative z-40">
      
      {/* Left Greeting & Mobile Controls */}
      <div className="flex items-center gap-3 w-full lg:w-auto justify-between lg:justify-start">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex flex-col">
            <h1 className="text-xl md:text-2xl font-bold text-slate-800 whitespace-nowrap">
              Welcome Admin 👋
            </h1>
            <p className="text-gray-500 text-[11px] md:text-xs font-medium mt-0.5">
              {currentDate}
            </p>
          </div>
        </div>

        {/* Mobile Profile Thumbnail */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex lg:hidden items-center justify-center font-bold text-xs">
          A
        </div>
      </div>

      {/* Center Searchbar */}
      <div className="w-full lg:max-w-xl relative" ref={dropdownRef}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => query.trim() && setIsOpen(true)}
            placeholder="Search events, users, registrations..."
            className="w-full rounded-2xl border border-slate-300 py-3.5 pl-12 pr-5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium text-slate-800 placeholder-slate-400 transition"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
            🔍
          </span>
          {loading && (
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-blue-600 font-semibold animate-pulse">
              Searching...
            </span>
          )}
        </div>

        {/* Dropdown Overlay */}
        {isOpen && (
          <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 max-h-96 overflow-y-auto z-50 p-4 space-y-4">
            {!hasResults ? (
              <p className="text-center text-slate-500 text-sm py-4">
                No matches found for <span className="font-semibold text-slate-700">"{query}"</span>
              </p>
            ) : (
              <>
                {/* Events Section */}
                {results.events.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Events</h3>
                    <div className="space-y-1">
                      {results.events.map((event) => (
                        <Link
                          key={event.id}
                          href="/admin/events"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition text-sm text-slate-700 font-medium"
                        >
                          <span>{event.title}</span>
                          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">Event</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Users Section */}
                {results.users.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Users</h3>
                    <div className="space-y-1">
                      {results.users.map((user) => (
                        <Link
                          key={user.id}
                          href="/admin/users"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition text-sm text-slate-700 font-medium"
                        >
                          <div className="flex flex-col">
                            <span>{user.name}</span>
                            <span className="text-xs text-slate-400 font-normal">{user.email}</span>
                          </div>
                          <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-semibold capitalize">{user.role}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registrations Section */}
                {results.registrations.length > 0 && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Registrations</h3>
                    <div className="space-y-1">
                      {results.registrations.map((reg) => (
                        <Link
                          key={reg.id}
                          href="/admin/registrations"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition text-sm text-slate-700 font-medium"
                        >
                          <div className="flex flex-col">
                            <span>{reg.fullName}</span>
                            <span className="text-xs text-slate-400 font-normal">Registered for: {reg.eventTitle}</span>
                          </div>
                          <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded font-semibold">Registration</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Right User Details - Desktop Only */}
      <div className="hidden lg:flex items-center gap-4">
        {/* Notification */}
        <button className="relative bg-slate-100 hover:bg-slate-200 transition p-3 rounded-full cursor-pointer">
          <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"></span>
        </button>

        {/* Profile */}
        <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-center font-bold text-md">
            A
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-xs">
              Administrator
            </h3>
            <p className="text-[10px] text-gray-500 font-medium mt-0.5">
              admin@event.com
            </p>
          </div>
        </div>
      </div>

    </header>
  );
}