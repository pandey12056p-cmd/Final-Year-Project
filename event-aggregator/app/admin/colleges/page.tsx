"use client";

import { useEffect, useState } from "react";

type College = {
  id: number;
  name: string;
  code: string;
  officialEmail: string;
  website: string;
  address: string;
  contactDetails: string;
  authorizedPerson: string;
  logo: string | null;
  verificationDoc: string | null;
  status: string;
  rejectReason: string | null;
  createdAt: string;
  user: {
    name: string;
    email: string;
  };
};

export default function AdminCollegesPage() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ALL");
  
  // Dialog / Modal states
  const [modalCollege, setModalCollege] = useState<College | null>(null);
  const [modalAction, setModalAction] = useState<"REJECT" | "REQUEST_INFO" | "SUSPEND" | null>(null);
  const [reasonText, setReasonText] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchColleges();
  }, []);

  async function fetchColleges() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/colleges");
      const data = await res.json();
      if (res.ok && data.success) {
        setColleges(data.colleges);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleApprove(collegeId: number) {
    if (!confirm("Are you sure you want to approve this college profile? They will be allowed to submit and publish events immediately.")) return;

    try {
      const res = await fetch("/api/admin/colleges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ collegeId, action: "APPROVE" }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert("College verified and approved successfully!");
        fetchColleges();
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleActionSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!modalCollege || !modalAction) return;

    setSubmitLoading(true);
    try {
      const res = await fetch("/api/admin/colleges", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeId: modalCollege.id,
          action: modalAction,
          reason: reasonText,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        alert(`College status updated successfully.`);
        setModalCollege(null);
        setModalAction(null);
        setReasonText("");
        fetchColleges();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitLoading(false);
    }
  }

  // Filter
  const filtered = colleges.filter((c) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "PENDING") return c.status === "PENDING_VERIFICATION";
    return c.status === activeTab;
  });

  function getStatusStyle(status: string) {
    switch (status) {
      case "VERIFIED":
        return "bg-green-50 text-green-600 border-green-150";
      case "PENDING_VERIFICATION":
        return "bg-amber-50 text-amber-600 border-amber-150";
      case "REJECTED":
        return "bg-rose-50 text-rose-600 border-rose-150";
      case "SUSPENDED":
        return "bg-rose-50 text-rose-600 border-rose-150";
      default:
        return "bg-slate-50 text-slate-500 border-slate-200";
    }
  }

  return (
    <main className="space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Colleges Verification</h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">Approve, reject, or suspend registered college organizer profiles.</p>
        </div>
        <div className="bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
          Total Institutions: {colleges.length}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        {["ALL", "PENDING", "VERIFIED", "REJECTED", "SUSPENDED"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition ${
              activeTab === tab
                ? "bg-white text-blue-700 shadow-sm border border-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            {tab === "PENDING" ? "Pending Verification" : tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-400 font-bold animate-pulse">
            Loading college lists...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <span className="text-3xl block">🏢</span>
            <h3 className="text-sm font-bold text-slate-800">No colleges found</h3>
            <p className="text-xs text-slate-400 font-semibold">No college profiles match this verification status.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/75 border-b border-slate-200">
              <tr className="text-slate-400 uppercase tracking-widest font-extrabold text-[9px]">
                <th className="px-5 py-3.5">Logo</th>
                <th className="px-5 py-3.5">College Details</th>
                <th className="px-5 py-3.5">Authorized Contact</th>
                <th className="px-5 py-3.5">Verification Doc</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((col) => {
                const isPending = col.status === "PENDING_VERIFICATION";
                const isVerified = col.status === "VERIFIED";
                const isSuspended = col.status === "SUSPENDED";

                return (
                  <tr key={col.id} className="hover:bg-slate-50/30 transition text-xs">
                    {/* Logo */}
                    <td className="px-5 py-4 shrink-0">
                      <div className="w-10 h-10 rounded-xl border border-slate-150 flex items-center justify-center bg-slate-50 overflow-hidden">
                        {col.logo ? (
                          <img src={col.logo} alt="Logo" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-lg">🏢</span>
                        )}
                      </div>
                    </td>

                    {/* Details */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <p className="font-bold text-slate-800">{col.name}</p>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                          Code: {col.code} • Website: <a href={col.website} target="_blank" className="text-blue-600 hover:underline">{col.website.replace(/^https?:\/\//, '')}</a>
                        </span>
                      </div>
                    </td>

                    {/* Contact */}
                    <td className="px-5 py-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-700">{col.authorizedPerson}</p>
                        <span className="text-[10px] text-slate-450 block font-medium">
                          {col.officialEmail} • {col.contactDetails}
                        </span>
                      </div>
                    </td>

                    {/* Document */}
                    <td className="px-5 py-4">
                      {col.verificationDoc ? (
                        <a
                          href={col.verificationDoc}
                          target="_blank"
                          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-2 py-1 rounded font-bold text-[9px] inline-block uppercase"
                        >
                          📄 View Doc
                        </a>
                      ) : (
                        <span className="text-slate-400 font-semibold italic text-[10px]">No file submitted</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider border ${getStatusStyle(col.status)}`}>
                        {col.status === "PENDING_VERIFICATION" ? "Pending" : col.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right space-x-2 whitespace-nowrap">
                      {isPending && (
                        <button
                          onClick={() => handleApprove(col.id)}
                          className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          Approve
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => {
                            setModalCollege(col);
                            setModalAction("REJECT");
                          }}
                          className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          Reject
                        </button>
                      )}

                      {isPending && (
                        <button
                          onClick={() => {
                            setModalCollege(col);
                            setModalAction("REQUEST_INFO");
                          }}
                          className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          Request Info
                        </button>
                      )}

                      {isVerified && (
                        <button
                          onClick={() => {
                            setModalCollege(col);
                            setModalAction("SUSPEND");
                          }}
                          className="bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer transition"
                        >
                          Suspend
                        </button>
                      )}

                      {isSuspended && (
                        <button
                          onClick={() => handleApprove(col.id)}
                          className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 px-2.5 py-1.5 rounded-lg font-bold text-[10px] cursor-pointer"
                        >
                          Re-activate
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal Dialog for Reject/Request Info/Suspend Reasons */}
      {modalCollege && modalAction && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form
            onSubmit={handleActionSubmit}
            className="bg-white rounded-2xl border border-slate-200 w-full max-w-md p-6 shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-sm font-black text-slate-800">
                {modalAction === "REJECT" && "Reject College Request"}
                {modalAction === "REQUEST_INFO" && "Request Profile Info"}
                {modalAction === "SUSPEND" && "Suspend College Account"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setModalCollege(null);
                  setModalAction(null);
                  setReasonText("");
                }}
                className="text-slate-400 hover:text-slate-650 font-bold text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase">Target Institution</h4>
              <p className="text-xs font-bold text-slate-800">{modalCollege.name}</p>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-650 uppercase tracking-widest mb-1.5">
                Reason / Comment Feedback (Required)
              </label>
              <textarea
                required
                rows={3}
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                placeholder="Detail the reason for rejection, suspend status or requested fields..."
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setModalCollege(null);
                  setModalAction(null);
                  setReasonText("");
                }}
                className="border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer hover:bg-slate-50 text-slate-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="bg-blue-650 hover:bg-blue-700 text-white px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                {submitLoading ? "Submitting..." : "Submit Action"}
              </button>
            </div>
          </form>
        </div>
      )}

    </main>
  );
}
