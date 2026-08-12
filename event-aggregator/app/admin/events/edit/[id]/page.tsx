"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEventPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    title: "",
    image: "",
    date: "",
    location: "",
    description: "",
    prize: "",
    teamSize: "",
  });

  useEffect(() => {
    async function fetchEvent() {
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();

      setForm({
        title: data.title,
        image: data.image,
        date: data.date,
        location: data.location,
        description: data.description,
        prize: data.prize,
        teamSize: data.teamSize,
      });

      setLoading(false);
    }

    fetchEvent();
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    await fetch(`/api/events/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    alert("Event Updated Successfully");

    router.push("/admin/events");
  }

  if (loading) {
    return (
      <div className="text-center mt-20 text-2xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-4xl font-bold text-blue-700 mb-8">
          Edit Event
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Title</label>
            <input
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({ ...form, title: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Image URL</label>
            <input
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
              placeholder="Image URL"
              value={form.image}
              onChange={(e) =>
                setForm({ ...form, image: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Date</label>
            <input
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
              placeholder="Date"
              value={form.date}
              onChange={(e) =>
                setForm({ ...form, date: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Location / Venue</label>
            <input
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
              placeholder="Location"
              value={form.location}
              onChange={(e) =>
                setForm({ ...form, location: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Prize / Reward</label>
            <input
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
              placeholder="Prize"
              value={form.prize}
              onChange={(e) =>
                setForm({ ...form, prize: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Team Size</label>
            <input
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium"
              placeholder="Team Size"
              value={form.teamSize}
              onChange={(e) =>
                setForm({ ...form, teamSize: e.target.value })
              }
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Event Description</label>
            <textarea
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition shadow-sm text-sm font-medium h-36"
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3.5 rounded-xl text-md font-semibold transition cursor-pointer"
          >
            Update Event
          </button>

        </form>

      </div>
    </main>
  );
}