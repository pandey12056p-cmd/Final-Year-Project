"use client";

import { useState } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

export default function CertificateDownload() {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    try {
      setLoading(true);

      const certificate = document.getElementById("certificate");

      if (!certificate) {
        alert("Certificate not found.");
        return;
      }

      const dataUrl = await toPng(certificate, {
        cacheBust: true,
        pixelRatio: 4,
        backgroundColor: "#ffffff",
        quality: 1,
      });

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      pdf.addImage(
        dataUrl,
        "PNG",
        0,
        0,
        297,
        210,
        undefined,
        "FAST"
      );

      pdf.save("Certificate.pdf");
    } catch (error) {
      console.error(error);
      alert("Failed to download certificate.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex justify-center my-8">
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`px-8 py-4 rounded-xl font-semibold text-white transition ${
          loading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-700 hover:bg-blue-800"
        }`}
      >
        {loading ? "Generating PDF..." : "📄 Download Certificate"}
      </button>
    </div>
  );
}