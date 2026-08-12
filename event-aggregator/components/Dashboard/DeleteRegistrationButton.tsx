"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type DeleteRegistrationButtonProps = {
  id: number;
};

export default function DeleteRegistrationButton({
  id,
}: DeleteRegistrationButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmDelete = confirm(
      "Are you sure you want to delete this registration?"
    );

    if (!confirmDelete) return;

    setLoading(true);

    const res = await fetch("/api/registrations", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete registration");
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
}