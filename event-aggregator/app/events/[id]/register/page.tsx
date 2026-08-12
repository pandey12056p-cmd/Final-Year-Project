"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";

type Event = {
  id: number;
  title: string;
  category: string;
  image: string;
  date: string;
  location: string;
  mode: string;
  organizer: string;
  description: string;
  prize: string;
  teamSize: string;
  registrationDeadline: string;
  maxParticipants: number;
  certificateAvailable: boolean;
};

export default function EventRegisterPage() {
  const params = useParams();
  const id = params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        setEvent(data);
      } catch (e) {
        console.error(e);
      } finally {
        setPageLoading(false);
      }
    }

    if (id) fetchEvent();
  }, [id]);

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center space-y-3">
          <div className="text-4xl animate-bounce">⏳</div>
          <h1 className="text-lg font-bold text-slate-800">Loading Official Registration Portal...</h1>
        </div>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center space-y-4">
          <div className="text-4xl">❌</div>
          <h1 className="text-2xl font-bold text-red-600">Event Not Found</h1>
          <Link href="/events" className="inline-block bg-blue-700 text-white text-xs font-bold px-6 py-3 rounded-2xl shadow">
            Back to All Events
          </Link>
        </div>
      </main>
    );
  }

  const isExpired = new Date() > new Date(event.registrationDeadline);

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href={`/events/${event.id}`} className="text-xs font-bold text-slate-600 hover:text-blue-700 transition">
            ← Back to Event Details
          </Link>
          <span className="text-xs font-bold text-slate-400">Event ID: #{event.id}</span>
        </div>

        <RegistrationForm
          eventId={event.id}
          eventTitle={event.title}
          category={event.category}
          date={event.date}
          mode={event.mode}
          location={event.location}
          organizer={event.organizer}
          certificateAvailable={event.certificateAvailable}
          registrationDeadline={event.registrationDeadline}
          isExpired={isExpired}
        />
      </div>
    </main>
  );
}