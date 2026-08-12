"use client";

import { useEffect, useState } from "react";
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
        pixelRatio: 3,
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
      console.error("PDF download error:", error);
      alert("Failed to download certificate.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("autoDownload") === "true") {
        // Wait briefly for DOM and QR code to render before triggering download
        const timer = setTimeout(() => {
          handleDownload();
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  return (
    <div className="flex justify-center my-8">
      <button
        onClick={handleDownload}
        disabled={loading}
        className={`px-8 py-4 rounded-xl font-semibold text-white shadow-lg transition ${
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