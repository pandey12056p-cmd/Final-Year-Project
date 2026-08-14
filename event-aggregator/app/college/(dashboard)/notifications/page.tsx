"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date";

type Notification = {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
  eventId: number | null;
};

export default function CollegeNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok && data.success) {
        setNotifications(data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(notificationId: number) {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === notificationId ? { ...n, isRead: true } : n))
        );
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleMarkAllAsRead() {
    try {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <main className="max-w-3xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">System Notifications</h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">Stay updated on college verification status and event approvals.</p>
        </div>
        
        {notifications.some((n) => !n.isRead) && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs font-extrabold text-blue-600 hover:text-blue-800 transition cursor-pointer"
          >
            ✓ Mark all as read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold animate-pulse">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <span className="text-3xl block">🔔</span>
            <h3 className="text-sm font-bold text-slate-800">Inbox is clean</h3>
            <p className="text-xs text-slate-400 font-semibold">You have no new notifications.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => !n.isRead && handleMarkAsRead(n.id)}
                className={`py-4 flex gap-4 items-start cursor-pointer transition first:pt-0 last:pb-0 ${
                  !n.isRead ? "bg-slate-50/50 -mx-6 px-6" : ""
                }`}
              >
                {/* Icon based on type */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-md shrink-0 border ${
                  n.type === "alert" || n.type === "error"
                    ? "bg-rose-50 border-rose-100 text-rose-600"
                    : "bg-blue-50 border-blue-100 text-blue-600"
                }`}>
                  {n.type === "alert" || n.type === "error" ? "⚠️" : "🔔"}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className={`text-xs font-bold text-slate-800 truncate ${!n.isRead ? "font-black text-slate-900" : ""}`}>
                      {n.title}
                    </h3>
                    <span className="text-[10px] text-slate-400 font-bold shrink-0">
                      {formatDate(n.createdAt)}
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold">
                    {n.message}
                  </p>
                  
                  {/* Event link if present */}
                  {n.eventId && (
                    <div className="pt-1">
                      <Link
                        href={`/college/events`}
                        className="text-[10px] font-bold text-blue-600 hover:underline"
                      >
                        Manage Events →
                      </Link>
                    </div>
                  )}
                </div>

                {/* Unread dot */}
                {!n.isRead && (
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0 self-center" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </main>
  );
}
