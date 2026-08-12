"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "General",
    organizer: "",
    image: "",
    description: "",
    location: "",
    mode: "Offline",
    date: "",
    registrationDeadline: "",
    maxParticipants: 100,
    prize: "",
    teamSize: "",
    status: "Upcoming",
    certificateAvailable: false,
  });

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Event not found");
        const data = await res.json();

        const formatDateForInput = (d: any) => {
          if (!d) return "";
          const dateObj = new Date(d);
          if (isNaN(dateObj.getTime())) return "";
          return dateObj.toISOString().slice(0, 16);
        };

        setForm({
          title: data.title || "",
          category: data.category || "General",
          organizer: data.organizer || "",
          image: data.image || "",
          description: data.description || "",
          location: data.location || "",
          mode: data.mode || "Offline",
          date: formatDateForInput(data.date),
          registrationDeadline: formatDateForInput(data.registrationDeadline),
          maxParticipants: data.maxParticipants || 100,
          prize: data.prize || "",
          teamSize: data.teamSize || "",
          status: data.status || "Upcoming",
          certificateAvailable: Boolean(data.certificateAvailable),
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load event details");
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchEvent();
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setSubmitting(true);
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Update failed");
      }

      alert("✅ Event Updated Successfully");
      router.push("/admin/events");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to update event");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 p-10 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-10 shadow-xl text-center">
          <div className="text-4xl mb-3">⏳</div>
          <h2 className="text-2xl font-bold text-slate-700">Loading Event Details...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl p-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Edit Event</h1>
            <p className="text-gray-500 mt-1">Update event information and settings</p>
          </div>
          <Link
            href="/admin/events"
            className="text-blue-700 font-semibold hover:underline"
          >
            ← Back to Events
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block mb-2 font-medium">Event Title</label>
            <input
              required
              className="w-full border rounded-xl px-4 py-3"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Category</label>
            <select
              required
              className="w-full border rounded-xl px-4 py-3"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option>Hackathon</option>
              <option>Workshop</option>
              <option>Seminar</option>
              <option>Sports</option>
              <option>Cultural</option>
              <option>Placement Drive</option>
              <option>General</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Organizer Name</label>
            <input
              required
              className="w-full border rounded-xl px-4 py-3"
              value={form.organizer}
              onChange={(e) => setForm({ ...form, organizer: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Image URL</label>
            <input
              required
              className="w-full border rounded-xl px-4 py-3"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Location / Venue</label>
            <input
              required
              className="w-full border rounded-xl px-4 py-3"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Event Mode</label>
            <select
              required
              className="w-full border rounded-xl px-4 py-3"
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value })}
            >
              <option>Offline</option>
              <option>Online</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Event Date & Time</label>
            <input
              required
              type="datetime-local"
              className="w-full border rounded-xl px-4 py-3"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Registration Deadline</label>
            <input
              required
              type="datetime-local"
              className="w-full border rounded-xl px-4 py-3"
              value={form.registrationDeadline}
              onChange={(e) =>
                setForm({ ...form, registrationDeadline: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Max Participants</label>
            <input
              required
              type="number"
              className="w-full border rounded-xl px-4 py-3"
              value={form.maxParticipants}
              onChange={(e) =>
                setForm({ ...form, maxParticipants: Number(e.target.value) })
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Prize / Reward</label>
            <input
              required
              className="w-full border rounded-xl px-4 py-3"
              value={form.prize}
              onChange={(e) => setForm({ ...form, prize: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Team Size</label>
            <input
              required
              className="w-full border rounded-xl px-4 py-3"
              value={form.teamSize}
              onChange={(e) => setForm({ ...form, teamSize: e.target.value })}
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">Event Status</label>
            <select
              required
              className="w-full border rounded-xl px-4 py-3"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option>Upcoming</option>
              <option>Ongoing</option>
              <option>Completed</option>
              <option>Closed</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">Event Description</label>
            <textarea
              required
              rows={5}
              className="w-full border rounded-xl px-4 py-3"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </div>

          <label className="md:col-span-2 flex items-center gap-3 font-semibold text-slate-800">
            <input
              type="checkbox"
              checked={form.certificateAvailable}
              onChange={(e) =>
                setForm({ ...form, certificateAvailable: e.target.checked })
              }
              className="w-5 h-5"
            />
            Certificate Available for Participants
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="md:col-span-2 bg-blue-700 hover:bg-blue-800 text-white py-4 rounded-xl text-lg font-semibold transition cursor-pointer"
          >
            {submitting ? "Updating Event..." : "Save & Update Event"}
          </button>
        </form>
      </div>
    </main>
  );
}