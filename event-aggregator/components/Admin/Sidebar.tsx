"use client";

import MenuItem from "./MenuItem";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-200 shadow-lg flex flex-col">

      {/* Logo */}

      <div className="bg-gradient-to-r from-blue-700 to-indigo-700 p-8">

        <h1 className="text-3xl font-extrabold text-white">
          Event Aggregator
        </h1>

        <p className="text-blue-100 mt-2">
          Admin Panel
        </p>

      </div>

      {/* Navigation */}

      <nav className="flex-1 px-5 py-8 space-y-3">

        <MenuItem
          href="/admin"
          icon="🏠"
          title="Dashboard"
        />

        <MenuItem
          href="/admin/events"
          icon="🎯"
          title="Events"
        />

        <MenuItem
          href="/admin/events/add"
          icon="➕"
          title="Add Event"
        />

        <MenuItem
          href="/admin/registrations"
          icon="📝"
          title="Registrations"
        />

        <MenuItem
          href="/admin/users"
          icon="👨‍🎓"
          title="Users"
        />

        <MenuItem
          href="/admin/reports"
          icon="📊"
          title="Reports"
        />

        <MenuItem
          href="/admin/certificates"
          icon="🎓"
          title="Certificates"
        />

        <MenuItem
          href="/admin/settings"
          icon="⚙️"
          title="Settings"
        />

      </nav>

      {/* Footer */}

      <div className="border-t p-6">

        <div className="bg-slate-100 rounded-2xl p-4">

          <h3 className="font-bold text-slate-800">
            Admin
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            Event Management System
          </p>

        </div>

      </div>

    </aside>
  );
}