"use client";

import { useCallback } from "react";

type MonthlyData = { month: string; count: number };
type CategoryData = { name: string; value: number };
type EventData = { eventTitle: string; category: string; registrations: number };

type Props = {
  monthlyData: MonthlyData[];
  categories: CategoryData[];
  events: EventData[];
  totalUsers: number;
  totalEvents: number;
  totalRegistrations: number;
};

// ── CSV Export ───────────────────────────────────────────────────────────────
function downloadCSV(
  monthlyData: MonthlyData[],
  categories: CategoryData[],
  events: EventData[],
  totalUsers: number,
  totalEvents: number,
  totalRegistrations: number
) {
  const lines: string[] = [];

  lines.push("SUMMARY");
  lines.push(`Total Users,${totalUsers}`);
  lines.push(`Total Events,${totalEvents}`);
  lines.push(`Total Registrations,${totalRegistrations}`);
  lines.push("");

  lines.push("MONTHLY REGISTRATIONS");
  lines.push("Month,Count");
  monthlyData.forEach((d) => lines.push(`${d.month},${d.count}`));
  lines.push("");

  lines.push("CATEGORY DISTRIBUTION");
  lines.push("Category,Events");
  categories.forEach((c) => lines.push(`${c.name},${c.value}`));
  lines.push("");

  lines.push("EVENT PERFORMANCE");
  lines.push("Rank,Event,Category,Registrations");
  events.forEach((e, i) =>
    lines.push(`${i + 1},"${e.eventTitle}",${e.category},${e.registrations}`)
  );

  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "event-aggregator-report.csv";
  a.click();
  URL.revokeObjectURL(url);
}

// ── Excel Export (XLSX via SheetJS) ──────────────────────────────────────────
async function downloadExcel(
  monthlyData: MonthlyData[],
  categories: CategoryData[],
  events: EventData[],
  totalUsers: number,
  totalEvents: number,
  totalRegistrations: number
) {
  const XLSX = await import("xlsx");

  const wb = XLSX.utils.book_new();

  // Summary sheet
  const summaryData = [
    ["Metric", "Value"],
    ["Total Users", totalUsers],
    ["Total Events", totalEvents],
    ["Total Registrations", totalRegistrations],
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(summaryData), "Summary");

  // Monthly sheet
  const monthlyRows = [["Month", "Registrations"], ...monthlyData.map((d) => [d.month, d.count])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(monthlyRows), "Monthly Registrations");

  // Category sheet
  const catRows = [["Category", "Events"], ...categories.map((c) => [c.name, c.value])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(catRows), "Category Distribution");

  // Events sheet
  const evtRows = [
    ["Rank", "Event", "Category", "Registrations"],
    ...events.map((e, i) => [i + 1, e.eventTitle, e.category, e.registrations]),
  ];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(evtRows), "Event Performance");

  XLSX.writeFile(wb, "event-aggregator-report.xlsx");
}

