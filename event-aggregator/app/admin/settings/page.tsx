"use client";

import { useState } from "react";

export default function SettingsPage() {
  // Existing Fields
  const [websiteName, setWebsiteName] = useState("Event Aggregator");
  const [adminEmail, setAdminEmail] = useState("admin@event.com");

  // Feature Toggles
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [autoCertificates, setAutoCertificates] = useState(false);

  // Password Fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast("System configurations saved successfully!");
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      triggerToast("Please enter your current password.", "error");
      return;
    }
    if (newPassword.length < 6) {
      triggerToast("New password must be at least 6 characters long.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      triggerToast("New passwords do not match.", "error");
      return;
    }

    // Success simulated change
    triggerToast("Admin password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <main className="min-h-screen bg-slate-100 p-6 space-y-6 relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl transition-all duration-300 transform translate-y-0 border ${
            toastType === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          <span className="text-lg">
            {toastType === "success" ? "✅" : "❌"}
          </span>
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          Settings
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          Manage system configurations and admin security controls.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Left Side: App Configurations */}
        <div className="space-y-6">
          
          {/* General App Settings */}
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Application Settings
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Website Name
                </label>
                <input
                  type="text"
                  value={websiteName}
                  onChange={(e) => setWebsiteName(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Admin Email Address
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full mt-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs uppercase tracking-wider py-3 rounded-xl transition cursor-pointer shadow-sm"
            >
              Save General Config
            </button>
          </form>

          {/* Feature Flags / Toggles */}
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-5">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Feature Flags & System Toggles
            </h2>

            <div className="space-y-4">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Allow Student Registrations</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Toggle new event registrations open or closed.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAllowRegistrations(!allowRegistrations);
                    triggerToast(`Registrations ${!allowRegistrations ? "opened" : "closed"} successfully!`);
                  }}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    allowRegistrations ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      allowRegistrations ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between py-2 border-b border-slate-50">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Maintenance Mode</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Locks the public application interface.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMaintenanceMode(!maintenanceMode);
                    triggerToast(`Maintenance mode ${!maintenanceMode ? "activated" : "deactivated"}!`);
                  }}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    maintenanceMode ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      maintenanceMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between py-2">
                <div>
                  <h4 className="text-sm font-bold text-slate-700">Auto-Issue Certificates</h4>
                  <p className="text-[11px] text-slate-400 font-medium mt-0.5">Generates PDF certificates on event completion.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAutoCertificates(!autoCertificates);
                    triggerToast(`Auto-certificates ${!autoCertificates ? "enabled" : "disabled"}!`);
                  }}
                  className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    autoCertificates ? "bg-blue-600" : "bg-slate-200"
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                      autoCertificates ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* Right Side: Security & Credentials */}
        <div>
          <form onSubmit={handlePasswordChange} className="bg-white rounded-3xl shadow-xl border border-slate-200 p-6 space-y-5 h-full">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Admin Credentials & Security
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full mt-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1.5 rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm font-medium text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs uppercase tracking-wider py-3 rounded-xl transition cursor-pointer shadow-sm"
              >
                Change Admin Password
              </button>
            </div>
          </form>
        </div>

      </div>

    </main>
  );
}