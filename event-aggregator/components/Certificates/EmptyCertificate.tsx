import Link from "next/link";

export default function EmptyCertificate() {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
      <div className="text-7xl mb-6">🏆</div>

      <h2 className="text-3xl font-bold text-slate-800">
        No Certificates Yet
      </h2>

      <p className="text-gray-500 mt-4">
        Participate in events and receive certificates after they are issued by
        the admin.
      </p>

      <Link
        href="/events"
        className="inline-block mt-8 bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold"
      >
        Explore Events
      </Link>
    </div>
  );
}