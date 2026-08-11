"use client";

import { useState } from "react";

export default function UploadProfileImage() {
  const [loading, setLoading] = useState(false);

  async function uploadImage(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);

    const res = await fetch("/api/upload-profile", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    setLoading(false);

    alert(data.message);

    if (data.success) {
      location.reload();
    }
  }

  return (
    <div className="mt-5">

      <label className="cursor-pointer bg-blue-700 text-white px-5 py-3 rounded-xl hover:bg-blue-800 transition inline-block">

        {loading ? "Uploading..." : "Upload Profile Photo"}

        <input
          type="file"
          accept="image/*"
          hidden
          onChange={uploadImage}
        />

      </label>

    </div>
  );
}