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
          className="space-y-5"
        >

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Image URL"
            value={form.image}
            onChange={(e) =>
              setForm({ ...form, image: e.target.value })
            }
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Date"
            value={form.date}
            onChange={(e) =>
              setForm({ ...form, date: e.target.value })
            }
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({ ...form, location: e.target.value })
            }
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Prize"
            value={form.prize}
            onChange={(e) =>
              setForm({ ...form, prize: e.target.value })
            }
          />

          <input
            className="w-full border p-3 rounded-lg"
            placeholder="Team Size"
            value={form.teamSize}
            onChange={(e) =>
              setForm({ ...form, teamSize: e.target.value })
            }
          />

          <textarea
            className="w-full border p-3 rounded-lg h-36"
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({
                ...form,
                description: e.target.value,
              })
            }
          />

          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-lg"
          >
            Update Event
          </button>

        </form>

      </div>
    </main>
  );
}