"use client";

import { useRouter } from "next/navigation";

type DeleteButtonProps = {
  id: number;
};

export default function DeleteButton({ id }: DeleteButtonProps) {
  const router = useRouter();

  async function handleDelete() {
    const confirmDelete = confirm(
      "Are you sure you want to delete this event?"
    );

    if (!confirmDelete) return;

    const res = await fetch(`/api/events/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      alert("Event deleted successfully.");
      router.refresh();
    } else {
      alert("Failed to delete event.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="bg-rose-50 hover:bg-rose-100 text-rose-600 hover:text-rose-700 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition"
    >
      Delete
    </button>
  );
}