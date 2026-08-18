"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    setLoading(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({ message: "Server error occurred" }));

      if (!response.ok) {
        setIsError(true);
        setMessage(result.message || "Login Failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Role check: Only admin allowed
      if (result.user.role !== "admin") {
        await fetch("/api/auth/logout", { method: "POST" });
        setIsError(true);
        setMessage(`Access Denied: Only Administrator accounts are allowed to log in here.`);
        setLoading(false);
        return;
      }

      // Save user
      localStorage.setItem("user", JSON.stringify(result.user));

      setIsError(false);
      setMessage("Login Successful! Redirecting...");

      setTimeout(() => {
        router.push("/admin");
      }, 500);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Network or server connection error.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 to-slate-200 flex items-center justify-center px-4 py-16">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-rose-600 to-slate-700" />

        <div className="px-8 py-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-rose-200">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Admin Control Panel</h1>
            <p className="text-sm text-slate-400 mt-1">Secure administrator authorization portal</p>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-6 p-4 rounded-xl text-center text-sm font-semibold border ${
              isError
                ? "bg-red-105 text-red-700 border-red-200"
                : "bg-green-105 text-green-700 border-green-200"
            }`}>
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="admin@domain.edu"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Admin Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition placeholder:text-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 transition cursor-pointer"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-350 text-white py-3 rounded-xl text-sm font-bold transition-all duration-200 mt-2 cursor-pointer"
            >
              {loading ? "Authorizing..." : "Access Control"}
            </button>
          </form>

          {/* Links */}
          <div className="flex justify-between items-center text-slate-500 text-sm mt-6">
            <Link href="/" className="hover:underline font-bold text-slate-500">
              ← Return Home
            </Link>
            <Link href="/login" className="text-blue-650 font-bold hover:underline">
              Student Portal →
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
