"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json().catch(() => ({ message: "Server error occurred" }));

      if (!response.ok) {
        setIsError(true);
        setMessage(result.message || "Login Failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Save user
      localStorage.setItem("user", JSON.stringify(result.user));

      setIsError(false);
      setMessage("Login Successful! Redirecting...");

      // Redirect
      setTimeout(() => {
        if (result.user.role === "admin") {
          window.location.href = "/admin";
        } else {
          window.location.href = "/dashboard";
        }
      }, 500);
    } catch (error) {
      console.error(error);
      setIsError(true);
      setMessage("Network or server connection error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center text-blue-700">
          Login
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login to continue
        </p>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl text-center font-semibold ${
              isError
                ? "bg-red-100 text-red-700 border border-red-200"
                : "bg-green-100 text-green-700 border border-green-200"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleLogin}
          className="mt-8 space-y-5"
        >

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              name="email"
              type="email"
              required
              placeholder="Enter your email"
              className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              name="password"
              type="password"
              required
              placeholder="Enter your password"
              className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Logging In..." : "Login"}
          </button>

        </form>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="text-blue-700 font-semibold"
          >
            Register
          </Link>
        </p>

      </div>
    </main>
  );
}