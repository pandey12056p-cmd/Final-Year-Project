"use client";

import { useState } from "react";
import Link from "next/link";

export default function AddEventPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const data = {
      title: formData.get("title"),
      category: formData.get("category"),
      organizer: formData.get("organizer"),
      image: formData.get("image"),
      description: formData.get("description"),
      location: formData.get("location"),
      mode: formData.get("mode"),

      date: formData.get("date"),
      registrationDeadline: formData.get("registrationDeadline"),

      maxParticipants: Number(formData.get("maxParticipants")),
      prize: formData.get("prize"),
      teamSize: formData.get("teamSize"),
      status: formData.get("status"),

      certificateAvailable:
        formData.get("certificateAvailable") === "on",
    };

    try {
      setLoading(true);
      setSuccess(false);

      const response = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed");
      }

      setSuccess(true);
      form.reset();
    } catch (error) {
      console.error(error);
      alert("Event create failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <h1 className="text-4xl font-bold text-center text-slate-800">
          Add New Event
        </h1>

        <p className="text-center text-gray-600 mt-3">
          Create a professional event for students
        </p>

        {success && (
          <div className="mt-6 bg-green-100 text-green-700 p-4 rounded-xl text-center font-semibold">
            ✅ Event Created Successfully!
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            name="title"
            required
            placeholder="Event Title"
            className="border rounded-xl px-4 py-4"
          />

          <select
            name="category"
            required
            className="border rounded-xl px-4 py-4"
          >
            <option value="">Select Category</option>
            <option>Hackathon</option>
            <option>Workshop</option>
            <option>Seminar</option>
            <option>Sports</option>
            <option>Cultural</option>
            <option>Placement Drive</option>
          </select>

          <input
            name="organizer"
            required
            placeholder="Organizer Name"
            className="border rounded-xl px-4 py-4"
          />

          <input
            name="image"
            required
            placeholder="Image URL"
            className="border rounded-xl px-4 py-4"
          />

          <input
            name="location"
            required
            placeholder="Location / Venue"
            className="border rounded-xl px-4 py-4"
          />

          <select
            name="mode"
            required
            className="border rounded-xl px-4 py-4"
          >
            <option value="">Select Mode</option>
            <option>Offline</option>
            <option>Online</option>
            <option>Hybrid</option>
          </select>

          <div>
            <label className="block mb-2 font-medium">
              Event Date & Time
            </label>

            <input
              name="date"
              required
              type="datetime-local"
              className="border rounded-xl px-4 py-4 w-full"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Registration Deadline
            </label>

            <input
              name="registrationDeadline"
              required
              type="datetime-local"
              className="border rounded-xl px-4 py-4 w-full"
            />
          </div>

          <input
            name="maxParticipants"
            required
            type="number"
            placeholder="Max Participants"
            className="border rounded-xl px-4 py-4"
          />

          <input
            name="prize"
            required
            placeholder="Prize / Reward"
            className="border rounded-xl px-4 py-4"
          />

          <input
            name="teamSize"
            required
            placeholder="Team Size (e.g. 2-4 Members)"
            className="border rounded-xl px-4 py-4"
          />

          <select
            name="status"
            required
            className="border rounded-xl px-4 py-4"
          >
            <option>Upcoming</option>
            <option>Ongoing</option>
            <option>Completed</option>
            <option>Closed</option>
          </select>

          <textarea
            name="description"
            required
            rows={5}
            placeholder="Event Description"
            className="md:col-span-2 border rounded-xl px-4 py-4"
          />

          <label className="md:col-span-2 flex items-center gap-3 font-semibold">
            <input
              type="checkbox"
              name="certificateAvailable"
            />
            Certificate Available
          </label>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl text-lg font-semibold"
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </form>

        <div className="text-center mt-8">
          <Link
            href="/admin/events"
            className="text-blue-700 font-semibold"
          >
            ← Back to Events
          </Link>
        </div>
      </div>
    </main>
  );
}