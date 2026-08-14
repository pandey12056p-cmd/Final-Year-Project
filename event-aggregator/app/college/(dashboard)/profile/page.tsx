"use client";

import { useEffect, useState } from "react";

export default function CollegeProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form Fields
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [authorizedPerson, setAuthorizedPerson] = useState("");
  const [logo, setLogo] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [doc, setDoc] = useState("");
  const [docUploading, setDocUploading] = useState(false);
  const [status, setStatus] = useState("PENDING_VERIFICATION");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const res = await fetch("/api/college/profile");
      const data = await res.json();
      if (res.ok && data.success) {
        const c = data.college;
        setName(c.name || "");
        setCode(c.code || "");
        setOfficialEmail(c.officialEmail || "");
        setWebsite(c.website || "");
        setAddress(c.address || "");
        setContactDetails(c.contactDetails || "");
        setAuthorizedPerson(c.authorizedPerson || "");
        setLogo(c.logo || "");
        setDoc(c.verificationDoc || "");
        setStatus(c.status || "PENDING_VERIFICATION");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "doc") {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    if (type === "logo") setLogoUploading(true);
    else setDocUploading(true);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        if (type === "logo") setLogo(data.url);
        else setDoc(data.url);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      if (type === "logo") setLogoUploading(false);
      else setDocUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError("");

    try {
      const res = await fetch("/api/college/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          website,
          address,
          contactDetails,
          authorizedPerson,
          logo,
          verificationDoc: doc,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        // Refresh local storage if needed or just show success
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.message || "Failed to update profile");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center space-y-3">
          <div className="text-4xl animate-bounce">⏳</div>
          <h1 className="text-lg font-bold text-slate-800">Loading Profile...</h1>
        </div>
      </main>
    );
  }

  return (
    <main className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">College Profile</h1>
        <p className="text-slate-500 text-xs font-semibold mt-0.5">Manage institutional details, branding logos, and dean authorization paperwork.</p>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs font-bold text-center">
          ✅ Profile Details Updated Successfully!
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Form Column */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">Institutional Details</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">College Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">College Code (Read Only)</label>
                <input
                  type="text"
                  disabled
                  value={code}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs bg-slate-50 text-slate-400 font-semibold cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Official Email (Read Only)</label>
                <input
                  type="email"
                  disabled
                  value={officialEmail}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs bg-slate-50 text-slate-400 font-semibold cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Website URL</label>
                <input
                  type="url"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Address / Campus Location</label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Contact Number</label>
                <input
                  type="text"
                  required
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Authorized Dean / Director</label>
                <input
                  type="text"
                  required
                  value={authorizedPerson}
                  onChange={(e) => setAuthorizedPerson(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-semibold"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={saving || logoUploading || docUploading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer"
              >
                {saving ? "Saving Changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Right Assets Column */}
        <div className="space-y-6">
          
          {/* Logo Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 flex flex-col items-center">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2.5 mb-4 w-full text-center">College Logo</h3>
            <div className="w-24 h-24 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center overflow-hidden mb-4 shadow-sm">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🏢</span>
              )}
            </div>
            
            <div className="relative border border-slate-250 hover:bg-slate-50 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-700 cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "logo")}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {logoUploading ? "Uploading logo..." : "Change Logo Image"}
            </div>
          </div>

          {/* Verification Status Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-2.5 w-full text-center">Verification status</h3>
            
            <div className="flex flex-col items-center text-center space-y-2">
              <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${
                status === "VERIFIED"
                  ? "bg-green-50 text-green-600 border-green-150"
                  : status === "REJECTED"
                    ? "bg-rose-50 text-rose-600 border-rose-150"
                    : "bg-amber-50 text-amber-600 border-amber-150"
              }`}>
                {status}
              </span>
              <p className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                {status === "VERIFIED" 
                  ? "Your details are verified. You can publish events for students." 
                  : "Submit dean verification documents to unlock event creation approval."
                }
              </p>
            </div>

            {/* Document Link */}
            {doc && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Uploaded Document</span>
                <a
                  href={doc}
                  target="_blank"
                  className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                >
                  📄 View submitted letter
                </a>
              </div>
            )}

            <div className="relative border border-slate-250 hover:bg-slate-50 rounded-xl px-4 py-2 text-[10px] font-bold text-slate-750 text-center cursor-pointer">
              <input
                type="file"
                accept=".pdf,image/*"
                onChange={(e) => handleFileUpload(e, "doc")}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              {docUploading ? "Uploading doc..." : "Update Verification Document"}
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}
