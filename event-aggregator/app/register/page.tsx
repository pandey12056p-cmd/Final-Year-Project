"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleRegister(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
    };

    setLoading(true);
    setMessage("");

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    setLoading(false);

    if (response.ok) {
      setMessage("Account created successfully. Redirecting to login...");
      form.reset();

      setTimeout(() => {
        router.push("/login");
      }, 1200);
    } else {
      setMessage(result.message || "Registration failed");
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-6 py-12">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          Create Account
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Join and explore college events
        </p>

        {message && (
          <div className="mt-6 bg-blue-100 text-blue-700 p-4 rounded-xl text-center font-semibold">
            {message}
          </div>
        )}

        <form onSubmit={handleRegister} className="mt-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              name="name"
              required
              type="text"
              placeholder="Enter your full name"
              className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              name="email"
              required
              type="email"
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
              required
              type="password"
              placeholder="Create password"
              className="mt-2 w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-700 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}