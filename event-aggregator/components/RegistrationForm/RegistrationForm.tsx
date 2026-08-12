"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/date";

type Props = {
  eventId: number;
  eventTitle: string;
  category?: string;
  date?: string;
  mode?: string;
  location?: string;
  organizer?: string;
  teamSize?: string;
  certificateAvailable?: boolean;
  registrationDeadline?: string;
  isExpired?: boolean;
  isFull?: boolean;
};

const AVAILABLE_SKILLS = [
  "Java", "Python", "C++", "JavaScript", "TypeScript",
  "React", "Next.js", "Node.js", "SQL", "Spring Boot",
  "Docker", "Git", "HTML/CSS", "Flutter", "Machine Learning"
];

export default function RegistrationForm({
  eventId,
  eventTitle,
  category = "General",
  date,
  mode = "Offline",
  location = "Campus Auditorium",
  organizer = "Event Aggregator",
  teamSize = "1 Person",
  certificateAvailable = true,
  registrationDeadline,
  isExpired = false,
  isFull = false,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState<string | number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Checkbox Declarations
  const [declarationInfo, setDeclarationInfo] = useState(false);
  const [declarationRules, setDeclarationRules] = useState(false);
  const [declarationConsent, setDeclarationConsent] = useState(false);

  // Technical Skills Multi-Select
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // Team Members List for Team Events
  const [teamMembers, setTeamMembers] = useState<{ name: string; emailOrId: string }[]>([
    { name: "", emailOrId: "" },
  ]);

  const isTeamEventByDef = teamSize.toLowerCase().includes("team") || teamSize.includes("2") || teamSize.includes("3") || teamSize.includes("4");

  const [formDataState, setFormDataState] = useState({
    fullName: "",
    email: "",
    phone: "",
    studentId: "",
    gender: "Prefer not to say",

    college: "",
    branch: "",
    year: "",
    semester: "Semester 5",
    specialization: "",
    cgpa: "",

    participationType: isTeamEventByDef ? "Team" : "Individual",
    teamName: "",

    reason: "",

    previousExperience: "Some Experience",
    relevantSkills: "",
    portfolioUrl: "",
    githubUrl: "",
    linkedinUrl: "",

    emergencyContactName: "",
    emergencyContactRelation: "Parent",
    emergencyContactPhone: "",

    dietaryPreference: "Not Applicable",
    tshirtSize: "M",
    accessibilityNeeds: "",
  });

  useEffect(() => {
    async function loadStudentData() {
      // 1. Check if already registered
      try {
        const res = await fetch("/api/my-registrations");
        const data = await res.json();
        if (res.ok && data.registrations) {
          const existing = data.registrations.find((r: any) => r.eventId === eventId);
          if (existing) {
            setAlreadyRegistered(true);
            setRegistrationId(existing.id);
          }
        }
      } catch (e) {
        console.error(e);
      }

      // 2. Fetch logged-in student profile for AUTOFILL
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (res.ok && data.user) {
          setFormDataState((prev) => ({
            ...prev,
            fullName: data.user.name || "",
            email: data.user.email || "",
            studentId: data.user.studentId || "",
            phone: data.user.phone || "",
            college: data.user.college || "",
            branch: data.user.branch || "",
            year: data.user.year || "",
            githubUrl: data.user.githubUrl || "",
            linkedinUrl: data.user.linkedinUrl || "",
            portfolioUrl: data.user.portfolioUrl || "",
          }));

          if (data.user.skills) {
            const userSkillsArr = data.user.skills.split(",").map((s: string) => s.trim());
            setSelectedSkills(userSkillsArr.filter((s: string) => s.length > 0));
          }
        }
      } catch (e) {
        console.error(e);
      }
    }

    loadStudentData();
  }, [eventId]);

  function toggleSkill(skill: string) {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  }

  function addTeamMember() {
    setTeamMembers([...teamMembers, { name: "", emailOrId: "" }]);
  }

  function removeTeamMember(idx: number) {
    setTeamMembers(teamMembers.filter((_, i) => i !== idx));
  }

  function updateTeamMember(idx: number, field: "name" | "emailOrId", value: string) {
    const updated = [...teamMembers];
    updated[idx][field] = value;
    setTeamMembers(updated);
  }

  function validateForm(): boolean {
    const errors: Record<string, string> = {};

    if (!formDataState.fullName.trim()) errors.fullName = "Full Name is required.";
    if (!formDataState.email.trim() || !formDataState.email.includes("@")) errors.email = "Valid Email Address is required.";
    if (!formDataState.phone.trim() || formDataState.phone.trim().length < 10) errors.phone = "Valid 10-digit Phone Number is required.";

    if (!formDataState.college.trim()) errors.college = "College Name is required.";
    if (!formDataState.branch.trim()) errors.branch = "Branch/Stream is required.";
    if (!formDataState.year) errors.year = "Academic Year is required.";

    if (formDataState.participationType === "Team" && !formDataState.teamName.trim()) {
      errors.teamName = "Team Name is required for Team Participation.";
    }

    if (!formDataState.reason.trim() || formDataState.reason.trim().length < 10) {
      errors.reason = "Participation reason must be at least 10 characters.";
    }

    if (formDataState.cgpa && (Number(formDataState.cgpa) < 0 || Number(formDataState.cgpa) > 100)) {
      errors.cgpa = "Enter valid CGPA (0-10) or Percentage (0-100).";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateForm()) {
      setErrorMessage("Please correct the errors in the form before submitting.");
      return;
    }

    if (!declarationInfo || !declarationRules || (certificateAvailable && !declarationConsent)) {
      setErrorMessage("Please accept all required declarations.");
      return;
    }

    if (isExpired || isFull) {
      setErrorMessage(isExpired ? "Registration for this event has closed." : "Registration is full for this event.");
      return;
    }

    const payload = {
      eventId,
      eventTitle,
      ...formDataState,
      technicalSkills: selectedSkills.join(", "),
      teamMembers: formDataState.participationType === "Team" ? JSON.stringify(teamMembers) : null,
      declarationAccepted: declarationInfo,
      rulesAccepted: declarationRules,
      certificateConsent: declarationConsent,
    };

    try {
      setLoading(true);

      const response = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setAlreadyRegistered(true);
        setRegistrationId(result.registration?.id || `#REG-${Math.floor(100000 + Math.random() * 900000)}`);
      } else {
        setErrorMessage(result.message || "Registration failed. Please verify your details.");
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetReminder() {
    try {
      await fetch("/api/reminders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      alert("✅ Event reminder added to your notifications!");
    } catch (e) {
      console.error(e);
    }
  }

  const allDeclarationsAccepted = declarationInfo && declarationRules && (!certificateAvailable || declarationConsent);

  return (
    <section className="max-w-5xl mx-auto my-6">
      <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden">

        {/* 1. REGISTRATION PORTAL HEADER */}
        <div className="bg-gradient-to-r from-[#0b132b] via-indigo-950 to-slate-900 text-white p-6 md:p-8 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="bg-blue-500/20 text-blue-200 text-[10px] font-black px-3 py-1 rounded-full border border-blue-400/20 uppercase tracking-wider">
                {category} • Official Registration Portal
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                {eventTitle}
              </h2>
              <p className="text-slate-300 text-xs mt-0.5">
                Complete your details to reserve your official seat.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur border border-white/10 p-3 rounded-2xl text-[11px] text-slate-200 space-y-0.5 shrink-0">
              {date && <p>📅 <strong>Date:</strong> {formatDate(date)}</p>}
              <p>📍 <strong>Mode:</strong> {mode} ({location})</p>
              <p>🏢 <strong>Organizer:</strong> {organizer}</p>
              <p>👥 <strong>Allowed Team Size:</strong> {teamSize}</p>
            </div>
          </div>
        </div>

        {/* SUCCESS CONFIRMATION TICKET VIEW */}
        {alreadyRegistered ? (
          <div className="p-8 md:p-12 text-center space-y-6 bg-gradient-to-b from-emerald-50/60 to-white">
            <div className="inline-flex h-20 w-20 rounded-full bg-emerald-100 text-emerald-600 items-center justify-center text-4xl shadow-md border border-emerald-200 animate-bounce">
              🎉
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest bg-emerald-200/60 px-3 py-1 rounded-full">
                Seat Confirmed
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
                Registration Successful!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                You are officially registered for <strong>{eventTitle}</strong>.
              </p>
            </div>

            {/* Official Registration Ticket Summary */}
            <div className="max-w-lg mx-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-md text-left space-y-2.5 text-xs">
              <div className="flex justify-between border-b border-slate-100 pb-2">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Registration ID:</span>
                <span className="font-mono font-black text-blue-700">#REG-{registrationId || "SUCCESS"}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-slate-700">
                <p><strong className="text-slate-400">Student Name:</strong> {formDataState.fullName}</p>
                <p><strong className="text-slate-400">Participation:</strong> {formDataState.participationType}</p>
                {formDataState.teamName && <p><strong className="text-slate-400">Team Name:</strong> {formDataState.teamName}</p>}
                <p><strong className="text-slate-400">Venue:</strong> {mode} ({location})</p>
              </div>
              {date && (
                <div className="flex justify-between border-t border-slate-100 pt-2">
                  <span className="text-slate-500">Event Date:</span>
                  <span className="font-bold text-slate-900">{formatDate(date)}</span>
                </div>
              )}
            </div>

            {/* Success Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href="/dashboard/registrations"
                className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-extrabold px-6 py-3 rounded-2xl shadow transition"
              >
                📋 View My Registrations
              </Link>

              <button
                onClick={handleSetReminder}
                className="bg-purple-700 hover:bg-purple-800 text-white text-xs font-extrabold px-6 py-3 rounded-2xl shadow transition flex items-center gap-1.5"
              >
                <span>📅</span> Add Reminder
              </button>

              <Link
                href="/dashboard"
                className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-6 py-3 rounded-2xl border border-slate-300 transition"
              >
                🏠 Back to Dashboard
              </Link>
            </div>
          </div>
        ) : (
          /* MULTI-SECTION COMPLETE FORM BODY */
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

            {errorMessage && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 font-semibold">
                ⚠️ {errorMessage}
              </div>
            )}

            {/* SECTION 1: STUDENT IDENTIFICATION */}
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <span>👤</span> Section 1: Student Identification
                </h3>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  ✨ Auto-filled from profile
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Full Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={formDataState.fullName}
                    onChange={(e) => setFormDataState({ ...formDataState, fullName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.fullName && <p className="text-[10px] text-red-600 font-bold mt-0.5">{fieldErrors.fullName}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address <span className="text-red-500">*</span></label>
                  <input
                    type="email"
                    required
                    value={formDataState.email}
                    onChange={(e) => setFormDataState({ ...formDataState, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.email && <p className="text-[10px] text-red-600 font-bold mt-0.5">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={formDataState.phone}
                    onChange={(e) => setFormDataState({ ...formDataState, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.phone && <p className="text-[10px] text-red-600 font-bold mt-0.5">{fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Student ID / Enrollment No</label>
                  <input
                    value={formDataState.studentId}
                    onChange={(e) => setFormDataState({ ...formDataState, studentId: e.target.value })}
                    placeholder="e.g. EN20248921"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formDataState.gender}
                    onChange={(e) => setFormDataState({ ...formDataState, gender: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>
            </div>

            {/* SECTION 2: ACADEMIC DETAILS */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span>🏫</span> Section 2: Academic Details
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">College / Institution <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={formDataState.college}
                    onChange={(e) => setFormDataState({ ...formDataState, college: e.target.value })}
                    placeholder="College Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.college && <p className="text-[10px] text-red-600 font-bold mt-0.5">{fieldErrors.college}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Branch / Stream <span className="text-red-500">*</span></label>
                  <input
                    required
                    value={formDataState.branch}
                    onChange={(e) => setFormDataState({ ...formDataState, branch: e.target.value })}
                    placeholder="e.g. CSE"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.branch && <p className="text-[10px] text-red-600 font-bold mt-0.5">{fieldErrors.branch}</p>}
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Academic Year <span className="text-red-500">*</span></label>
                  <select
                    required
                    value={formDataState.year}
                    onChange={(e) => setFormDataState({ ...formDataState, year: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Semester</label>
                  <select
                    value={formDataState.semester}
                    onChange={(e) => setFormDataState({ ...formDataState, semester: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                      <option key={s} value={`Semester ${s}`}>Semester {s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Specialization (Optional)</label>
                  <input
                    value={formDataState.specialization}
                    onChange={(e) => setFormDataState({ ...formDataState, specialization: e.target.value })}
                    placeholder="e.g. AI/ML, Cloud, Web"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Current CGPA / Percentage</label>
                  <input
                    value={formDataState.cgpa}
                    onChange={(e) => setFormDataState({ ...formDataState, cgpa: e.target.value })}
                    placeholder="e.g. 8.5 CGPA or 85%"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.cgpa && <p className="text-[10px] text-red-600 font-bold mt-0.5">{fieldErrors.cgpa}</p>}
                </div>
              </div>

              {/* Technical Skills Tag Multi-Select */}
              <div className="pt-2">
                <label className="block text-[11px] font-bold text-slate-700 mb-1.5">Technical Skills (Select relevant skills):</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVAILABLE_SKILLS.map((sk) => {
                    const isSel = selectedSkills.includes(sk);
                    return (
                      <button
                        type="button"
                        key={sk}
                        onClick={() => toggleSkill(sk)}
                        className={`text-[10px] font-extrabold px-3 py-1 rounded-xl transition border ${
                          isSel
                            ? "bg-blue-700 text-white border-blue-700 shadow-xs"
                            : "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {isSel ? `✓ ${sk}` : `+ ${sk}`}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* SECTION 3: EVENT PARTICIPATION DETAILS */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span>👥</span> Section 3: Event Participation Details
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Participation Type</label>
                    <select
                      value={formDataState.participationType}
                      onChange={(e) => setFormDataState({ ...formDataState, participationType: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Individual">Individual Participation</option>
                      <option value="Team">Team Participation</option>
                    </select>
                  </div>

                  {formDataState.participationType === "Team" && (
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">Team Name <span className="text-red-500">*</span></label>
                      <input
                        required
                        value={formDataState.teamName}
                        onChange={(e) => setFormDataState({ ...formDataState, teamName: e.target.value })}
                        placeholder="Enter team name"
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {fieldErrors.teamName && <p className="text-[10px] text-red-600 font-bold mt-0.5">{fieldErrors.teamName}</p>}
                    </div>
                  )}
                </div>

                {/* Team Members List */}
                {formDataState.participationType === "Team" && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-800">Team Member Details ({teamMembers.length} Members):</h4>
                      <button
                        type="button"
                        onClick={addTeamMember}
                        className="text-[10px] font-extrabold bg-blue-700 text-white px-2.5 py-1 rounded-lg hover:bg-blue-800 transition"
                      >
                        + Add Member
                      </button>
                    </div>

                    {teamMembers.map((m, idx) => (
                      <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-center">
                        <input
                          value={m.name}
                          onChange={(e) => updateTeamMember(idx, "name", e.target.value)}
                          placeholder={`Member #${idx + 1} Name`}
                          className="bg-white border border-slate-300 rounded-xl p-2 text-xs"
                        />
                        <div className="flex gap-2">
                          <input
                            value={m.emailOrId}
                            onChange={(e) => updateTeamMember(idx, "emailOrId", e.target.value)}
                            placeholder={`Email or Student ID`}
                            className="bg-white border border-slate-300 rounded-xl p-2 text-xs flex-1"
                          />
                          {teamMembers.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeTeamMember(idx)}
                              className="text-red-600 hover:text-red-800 text-xs px-2 font-bold"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Reason for Participation <span className="text-red-500">*</span></label>
                  <textarea
                    rows={2}
                    required
                    value={formDataState.reason}
                    onChange={(e) => setFormDataState({ ...formDataState, reason: e.target.value })}
                    placeholder="Briefly state your participation goals..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.reason && <p className="text-[10px] text-red-600 font-bold mt-0.5">{fieldErrors.reason}</p>}
                </div>
              </div>
            </div>

            {/* SECTION 4: EXPERIENCE & SKILLS */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span>🚀</span> Section 4: Experience & Social Links (Optional)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Previous Hackathon Experience</label>
                  <select
                    value={formDataState.previousExperience}
                    onChange={(e) => setFormDataState({ ...formDataState, previousExperience: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Beginner">Beginner (First Event)</option>
                    <option value="Some Experience">Some Experience (1-2 Events)</option>
                    <option value="Experienced">Experienced (3+ Events)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">GitHub Profile URL</label>
                  <input
                    value={formDataState.githubUrl}
                    onChange={(e) => setFormDataState({ ...formDataState, githubUrl: e.target.value })}
                    placeholder="https://github.com/username"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
                  <input
                    value={formDataState.linkedinUrl}
                    onChange={(e) => setFormDataState({ ...formDataState, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 5: EMERGENCY CONTACT */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span>📞</span> Section 5: Emergency Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Contact Name</label>
                  <input
                    value={formDataState.emergencyContactName}
                    onChange={(e) => setFormDataState({ ...formDataState, emergencyContactName: e.target.value })}
                    placeholder="Parent / Guardian Name"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Relationship</label>
                  <select
                    value={formDataState.emergencyContactRelation}
                    onChange={(e) => setFormDataState({ ...formDataState, emergencyContactRelation: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Relative">Relative</option>
                    <option value="Friend">Friend</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Emergency Phone Number</label>
                  <input
                    value={formDataState.emergencyContactPhone}
                    onChange={(e) => setFormDataState({ ...formDataState, emergencyContactPhone: e.target.value })}
                    placeholder="Emergency Contact Phone"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 6: EVENT-SPECIFIC INFORMATION */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <span>🍽️</span> Section 6: Additional Event Logistics
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Dietary Preference</label>
                  <select
                    value={formDataState.dietaryPreference}
                    onChange={(e) => setFormDataState({ ...formDataState, dietaryPreference: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Not Applicable">Not Applicable</option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">T-Shirt Size (If Applicable)</label>
                  <select
                    value={formDataState.tshirtSize}
                    onChange={(e) => setFormDataState({ ...formDataState, tshirtSize: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="XS">XS</option>
                    <option value="S">S</option>
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="XL">XL</option>
                    <option value="XXL">XXL</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Accessibility / Special Needs</label>
                  <input
                    value={formDataState.accessibilityNeeds}
                    onChange={(e) => setFormDataState({ ...formDataState, accessibilityNeeds: e.target.value })}
                    placeholder="Any special assistance needed"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 7: LIVE REGISTRATION SUMMARY TICKET BOX */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
                <span>📋 Live Registration Summary</span>
                <span className="text-blue-700 font-mono text-[11px]">{formDataState.participationType}</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-slate-700">
                <p><strong className="text-slate-400">Student:</strong> {formDataState.fullName || "—"}</p>
                <p><strong className="text-slate-400">Student ID:</strong> {formDataState.studentId || "—"}</p>
                <p><strong className="text-slate-400">Email:</strong> {formDataState.email || "—"}</p>
                <p><strong className="text-slate-400">College:</strong> {formDataState.college || "—"}</p>
                <p><strong className="text-slate-400">Branch & Year:</strong> {formDataState.branch || "—"} ({formDataState.year || "—"})</p>
                {formDataState.teamName && <p><strong className="text-slate-400">Team:</strong> {formDataState.teamName}</p>}
              </div>
            </div>

            {/* SECTION 8: DECLARATION & CONSENT CHECKBOXES */}
            <div className="p-5 bg-blue-50/60 border border-blue-200 rounded-2xl space-y-3 text-xs font-bold text-slate-800">
              <h4 className="font-extrabold text-blue-950 uppercase tracking-wider text-[11px]">Declaration & Consent</h4>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declarationInfo}
                  onChange={(e) => setDeclarationInfo(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>☑ I confirm that the information provided by me is correct.</span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={declarationRules}
                  onChange={(e) => setDeclarationRules(e.target.checked)}
                  className="mt-0.5 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span>☑ I agree to follow the rules and guidelines of the event.</span>
              </label>

              {certificateAvailable && (
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={declarationConsent}
                    onChange={(e) => setDeclarationConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                  />
                  <span>☑ I understand that certificate eligibility depends on successful participation/attendance.</span>
                </label>
              )}
            </div>

            {/* FINAL SUBMIT BUTTON */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={loading || !allDeclarationsAccepted || isExpired || isFull}
                className={`w-full py-4 rounded-2xl text-xs font-extrabold transition shadow-md ${
                  !allDeclarationsAccepted || isExpired || isFull
                    ? "bg-slate-300 text-slate-600 cursor-not-allowed"
                    : loading
                    ? "bg-blue-600 text-white cursor-wait"
                    : "bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white"
                }`}
              >
                {isExpired
                  ? "🚫 Registration Closed"
                  : isFull
                  ? "🚫 Registration Full"
                  : loading
                  ? "Processing Registration..."
                  : "🚀 Confirm Event Registration"}
              </button>

              <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                <span>🔒</span> Official University Portal • Instant QR-Verifiable Certificate Eligibility
              </p>
            </div>
          </form>
        )}

      </div>
    </section>
  );
}