"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg w-full">
        <div className="text-7xl mb-6">⚠️</div>

        <h1 className="text-3xl font-bold text-red-600">
          Something went wrong!
        </h1>

        <p className="text-gray-600 mt-4 leading-relaxed">
          An unexpected error occurred while processing your request. Please try again.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <button
            onClick={() => reset()}
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition shadow"
          >
            🔄 Try Again
          </button>

          <Link
            href="/"
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-6 py-3 rounded-xl transition"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
