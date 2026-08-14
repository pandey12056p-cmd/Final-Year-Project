"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CollegeRegisterProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [address, setAddress] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [authorizedPerson, setAuthorizedPerson] = useState("");
  
  // File upload states
  const [logo, setLogo] = useState("");
  const [logoUploading, setLogoUploading] = useState(false);
  const [doc, setDoc] = useState("");
  const [docUploading, setDocUploading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsed = JSON.parse(savedUser);
      setUser(parsed);
      if (parsed.role !== "college") {
        router.push("/dashboard");
      }
      setOfficialEmail(parsed.email || "");
    } else {
      router.push("/login");
    }
  }, [router]);

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
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/college/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          code,
          officialEmail,
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
        setTimeout(() => {
          router.push("/college");
        }, 1500);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      setError("Network or server connection error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-16 px-4 flex items-center justify-center">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden">
        
        {/* Top accent bar */}
        <div className="h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

        <div className="px-8 py-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200">
              <span className="text-3xl">🏢</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">College Profile Registration</h1>
            <p className="text-slate-500 text-sm mt-1.5 font-medium">
              Complete your verification request to start publishing events.
            </p>
          </div>

          {/* Alert Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-5 py-3.5 rounded-2xl text-xs font-bold text-center">
              ⚠️ {error}
            </div>
          )}

          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-5 py-3.5 rounded-2xl text-xs font-bold text-center">
              ✅ Profile Created Successfully! Redirecting to dashboard...
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College Name */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  College / Institution Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. University Institute of Technology"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400 font-medium text-slate-800"
                />
              </div>

              {/* College Code */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  College Code / Registration No
                </label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="e.g. UIT-012"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400 font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Official Email */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Official Email Address
                </label>
                <input
                  type="email"
                  required
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  placeholder="e.g. info@college.edu.in"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400 font-medium text-slate-800"
                />
              </div>

              {/* Website */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Official Website
                </label>
                <input
                  type="url"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. https://www.college.edu.in"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400 font-medium text-slate-800"
                />
              </div>
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                Address / Location
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address of the campus"
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400 font-medium text-slate-800 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Details */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Contact Number
                </label>
                <input
                  type="text"
                  required
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  placeholder="e.g. +91 9876543210"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400 font-medium text-slate-800"
                />
              </div>

              {/* Authorized Person */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Authorized Signatory / Dean Name
                </label>
                <input
                  type="text"
                  required
                  value={authorizedPerson}
                  onChange={(e) => setAuthorizedPerson(e.target.value)}
                  placeholder="e.g. Dr. Ramesh Kumar (Dean)"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition placeholder:text-slate-400 font-medium text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Logo Upload */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  College Logo (PNG / JPG / WEBP)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center bg-slate-50 relative hover:border-slate-350 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, "logo")}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {logo ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{logo.split('/').pop()}</span>
                    </div>
                  ) : logoUploading ? (
                    <span className="text-xs text-blue-600 font-bold animate-pulse">Uploading Logo...</span>
                  ) : (
                    <div className="text-center">
                      <span className="text-xl">🖼️</span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Click to Upload Logo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Document Upload */}
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">
                  Authorization Document (PDF / Image)
                </label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center bg-slate-50 relative hover:border-slate-350 transition">
                  <input
                    type="file"
                    accept=".pdf,image/*"
                    onChange={(e) => handleFileUpload(e, "doc")}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {doc ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl">✅</span>
                      <span className="text-xs font-bold text-slate-700 truncate max-w-[180px]">{doc.split('/').pop()}</span>
                    </div>
                  ) : docUploading ? (
                    <span className="text-xs text-blue-600 font-bold animate-pulse">Uploading Doc...</span>
                  ) : (
                    <div className="text-center">
                      <span className="text-xl">📄</span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Upload Letter or ID card</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || logoUploading || docUploading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white py-3.5 rounded-xl text-sm font-bold tracking-wide shadow-md shadow-blue-500/10 cursor-pointer transition"
              >
                {loading ? "Registering profile..." : "Submit Verification Profile"}
              </button>
              
              <Link
                href="/logout"
                className="text-center text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Sign Out / Cancel
              </Link>
            </div>

          </form>

        </div>
      </div>
    </main>
  );
}