// ── PDF Export (jsPDF) ────────────────────────────────────────────────────────
async function downloadPDF(
  monthlyData: MonthlyData[],
  categories: CategoryData[],
  events: EventData[],
  totalUsers: number,
  totalEvents: number,
  totalRegistrations: number
) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageW = doc.internal.pageSize.getWidth();
  let y = 18;

  // ── Title ──
  doc.setFontSize(18);
  doc.setTextColor(29, 78, 216);
  doc.setFont("helvetica", "bold");
  doc.text("Event Aggregator — Reports", pageW / 2, y, { align: "center" });
  y += 8;
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on ${new Date().toLocaleDateString("en-IN")}`, pageW / 2, y, { align: "center" });
  y += 10;

  // ── Summary ──
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, y);
  y += 6;

  const summaryRows = [
    ["Total Users", String(totalUsers)],
    ["Total Events", String(totalEvents)],
    ["Total Registrations", String(totalRegistrations)],
  ];
  summaryRows.forEach(([label, val]) => {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);
    doc.text(label, 18, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(val, 80, y);
    y += 6;
  });
  y += 4;

  // ── Monthly ──
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.text("Monthly Registrations", 14, y);
  y += 6;

  // Table header
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y - 4, 80, 6, "F");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("Month", 16, y);
  doc.text("Registrations", 60, y);
  y += 4;

  monthlyData.forEach((d) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.text(d.month, 16, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(String(d.count), 60, y);
    y += 5;
  });
  y += 4;

  // ── Category ──
  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.text("Category Distribution", 14, y);
  y += 6;

  doc.setFillColor(226, 232, 240);
  doc.rect(14, y - 4, 80, 6, "F");
  doc.setFontSize(8);
  doc.setTextColor(51, 65, 85);
  doc.text("Category", 16, y);
  doc.text("Events", 60, y);
  y += 4;

  categories.forEach((c) => {
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.setFontSize(8);
    doc.text(c.name, 16, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(String(c.value), 60, y);
    y += 5;
  });
  y += 4;

  // ── Event Table ──
  if (y > 240) {
    doc.addPage();
    y = 18;
  }

  doc.setFontSize(11);
  doc.setTextColor(30, 41, 59);
  doc.setFont("helvetica", "bold");
  doc.text("Event Performance", 14, y);
  y += 6;

  doc.setFillColor(51, 65, 85);
  doc.rect(14, y - 4, 180, 6, "F");
  doc.setFontSize(8);
  doc.setTextColor(255, 255, 255);
  doc.text("Rank", 16, y);
  doc.text("Event", 30, y);
  doc.text("Category", 120, y);
  doc.text("Reg.", 165, y);
  y += 4;

  events.forEach((e, i) => {
    if (y > 270) {
      doc.addPage();
      y = 18;
    }
    const bg = i % 2 === 0 ? [248, 250, 252] : [255, 255, 255];
    doc.setFillColor(bg[0], bg[1], bg[2]);
    doc.rect(14, y - 4, 180, 5.5, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(71, 85, 105);
    doc.text(`#${i + 1}`, 16, y);
    doc.setTextColor(30, 41, 59);
    doc.text(e.eventTitle.length > 35 ? e.eventTitle.slice(0, 33) + "…" : e.eventTitle, 30, y);
    doc.setTextColor(71, 85, 105);
    doc.text(e.category, 120, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74);
    doc.text(String(e.registrations), 165, y);
    y += 5.5;
  });

  doc.save("event-aggregator-report.pdf");
}

// ── Print ────────────────────────────────────────────────────────────────────
function printReport() {
  window.print();
}

// ── Component ────────────────────────────────────────────────────────────────
export default function ExportButtons({
  monthlyData,
  categories,
  events,
  totalUsers,
  totalEvents,
  totalRegistrations,
}: Props) {
  const handleCSV = useCallback(() => {
    downloadCSV(monthlyData, categories, events, totalUsers, totalEvents, totalRegistrations);
  }, [monthlyData, categories, events, totalUsers, totalEvents, totalRegistrations]);

  const handleExcel = useCallback(async () => {
    await downloadExcel(monthlyData, categories, events, totalUsers, totalEvents, totalRegistrations);
  }, [monthlyData, categories, events, totalUsers, totalEvents, totalRegistrations]);

  const handlePDF = useCallback(async () => {
    await downloadPDF(monthlyData, categories, events, totalUsers, totalEvents, totalRegistrations);
  }, [monthlyData, categories, events, totalUsers, totalEvents, totalRegistrations]);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5">

      <h2 className="text-sm font-bold text-slate-700 mb-1">
        Export Reports
      </h2>
      <p className="text-[10px] text-slate-400 font-medium mb-4">
        Download the full report in your preferred format
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">

        <button
          onClick={handleCSV}
          className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:scale-95 transition-all text-white rounded-xl py-2.5 text-xs font-bold cursor-pointer shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          CSV
        </button>

        <button
          onClick={handleExcel}
          className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 active:scale-95 transition-all text-white rounded-xl py-2.5 text-xs font-bold cursor-pointer shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Excel
        </button>

        <button
          onClick={handlePDF}
          className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white rounded-xl py-2.5 text-xs font-bold cursor-pointer shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          PDF
        </button>

        <button
          onClick={printReport}
          className="flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-800 active:scale-95 transition-all text-white rounded-xl py-2.5 text-xs font-bold cursor-pointer shadow-sm"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print
        </button>

      </div>

    </div>
  );
}