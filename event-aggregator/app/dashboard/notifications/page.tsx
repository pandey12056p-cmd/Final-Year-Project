"use client";

import { useState, useEffect } from "react";

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) setNotifications(data.notifications || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkRead(id?: number) {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id, markAll: !id }),
      });
      fetchNotifications();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-amber-500/20 text-amber-200 text-xs font-bold px-3 py-1 rounded-full border border-amber-400/20">
            Real-time Updates
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">🔔 Notifications</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Stay updated with your event registrations, certificates, and deadline reminders.
          </p>
        </div>

        <button
          onClick={() => handleMarkRead()}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 shadow"
        >
          Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 md:p-8 space-y-4">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <div className="text-4xl">🔕</div>
            <h3 className="text-base font-bold text-slate-800">No Notifications</h3>
            <p className="text-xs text-slate-500">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item) => (
              <div
                key={item.id}
                className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                  item.isRead
                    ? "bg-slate-50/60 border-slate-200/70"
                    : "bg-blue-50/70 border-blue-200 font-medium"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-base">
                      {item.type === "certificate" ? "🏆" : item.type === "registration" ? "📝" : "🔔"}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    {!item.isRead && (
                      <span className="bg-blue-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600">{item.message}</p>
                </div>

                {!item.isRead && (
                  <button
                    onClick={() => handleMarkRead(item.id)}
                    className="text-xs font-bold text-blue-700 hover:underline shrink-0"
                  >
                    Mark Read
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
