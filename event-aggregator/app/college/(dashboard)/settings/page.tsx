"use client";

import { useState } from "react";

export default function CollegeSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setIsError(true);
      setMessage("New passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // We reuse existing password update API if it supports it, or handle it cleanly.
        // Wait, let's verify if the profile PUT supports changing password. In profile/route.ts, it doesn't support password.
        // If not, we can write a dedicated change-password API, or mock it with success for front-end demonstration,
        // or actually write the backend logic if needed. Let's see: we can create an endpoint /api/auth/change-password
        // but for now let's hit a secure change-password endpoint that we will create, or let's create a small endpoint
        // at /api/auth/change-password/route.ts that updates password. That's very clean and real!
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      
      // Let's create the endpoint later. If they request it, it works.
      const data = await res.json();
      if (res.ok) {
        setIsError(false);
        setMessage("Password updated successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setIsError(true);
        setMessage(data.message || "Failed to update password.");
      }
    } catch (err) {
      console.error(err);
      setIsError(true);
      setMessage("Network or server error.");
    } finally {
      setLoading(false);
    }
  }

  function setError(msg: string) {
    if (msg) {
      setIsError(true);
      setMessage(msg);
    }
  }

  return (
    <main className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Portal Settings</h1>
        <p className="text-slate-500 text-xs font-semibold mt-0.5">Manage credentials and review portal compliance guidelines.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Change Password Card */}
        <div className="md:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3">Update Account Password</h3>
          
          {message && (
            <div className={`p-4 rounded-xl text-center text-xs font-bold ${
              isError ? "bg-red-50 text-red-700 border border-red-150" : "bg-green-50 text-green-700 border border-green-150"
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Current Password</label>
              <input
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>

        {/* Guidelines Sidebar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4 text-xs">
          <h3 className="text-xs font-bold text-slate-850 border-b border-slate-100 pb-2.5 text-center">Compliance Guidelines</h3>
          
          <ul className="space-y-3 font-semibold text-slate-600 leading-relaxed list-disc pl-4">
            <li>Only publish events occurring inside your official campus or authorized online portals.</li>
            <li>Specify correct dates, eligibility, and entry fees. Incorrect information will flag your event.</li>
            <li>Ensure links pointing to official registration forms are secured (`https`).</li>
            <li>Admins will review all approval requests within 24-48 hours.</li>
            <li>If your event is cancelled, notify registered participants immediately.</li>
          </ul>

          <div className="bg-slate-50 border border-slate-150 p-4 rounded-xl text-[10px] font-medium text-slate-400">
            🔒 Security Tip: Regularly change your organizer account password and do not share credentials.
          </div>
        </div>

      </div>

    </main>
  );
}
