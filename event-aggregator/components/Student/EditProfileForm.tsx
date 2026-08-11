"use client";

import { useState } from "react";

type Props = {
  user: {
    name: string;
    email: string;
    phone: string | null;
    college: string | null;
    branch: string | null;
    year: string | null;
  };
};

export default function EditProfileForm({
  user,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      college: formData.get("college"),
      branch: formData.get("branch"),
      year: formData.get("year"),
    };

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    setLoading(false);

    alert(data.message);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-3xl shadow-lg p-8 space-y-5"
    >
      <h2 className="text-3xl font-bold text-blue-700">
        Edit Profile
      </h2>

      <input
        name="name"
        defaultValue={user.name}
        className="w-full border rounded-xl p-4"
      />

      <input
        value={user.email}
        disabled
        className="w-full border rounded-xl p-4 bg-gray-100"
      />

      <input
        name="phone"
        defaultValue={user.phone ?? ""}
        placeholder="Phone"
        className="w-full border rounded-xl p-4"
      />

      <input
        name="college"
        defaultValue={user.college ?? ""}
        placeholder="College"
        className="w-full border rounded-xl p-4"
      />

      <input
        name="branch"
        defaultValue={user.branch ?? ""}
        placeholder="Branch"
        className="w-full border rounded-xl p-4"
      />

      <input
        name="year"
        defaultValue={user.year ?? ""}
        placeholder="Year"
        className="w-full border rounded-xl p-4"
      />

      <button
        disabled={loading}
        className="w-full bg-blue-700 text-white py-4 rounded-xl font-semibold"
      >
        {loading ? "Updating..." : "Update Profile"}
      </button>
    </form>
  );
}