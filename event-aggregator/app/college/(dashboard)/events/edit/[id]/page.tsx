"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { formatDate } from "@/lib/date";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id;

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [eventOriginal, setEventOriginal] = useState<any>(null);

  // Form Fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Hackathon");
  const [image, setImage] = useState("");
  const [imageUploading, setImageUploading] = useState(false);
  const [description, setDescription] = useState("");
  const [organizer, setOrganizer] = useState("");

  const [date, setDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [mode, setMode] = useState("Offline");
  const [location, setLocation] = useState("");

  const [eligibleColleges, setEligibleColleges] = useState("All Colleges");
  const [eligibleCourses, setEligibleCourses] = useState("All Courses");
  const [eligibleBranches, setEligibleBranches] = useState("All Branches");
  const [eligibleYears, setEligibleYears] = useState("All Years");
  const [maxParticipants, setMaxParticipants] = useState("100");
  const [teamSize, setTeamSize] = useState("Solo");
  const [externalStudentsAllowed, setExternalStudentsAllowed] = useState(true);

  const [registrationDeadline, setRegistrationDeadline] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [registrationFee, setRegistrationFee] = useState("0");
  const [requiredDocuments, setRequiredDocuments] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [officialRegistrationLink, setOfficialRegistrationLink] = useState("");
  const [certificateAvailable, setCertificateAvailable] = useState(false);
  const [prize, setPrize] = useState("Certificates & Swags");
  const [status, setStatus] = useState("DRAFT");

  useEffect(() => {
    if (id) {
      fetchEventDetails();
    }
  }, [id]);

  async function fetchEventDetails() {
    setPageLoading(true);
    try {
      const res = await fetch(`/api/college/events/${id}`);
      const data = await res.json();
      if (res.ok && data.success) {
        const ev = data.event;
        setEventOriginal(ev);
        setTitle(ev.title || "");
        setCategory(ev.category || "Hackathon");
        setImage(ev.image || "");
        setDescription(ev.description || "");
        setOrganizer(ev.organizer || "");
        
        // Format dates for input datetime-local format
        if (ev.date) setDate(new Date(ev.date).toISOString().slice(0, 16));
        if (ev.endDate) setEndDate(new Date(ev.endDate).toISOString().slice(0, 16));
        if (ev.registrationDeadline) setRegistrationDeadline(new Date(ev.registrationDeadline).toISOString().slice(0, 16));

        setMode(ev.mode || "Offline");
        setLocation(ev.location || "");
        setEligibleColleges(ev.eligibleColleges || "All Colleges");
        setEligibleCourses(ev.eligibleCourses || "All Courses");
        setEligibleBranches(ev.eligibleBranches || "All Branches");
        setEligibleYears(ev.eligibleYears || "All Years");
        setMaxParticipants(String(ev.maxParticipants || 100));
        setTeamSize(ev.teamSize || "Solo");
        setExternalStudentsAllowed(ev.externalStudentsAllowed ?? true);
        setIsPaid(ev.isPaid ?? false);
        setRegistrationFee(String(ev.registrationFee || 0));
        setRequiredDocuments(ev.requiredDocuments || "");
        setTermsAndConditions(ev.termsAndConditions || "");
        setContactDetails(ev.contactDetails || "");
        setOfficialRegistrationLink(ev.officialRegistrationLink || "");
        setCertificateAvailable(ev.certificateAvailable ?? false);
        setPrize(ev.prize || "Certificates & Swags");
        setStatus(ev.status || "DRAFT");
      } else {
        setError(data.message || "Failed to load event details");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch event data.");
    } finally {
      setPageLoading(false);
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const formData = new FormData();
    formData.append("file", file);

    setImageUploading(true);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setImage(data.url);
      } else {
        alert(data.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setImageUploading(false);
    }
  }

  async function handleUpdate(requestedStatus: string) {
    if (!title.trim()) {
      setError("Event Title is required (Step 1).");
      setCurrentStep(1);
      return;
    }

    if (requestedStatus === "PENDING_APPROVAL") {
      if (!description.trim()) {
        setError("Please enter a detailed Event Description (Step 1).");
        setCurrentStep(1);
        return;
      }
      if (!image) {
        setError("Please upload an Event Poster Image (Step 1) or save as draft first.");
        setCurrentStep(1);
        return;
      }
      if (!date) {
        setError("Please enter the Event Start Date & Time (Step 2).");
        setCurrentStep(2);
        return;
      }
      if (!location.trim()) {
        setError("Please enter the Venue Location or online URL (Step 2).");
        setCurrentStep(2);
        return;
      }
      if (!registrationDeadline) {
        setError("Please set the Registration Deadline Date & Time (Step 4).");
        setCurrentStep(4);
        return;
      }
    }

    setLoading(true);
    setError("");

    const data = {
      title,
      category,
      image,
      description,
      location,
      mode,
      organizer,
      date,
      endDate: endDate || null,
      registrationDeadline,
      maxParticipants: Number(maxParticipants) || 100,
      prize,
      teamSize,
      status: requestedStatus,
      eligibleColleges,
      eligibleCourses,
      eligibleBranches,
      eligibleYears,
      externalStudentsAllowed,
      isPaid,
      registrationFee: isPaid ? Number(registrationFee) : 0,
      requiredDocuments,
      termsAndConditions,
      contactDetails,
      officialRegistrationLink,
      certificateAvailable,
    };

    try {
      const res = await fetch(`/api/college/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (res.ok && result.success) {
        setSuccess(true);
        if (result.requiresReapproval) {
          alert("Your changes contain critical updates. The event has been sent back for admin re-approval and is hidden from students in the meantime.");
        }
        setTimeout(() => {
          router.push("/college/events");
        }, 1200);
      } else {
        setError(result.message || "Failed to update event");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed.");
    } finally {
      setLoading(false);
    }
  }

  // Check if critical fields differ from original to warn the user
  function checkCriticalChanges() {
    if (!eventOriginal) return false;
    const isOrigApproved = ["APPROVED", "Upcoming", "Ongoing"].includes(eventOriginal.status);
    if (!isOrigApproved) return false;

    const dateEqual = (d1: string, d2: string) => {
      if (!d1 && !d2) return true;
      if (!d1 || !d2) return false;
      return new Date(d1).getTime() === new Date(d2).getTime();
    };

    return (
      title !== eventOriginal.title ||
      !dateEqual(date, eventOriginal.date) ||
      !dateEqual(endDate, eventOriginal.endDate) ||
      location !== eventOriginal.location ||
      isPaid !== eventOriginal.isPaid ||
      Number(registrationFee) !== eventOriginal.registrationFee ||
      officialRegistrationLink !== eventOriginal.officialRegistrationLink ||
      eligibleColleges !== eventOriginal.eligibleColleges ||
      eligibleCourses !== eventOriginal.eligibleCourses ||
      eligibleBranches !== eventOriginal.eligibleBranches ||
      eligibleYears !== eventOriginal.eligibleYears ||
      organizer !== eventOriginal.organizer
    );
  }

  const hasCriticalChanges = checkCriticalChanges();

  if (pageLoading) {
    return (
      <main className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center space-y-3">
          <div className="text-4xl animate-bounce">⏳</div>
          <h1 className="text-lg font-bold text-slate-800">Loading Event Details...</h1>
        </div>
      </main>
    );
  }

  const steps = [
    { num: 1, label: "Basic Info" },
    { num: 2, label: "Date & Venue" },
    { num: 3, label: "Eligibility" },
    { num: 4, label: "Registration" },
  ];

  return (
    <main className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Edit Event</h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">Modify details for: <span className="font-extrabold text-slate-800">"{eventOriginal?.title}"</span></p>
        </div>
        <Link
          href="/college/events"
          className="text-slate-500 text-xs font-bold hover:text-slate-800 transition"
        >
          ← Back to List
        </Link>
      </div>

      {/* Warnings */}
      {hasCriticalChanges && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 p-4 rounded-xl text-xs font-bold leading-relaxed shadow-sm">
          ⚠️ **IMPORTANT SECURITY NOTICE:** You are changing a critical field (Name, Date, Venue, Fee, Eligibility, or Organizer) on an already approved event. Saving changes will automatically reset the event's approval status to **PENDING_APPROVAL** and hide it from students until an administrator re-approves the edits.
        </div>
      )}

      {/* Step Indicator */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
        {steps.map((s, idx) => (
          <div key={s.num} className="flex items-center flex-1 last:flex-initial">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs transition ${
                currentStep === s.num
                  ? "bg-blue-600 text-white"
                  : currentStep > s.num
                    ? "bg-emerald-500 text-white"
                    : "bg-slate-100 text-slate-400"
              }`}>
                {currentStep > s.num ? "✓" : s.num}
              </div>
              <span className={`text-xs font-bold ${
                currentStep === s.num ? "text-slate-800" : "text-slate-400"
              }`}>{s.label}</span>
            </div>
            {idx < steps.length - 1 && (
              <div className="h-0.5 bg-slate-100 flex-1 mx-4 min-w-[20px]" />
            )}
          </div>
        ))}
      </div>

      {/* Alert alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-bold">
          ⚠️ {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-xs font-bold text-center">
          ✅ Event Updated Successfully! Redirecting...
        </div>
      )}

      {/* Form Steps Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
        
        {/* Step 1: Basic Info */}
        {currentStep === 1 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 1 — Basic Event Information</h3>
            
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Event Name / Title</label>
              <input
                required
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. CodeStorm Hackathon 2026"
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                >
                  <option>Hackathon</option>
                  <option>Workshop</option>
                  <option>Seminar</option>
                  <option>Sports</option>
                  <option>Cultural</option>
                  <option>Placement Drive</option>
                  <option>General</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Organizer / Department</label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. Computer Science & IT Society"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>
            </div>

            {/* Poster Upload */}
            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Event Poster Image</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div className="md:col-span-2 border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center bg-slate-50 relative hover:border-slate-350 transition">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {image ? (
                    <span className="text-xs font-bold text-emerald-600">✅ File uploaded successfully!</span>
                  ) : imageUploading ? (
                    <span className="text-xs text-blue-600 font-bold animate-pulse">Uploading Image...</span>
                  ) : (
                    <div className="text-center">
                      <span className="text-2xl">🖼️</span>
                      <p className="text-[10px] text-slate-400 font-semibold mt-1">Select Event Poster (MIME: JPG, PNG)</p>
                    </div>
                  )}
                </div>
                <div className="h-28 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                  {image ? (
                    <img src={image} alt="Poster preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-slate-400 font-semibold">Preview</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Detailed Description</label>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Details of the event, itinerary, tracks, prizes, and instructions..."
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 2: Date & Venue */}
        {currentStep === 2 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 2 — Dates & Venue Specification</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Start Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Event Mode</label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value)}
                  className="border border-slate-200 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                >
                  <option>Offline</option>
                  <option>Online</option>
                  <option>Hybrid</option>
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Venue / URL</label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Lab 2, UIT Campus OR Zoom Link URL"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Eligibility */}
        {currentStep === 3 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 3 — Eligibility & Team Parameters</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Eligible Colleges</label>
                <input
                  type="text"
                  value={eligibleColleges}
                  onChange={(e) => setEligibleColleges(e.target.value)}
                  placeholder="e.g. All Colleges, or specify UIT only"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Eligible Courses</label>
                <input
                  type="text"
                  value={eligibleCourses}
                  onChange={(e) => setEligibleCourses(e.target.value)}
                  placeholder="e.g. B.Tech, BCA, MCA"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Eligible Branches</label>
                <input
                  type="text"
                  value={eligibleBranches}
                  onChange={(e) => setEligibleBranches(e.target.value)}
                  placeholder="e.g. CSE, IT, ECE"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Eligible Years</label>
                <input
                  type="text"
                  value={eligibleYears}
                  onChange={(e) => setEligibleYears(e.target.value)}
                  placeholder="e.g. 2nd, 3rd, 4th Year"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Max Seat Capacity</label>
                <input
                  type="number"
                  value={maxParticipants}
                  onChange={(e) => setMaxParticipants(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Team Size Format</label>
                <input
                  type="text"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="e.g. Solo, 2-4 Members, Solo or Duo"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-col justify-center">
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={externalStudentsAllowed}
                    onChange={(e) => setExternalStudentsAllowed(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500"
                  />
                  External Students Allowed
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Registration */}
        {currentStep === 4 && (
          <div className="space-y-5">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-100 pb-2">Step 4 — Registration details, fees, and links</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Registration Deadline</label>
                <input
                  type="datetime-local"
                  required
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Official Registration URL Link</label>
                <input
                  type="url"
                  value={officialRegistrationLink}
                  onChange={(e) => setOfficialRegistrationLink(e.target.value)}
                  placeholder="External link if registering outside"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col p-4 bg-slate-50 border border-slate-150 rounded-2xl justify-center space-y-3">
                <div className="text-xs font-bold text-slate-700">Participation Fee Structure</div>
                <div className="flex items-center gap-5">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isPaid}
                      onChange={() => setIsPaid(false)}
                      className="w-4 h-4 text-blue-600"
                    />
                    Free Event
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
                    <input
                      type="radio"
                      checked={isPaid}
                      onChange={() => setIsPaid(true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    Paid Event
                  </label>
                </div>
              </div>

              {isPaid && (
                <div className="flex flex-col justify-end">
                  <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Registration Fee (₹)</label>
                  <input
                    type="number"
                    value={registrationFee}
                    onChange={(e) => setRegistrationFee(e.target.value)}
                    placeholder="Enter fee amount"
                    className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Required Documents</label>
                <input
                  type="text"
                  value={requiredDocuments}
                  onChange={(e) => setRequiredDocuments(e.target.value)}
                  placeholder="e.g. College ID Card, Consent Letter"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Prize / Rewards Pool Details</label>
                <input
                  type="text"
                  value={prize}
                  onChange={(e) => setPrize(e.target.value)}
                  placeholder="e.g. ₹50,000 Cash Prize or Swags"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Terms / Guidelines Summary</label>
                <input
                  type="text"
                  value={termsAndConditions}
                  onChange={(e) => setTermsAndConditions(e.target.value)}
                  placeholder="e.g. Bring own laptops, ID verification must"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-1.5">Organizing Contacts Details</label>
                <input
                  type="text"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  placeholder="e.g. John (987654321), Society mail"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-slate-800 font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col justify-center pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={certificateAvailable}
                  onChange={(e) => setCertificateAvailable(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-350 rounded focus:ring-blue-500"
                />
                QR Verifiable Certificate Issued Post-Event
              </label>
            </div>
          </div>
        )}

        {/* Step Actions Footer */}
        <div className="border-t border-slate-100 pt-5 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-3 w-full sm:w-auto">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 sm:flex-none border border-slate-250 hover:bg-slate-50 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition text-slate-700"
              >
                ← Back
              </button>
            )}
            
            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow-md shadow-blue-500/10"
              >
                Next Step →
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowPreview(true)}
                className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow-md shadow-indigo-500/10"
              >
                👁️ Preview Event
              </button>
            )}
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <button
              type="button"
              disabled={loading}
              onClick={() => handleUpdate(status === "APPROVED" || status === "Upcoming" || status === "Ongoing" ? status : "DRAFT")}
              className="flex-1 sm:flex-none border border-slate-250 hover:bg-slate-50 text-slate-750 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition"
            >
              💾 Save Changes
            </button>
            {status !== "APPROVED" && status !== "Upcoming" && status !== "Ongoing" && (
              <button
                type="button"
                disabled={loading}
                onClick={() => handleUpdate("PENDING_APPROVAL")}
                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition shadow-md shadow-emerald-500/10"
              >
                {loading ? "Submitting..." : "Submit for Approval"}
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Preview Dialog Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 overflow-y-auto p-4 flex items-center justify-center">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-4xl p-6 md:p-8 shadow-2xl relative space-y-6">
            <button
              onClick={() => setShowPreview(false)}
              className="absolute right-5 top-5 bg-slate-100 hover:bg-slate-200 text-slate-500 p-2 rounded-full cursor-pointer transition"
            >
              ✕
            </button>
            
            <div className="text-center border-b border-slate-100 pb-3">
              <span className="bg-indigo-50 text-indigo-700 border border-indigo-150 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider">
                Event Detail Page Mockup Preview
              </span>
              <h2 className="text-base font-black text-slate-800 mt-1">Check how students see your event card</h2>
            </div>

            <div className="grid md:grid-cols-12 gap-6 items-start">
              {/* Image */}
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-xs">
                <img
                  src={image || "https://images.unsplash.com/photo-1540575467063-178a50c2df87"}
                  alt="Poster Preview"
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                  {category}
                </span>
              </div>

              {/* Summary */}
              <div className="md:col-span-7 space-y-3.5 text-xs">
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-600 text-white font-bold px-2 py-0.5 rounded text-[8px] uppercase">
                    Upcoming (Mockup)
                  </span>
                  {certificateAvailable && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 font-bold px-2 py-0.5 rounded text-[8px]">
                      📜 Verified Certificate
                    </span>
                  )}
                </div>
                
                <h1 className="text-xl md:text-2xl font-black text-slate-900">{title || "Untitled Event"}</h1>
                <p className="text-slate-500 leading-relaxed text-[11px] line-clamp-3">{description || "No description provided yet."}</p>
                
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-150 font-semibold text-slate-700">
                  <div>📅 {date ? formatDate(date) : "Not set"}</div>
                  <div>📍 {location || "Not set"}</div>
                  <div>💻 Mode: {mode}</div>
                  <div>🏢 By {organizer || "Organizer name"}</div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 text-xs pt-4 border-t border-slate-100">
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Registration Cost</span>
                <p className="font-extrabold text-slate-800">{isPaid ? `Paid: ₹${registrationFee}` : "Free Event"}</p>
              </div>
              <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase">Eligibility Courses / Years</span>
                <p className="font-extrabold text-slate-800">{eligibleCourses} • {eligibleYears}</p>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
}
