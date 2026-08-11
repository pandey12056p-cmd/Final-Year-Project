"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
};

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  function logout() {
    localStorage.removeItem("user");

    document.cookie =
      "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    window.location.href = "/";
  }

  return (
    <nav className="bg-blue-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-4">

        <Link href="/" className="text-2xl font-bold">
          Event Aggregator
        </Link>

        <div className="flex items-center gap-6 font-medium">

          <Link href="/">Home</Link>

          <Link href="/events">Events</Link>

          {!user && (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}

          {user && user.role === "student" && (
            <>
              <Link href="/dashboard">Dashboard</Link>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
              >
                Logout
              </button>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <Link href="/admin">Admin Dashboard</Link>

              <Link href="/admin/users">Users</Link>

              <Link href="/admin/events">Manage Events</Link>

              <Link href="/admin/registrations">Registrations</Link>

              <Link href="/admin/events/add">Add Event</Link>

              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition"
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