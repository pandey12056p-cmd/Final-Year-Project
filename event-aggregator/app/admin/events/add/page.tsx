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
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Title</label>
            <input
              name="title"
              required
              placeholder="e.g. Hackathon 2026"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Category</label>
            <select
              name="category"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            >
              <option value="">Select Category</option>
              <option>Hackathon</option>
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Sports</option>
              <option>Cultural</option>
              <option>Placement Drive</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Organizer Name</label>
            <input
              name="organizer"
              required
              placeholder="e.g. Computer Science Department"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Image URL</label>
            <input
              name="image"
              required
              placeholder="e.g. https://images.unsplash.com/photo-..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Location / Venue</label>
            <input
              name="location"
              required
              placeholder="e.g. Seminar Hall 3"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Mode</label>
            <select
              name="mode"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            >
              <option value="">Select Mode</option>
              <option>Offline</option>
              <option>Online</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Event Date & Time
            </label>
            <input
              name="date"
              required
              type="datetime-local"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Registration Deadline
            </label>
            <input
              name="registrationDeadline"
              required
              type="datetime-local"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Max Participants</label>
            <input
              name="maxParticipants"
              required
              type="number"
              placeholder="e.g. 100"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Prize / Reward</label>
            <input
              name="prize"
              required
              placeholder="e.g. Cash Prize of 10,000 INR"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Team Size</label>
            <input
              name="teamSize"
              required
              placeholder="e.g. Solo or 2-4 Members"
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Status</label>
            <select
              name="status"
              required
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            >
              <option>Upcoming</option>
              <option>Ongoing</option>
              <option>Completed</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Description</label>
            <textarea
              name="description"
              required
              rows={5}
              placeholder="Describe the event rules, timeline, details..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
            />
          </div>

          <label className="md:col-span-2 flex items-center gap-3 font-semibold text-slate-700 text-sm cursor-pointer select-none">
            <input
              type="checkbox"
              name="certificateAvailable"
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            Certificate Available for Participants
          </label>

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-3.5 rounded-xl text-md font-semibold transition cursor-pointer"
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