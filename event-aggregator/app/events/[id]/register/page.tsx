"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

type Event = {
  id: number;
  title: string;
  image: string;
  date: string;
  location: string;
  description: string;
  prize: string;
  teamSize: string;
};

export default function EventRegisterPage() {
  const params = useParams();
  const id = params.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchEvent() {
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();

      setEvent(data);
      setPageLoading(false);
    }

    fetchEvent();
  }, [id]);

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-700">
          Loading Event...
        </h1>
      </main>
    );
  }

  if (!event) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
          <h1 className="text-3xl font-bold text-red-600">
            Event Not Found
          </h1>

          <Link
            href="/events"
            className="inline-block mt-6 bg-blue-700 text-white px-6 py-3 rounded-xl"
          >
            Back to Events
          </Link>
        </div>
      </main>
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!event) return;

    const form = e.currentTarget;
    const formData = new FormData(form);

    setLoading(true);
    setSubmitted(false);

    const data = {
      eventId: event.id,
      eventTitle: event.title,
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      college: formData.get("college"),
      branch: formData.get("branch"),
      year: formData.get("year"),
      teamName: formData.get("teamName"),
      reason: formData.get("reason"),
    };

    const response = await fetch("/api/registrations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    setLoading(false);

    if (response.ok) {
      setSubmitted(true);
      form.reset();
    } else {
      alert("Registration failed");
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-5xl font-bold text-blue-700 text-center">
          Register for Event
        </h1>

        <p className="text-center text-gray-600 mt-3 text-xl">
          {event.title}
        </p>

        {submitted && (
          <div className="mt-8 bg-green-100 text-green-700 p-4 rounded-xl text-center font-semibold">
            ✅ Registration submitted successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10"
        >
          <input
            name="fullName"
            required
            placeholder="Full Name"
            className="border rounded-xl px-4 py-4"
          />

          <input
            type="email"
            name="email"
            required
            placeholder="Email Address"
            className="border rounded-xl px-4 py-4"
          />

          <input
            name="phone"
            required
            placeholder="Phone Number"
            className="border rounded-xl px-4 py-4"
          />

          <input
            name="college"
            required
            placeholder="College Name"
            className="border rounded-xl px-4 py-4"
          />

          <input
            name="branch"
            required
            placeholder="Branch"
            className="border rounded-xl px-4 py-4"
          />

          <select
            name="year"
            required
            className="border rounded-xl px-4 py-4"
          >
            <option value="">Select Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>

          <input
            name="teamName"
            placeholder="Team Name"
            className="border rounded-xl px-4 py-4 md:col-span-2"
          />

          <textarea
            name="reason"
            required
            rows={5}
            placeholder="Why do you want to participate?"
            className="border rounded-xl px-4 py-4 md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl text-lg font-semibold"
          >
            {loading ? "Submitting..." : "Submit Registration"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            href={`/events/${event.id}`}
            className="text-blue-700 font-semibold hover:underline"
          >
            ← Back to Event Details
          </Link>
        </div>
      </div>
    </main>
  );
}