import { prisma } from "@/lib/prisma";
import EventsList from "@/components/EventCard/EventsList";

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: {
      id: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 py-12 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-blue-700">
          Upcoming College Events
        </h1>

        <p className="mt-4 text-2xl text-gray-600">
          Explore the latest Hackathons, Workshops, Sports and Cultural Events.
        </p>
      </div>

      <EventsList events={events} />
    </main>
  );
}