"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  registrationId: number;
};

export default function IssueCertificateButton({
  registrationId,
}: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function issueCertificate() {
    try {
      setLoading(true);

      const res = await fetch("/api/certificate/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          registrationId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Certificate generation failed.");
        return;
      }

      alert("✅ Certificate Issued Successfully");

      // Refresh admin table
      router.refresh();

      // Open certificate in new tab
      window.open(`/certificate/${registrationId}`, "_blank");
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={issueCertificate}
      disabled={loading}
      className={`px-5 py-2 rounded-lg font-semibold text-white transition-all duration-200 ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-blue-700 hover:bg-blue-800"
      }`}
    >
      {loading ? "Issuing..." : "🎓 Issue Certificate"}
    </button>
  );
}