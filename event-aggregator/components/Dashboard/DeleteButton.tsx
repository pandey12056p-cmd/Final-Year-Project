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
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
    >
      Delete
    </button>
  );
}