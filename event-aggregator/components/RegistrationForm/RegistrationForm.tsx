"use client";

import { useState } from "react";

type Props = {
  eventId: number;
  eventTitle: string;
};

export default function RegistrationForm({
  eventId,
  eventTitle,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    const form = e.currentTarget;

    const formData = new FormData(form);

    const data = {
      eventId,
      eventTitle,
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      college: formData.get("college"),
      branch: formData.get("branch"),
      year: formData.get("year"),
      teamName: formData.get("teamName"),
      reason: formData.get("reason"),
    };

    try {
      setLoading(true);

      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert("🎉 Registration Successful!");

        form.reset();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-6xl mx-auto mt-16 mb-20">

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-10">

          <h2 className="text-4xl font-bold">
            Register For This Event
          </h2>

          <p className="mt-3 text-blue-100">
            Complete the form below to reserve your seat.
          </p>

        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10"
        >

          <input
            name="fullName"
            required
            placeholder="👤 Full Name"
            className="border rounded-xl p-4"
          />

          <input
            name="email"
            type="email"
            required
            placeholder="📧 Email"
            className="border rounded-xl p-4"
          />

          <input
            name="phone"
            required
            placeholder="📱 Phone Number"
            className="border rounded-xl p-4"
          />

          <input
            name="college"
            required
            placeholder="🏫 College"
            className="border rounded-xl p-4"
          />

          <input
            name="branch"
            required
            placeholder="💻 Branch"
            className="border rounded-xl p-4"
          />

          <select
            name="year"
            required
            className="border rounded-xl p-4"
          >
            <option value="">Select Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>

          <input
            name="teamName"
            placeholder="👥 Team Name (Optional)"
            className="border rounded-xl p-4 md:col-span-2"
          />

          <textarea
            name="reason"
            rows={5}
            required
            placeholder="📝 Why do you want to participate?"
            className="border rounded-xl p-4 md:col-span-2"
          />

          <button
            type="submit"
            disabled={loading}
            className="md:col-span-2 bg-gradient-to-r from-blue-700 to-indigo-700 hover:opacity-90 text-white py-4 rounded-xl text-lg font-semibold transition"
          >
            {loading ? "Registering..." : "🚀 Register Now"}
          </button>

        </form>

      </div>

    </section>
  );
}