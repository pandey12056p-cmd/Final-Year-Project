"use client";

import { useState } from "react";

type Props = {
  user: {
    name: string;
    email: string;
    phone: string | null;
    college: string | null;
    branch: string | null;
    year: string | null;
    skills?: string | null;
    interests?: string | null;
    careerGoal?: string | null;
    preferredDomain?: string | null;
    experienceLevel?: string | null;
    preferredMode?: string | null;
    preferredLocation?: string | null;
    githubUrl?: string | null;
    linkedinUrl?: string | null;
    portfolioUrl?: string | null;
    bio?: string | null;
  };
};

export default function EditProfileForm({ user }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const body = {
      name: formData.get("name"),
      phone: formData.get("phone"),
      college: formData.get("college"),
      branch: formData.get("branch"),
      year: formData.get("year"),
      skills: formData.get("skills"),
      interests: formData.get("interests"),
      careerGoal: formData.get("careerGoal"),
      preferredDomain: formData.get("preferredDomain"),
      experienceLevel: formData.get("experienceLevel"),
      preferredMode: formData.get("preferredMode"),
      preferredLocation: formData.get("preferredLocation"),
      githubUrl: formData.get("githubUrl"),
      linkedinUrl: formData.get("linkedinUrl"),
      portfolioUrl: formData.get("portfolioUrl"),
      bio: formData.get("bio"),
    };

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setLoading(false);
    alert(data.message);
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-lg border border-slate-200 p-8 space-y-5">
      <h2 className="text-2xl font-bold text-slate-900 border-b border-slate-100 pb-3">
        Edit Academic & Social Profile
      </h2>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
        <input
          name="name"
          defaultValue={user.name}
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
        <input
          value={user.email}
          disabled
          className="w-full bg-slate-100 border border-slate-200 rounded-xl p-3 text-xs cursor-not-allowed text-slate-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
          <input
            name="phone"
            defaultValue={user.phone ?? ""}
            placeholder="Phone Number"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">College Name</label>
          <input
            name="college"
            defaultValue={user.college ?? ""}
            placeholder="College Name"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Branch / Stream</label>
          <input
            name="branch"
            defaultValue={user.branch ?? ""}
            placeholder="Computer Science & Engineering"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Academic Year</label>
          <input
            name="year"
            defaultValue={user.year ?? ""}
            placeholder="e.g. 3rd Year"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <hr className="my-4 border-slate-100" />

      <h3 className="text-sm font-extrabold text-indigo-900 uppercase tracking-wider">
        🌐 Social & Portfolio Links
      </h3>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">GitHub Profile URL</label>
          <input
            name="githubUrl"
            defaultValue={user.githubUrl ?? ""}
            placeholder="https://github.com/username"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Profile URL</label>
          <input
            name="linkedinUrl"
            defaultValue={user.linkedinUrl ?? ""}
            placeholder="https://linkedin.com/in/username"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Portfolio Website</label>
          <input
            name="portfolioUrl"
            defaultValue={user.portfolioUrl ?? ""}
            placeholder="https://yourportfolio.com"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Short Bio</label>
        <textarea
          name="bio"
          defaultValue={user.bio ?? ""}
          rows={2}
          placeholder="Brief introduction for your student resume profile..."
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <hr className="my-4 border-slate-100" />

      <h3 className="text-sm font-extrabold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
        <span>🤖</span> AI Recommendation Preferences
      </h3>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Technical Skills (comma-separated)</label>
        <input
          name="skills"
          defaultValue={user.skills ?? ""}
          placeholder="Java, Spring Boot, MySQL, React, Next.js"
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1">Interests</label>
        <input
          name="interests"
          defaultValue={user.interests ?? ""}
          placeholder="Web Development, Hackathons, AI/ML Workshops"
          className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Target Career Goal</label>
          <input
            name="careerGoal"
            defaultValue={user.careerGoal ?? ""}
            placeholder="Java Backend Developer"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Domain</label>
          <input
            name="preferredDomain"
            defaultValue={user.preferredDomain ?? ""}
            placeholder="Web Development"
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        disabled={loading}
        className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3.5 rounded-2xl text-xs font-bold shadow-md transition disabled:opacity-50"
      >
        {loading ? "Updating..." : "Update Profile & Preferences"}
      </button>
    </form>
  );
}