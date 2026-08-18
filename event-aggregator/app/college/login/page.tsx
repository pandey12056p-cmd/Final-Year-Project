"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CollegeLoginPage() {
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

      // Role check: Only colleges allowed in this URL
      if (result.user.role !== "college") {
        // Logout immediately
        await fetch("/api/auth/logout", { method: "POST" });
        setIsError(true);
        setMessage(`Access Denied: Only College Organizer accounts are allowed to log in here. If you are a Student, please use the Student Login portal.`);
        setLoading(false);
        return;
      }

      // Save user
      localStorage.setItem("user", JSON.stringify(result.user));

      setIsError(false);
      setMessage("Login Successful! Redirecting...");

      setTimeout(() => {
        router.push("/college");
      }, 500);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Network or server connection error.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 flex items-center justify-center px-4 py-16">
      
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden">
        
        {/* Top accent bar */}
        <div className="h-1.5 bg-gradient-to-r from-indigo-600 to-purple-600" />

        <div className="px-8 py-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md shadow-indigo-200">
              <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800">Welcome Organizer</h1>
            <p className="text-sm text-slate-400 mt-1">Login to your college organizer panel</p>
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
                Official Email Address
              </label>
              <input
                name="email"
                type="email"
                required
                placeholder="college@domain.edu"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-slate-400"
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
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white py-3 rounded-xl text-sm font-bold transition-all duration-200 mt-2 cursor-pointer"
            >
              {loading ? "Logging In..." : "Login"}
            </button>
          </form>

          {/* Links */}
          <div className="flex justify-between items-center text-slate-500 text-sm mt-6">
            <span>
              Not registered?{" "}
              <Link href="/register" className="text-indigo-600 font-bold hover:underline">
                Register
              </Link>
            </span>
            <Link href="/login" className="text-blue-650 font-bold hover:underline">
              Student Portal →
            </Link>
          </div>

        </div>
      </div>
    </main>
  );
}
