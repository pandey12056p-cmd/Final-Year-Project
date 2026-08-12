"use client";

import { useState } from "react";

type Props = {
  eventId: number;
  eventTitle: string;
  isExpired?: boolean;
  isFull?: boolean;
};

export default function RegistrationForm({
  eventId,
  eventTitle,
  isExpired = false,
  isFull = false,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (isExpired || isFull) {
      alert(
        isExpired
          ? "Registration for this event has closed."
          : "Registration is full for this event."
      );
      return;
    }

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
        alert(result.message || "Registration Failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const isFormDisabled = isExpired || isFull;

  return (
    <section className="max-w-6xl mx-auto mt-16 mb-20">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 text-white p-10">
          <h2 className="text-4xl font-bold">
            Register For This Event
          </h2>

          <p className="mt-3 text-blue-100">
            {isExpired
              ? "Registration deadline has passed for this event."
              : isFull
              ? "Maximum participant limit has been reached."
              : "Complete the form below to reserve your seat."}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 p-10"
        >
          <input
            name="fullName"
            required
            disabled={isFormDisabled}
            placeholder="👤 Full Name"
            className="border rounded-xl p-4 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="email"
            type="email"
            required
            disabled={isFormDisabled}
            placeholder="📧 Email"
            className="border rounded-xl p-4 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="phone"
            required
            disabled={isFormDisabled}
            placeholder="📱 Phone Number"
            className="border rounded-xl p-4 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="college"
            required
            disabled={isFormDisabled}
            placeholder="🏫 College"
            className="border rounded-xl p-4 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <input
            name="branch"
            required
            disabled={isFormDisabled}
            placeholder="💻 Branch"
            className="border rounded-xl p-4 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <select
            name="year"
            required
            disabled={isFormDisabled}
            className="border rounded-xl p-4 disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">Select Year</option>
            <option>1st Year</option>
            <option>2nd Year</option>
            <option>3rd Year</option>
            <option>4th Year</option>
          </select>

          <input
            name="teamName"
            disabled={isFormDisabled}
            placeholder="👥 Team Name (Optional)"
            className="border rounded-xl p-4 md:col-span-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <textarea
            name="reason"
            rows={5}
            required
            disabled={isFormDisabled}
            placeholder="📝 Why do you want to participate?"
            className="border rounded-xl p-4 md:col-span-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={loading || isFormDisabled}
            className={`md:col-span-2 py-4 rounded-xl text-lg font-semibold transition ${
              isFormDisabled
                ? "bg-gray-400 text-white cursor-not-allowed"
                : loading
                ? "bg-blue-500 text-white cursor-wait"
                : "bg-gradient-to-r from-blue-700 to-indigo-700 hover:opacity-90 text-white"
            }`}
          >
            {isExpired
              ? "🚫 Registration Closed"
              : isFull
              ? "🚫 Registration Full"
              : loading
              ? "Registering..."
              : "🚀 Register Now"}
          </button>
        </form>
      </div>
    </section>
  );
}