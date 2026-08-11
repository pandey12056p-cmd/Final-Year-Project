"use client";

import { useState, useEffect } from "react";

export default function Navbar() {
  const [currentDate, setCurrentDate] = useState("");

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

  return (
    <header className="bg-white rounded-3xl shadow-lg border border-slate-200 px-8 py-5 flex flex-col lg:flex-row items-center justify-between gap-5">

      {/* Left */}

      <div className="flex flex-col">

        <h1 className="text-3xl font-bold text-slate-800">
          Welcome Admin 👋
        </h1>

        <p className="text-gray-500 mt-1">
          {currentDate}
        </p>

      </div>

      {/* Center */}

      <div className="w-full lg:max-w-xl">

        <div className="relative">

          <input
            type="text"
            placeholder="Search events, users, registrations..."
            className="w-full rounded-2xl border border-slate-300 py-4 pl-14 pr-5 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-200"
          />

          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl">
            🔍
          </span>

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Notification */}

        <button className="relative bg-slate-100 hover:bg-slate-200 transition p-4 rounded-full">

          🔔

          <span className="absolute top-2 right-2 w-3 h-3 rounded-full bg-red-500"></span>

        </button>

        {/* Profile */}

        <div className="flex items-center gap-3 bg-slate-100 rounded-2xl px-4 py-2">

          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white flex items-center justify-center font-bold text-lg">

            A

          </div>

          <div>

            <h3 className="font-bold text-slate-800">
              Administrator
            </h3>

            <p className="text-sm text-gray-500">
              admin@event.com
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}