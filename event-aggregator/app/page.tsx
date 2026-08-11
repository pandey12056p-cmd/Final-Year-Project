import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">

      <section className="max-w-7xl mx-auto px-8 py-24">

        <div className="text-center">

          <h1 className="text-6xl font-extrabold text-blue-700 leading-tight">
            Discover Amazing
            <br />
            College Events
          </h1>

          <p className="mt-8 text-xl text-gray-600 max-w-3xl mx-auto">
            Find Hackathons, Workshops, Cultural Events, Sports,
            Technical Festivals and Competitions happening across
            colleges.
          </p>

          <div className="mt-10 flex justify-center gap-6">

            <Link
              href="/events"
              className="bg-blue-700 hover:bg-blue-800 transition px-8 py-4 rounded-xl text-white font-semibold"
            >
              Explore Events
            </Link>

            <Link
              href="/register"
              className="border-2 border-blue-700 text-blue-700 hover:bg-blue-700 hover:text-white transition px-8 py-4 rounded-xl font-semibold"
            >
              Join Now
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}