import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-lg w-full">
        <div className="text-8xl mb-6">🔍</div>

        <h1 className="text-5xl font-extrabold text-blue-700">404</h1>

        <h2 className="text-2xl font-bold text-slate-800 mt-2">
          Page Not Found
        </h2>

        <p className="text-gray-600 mt-4 leading-relaxed">
          The page you are looking for does not exist, has been removed, or is temporarily unavailable.
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap">
          <Link
            href="/"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition shadow"
          >
            🏠 Home
          </Link>

          <Link
            href="/events"
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold px-6 py-3 rounded-xl transition"
          >
            🎯 View Events
          </Link>
        </div>
      </div>
    </main>
  );
}
