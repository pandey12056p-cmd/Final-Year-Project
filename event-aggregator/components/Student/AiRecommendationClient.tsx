"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { User, AiRecommendationResponse } from "@/types/event";
import { formatDate } from "@/lib/date";

type Props = {
  user: User;
};

const SUGGESTIONS = [
  "Which events are best for me?",
  "I know Java and Spring Boot. What should I attend?",
  "I want to become a full-stack developer. What should I learn?",
  "Which upcoming hackathons match my skills?",
  "What should I learn next?",
  "Which events can improve my resume?",
];

export default function AiRecommendationClient({ user }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AiRecommendationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick inline profile update modal / toggle
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    skills: user.skills || "",
    interests: user.interests || "",
    careerGoal: user.careerGoal || "",
    preferredDomain: user.preferredDomain || "",
    experienceLevel: user.experienceLevel || "Beginner",
    preferredMode: user.preferredMode || "All",
  });

  async function fetchRecommendations(customQuery?: string) {
    const activeQuery = customQuery !== undefined ? customQuery : query;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/ai/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: activeQuery }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch recommendations.");
      }

      setRecommendations(data.recommendations);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  // Load initial recommendation on page load
  useEffect(() => {
    fetchRecommendations("");
  }, []);

  async function handleProfileUpdate(e: React.FormEvent) {
    e.preventDefault();
    setUpdatingProfile(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: user.name,
          phone: user.phone,
          college: user.college,
          branch: user.branch,
          year: user.year,
          ...profileData,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      alert("Profile preferences updated! Re-generating AI recommendations...");
      setShowProfileModal(false);
      fetchRecommendations(query);
    } catch (err: any) {
      alert(err.message || "Failed to update profile.");
    } finally {
      setUpdatingProfile(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-800 rounded-3xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold text-blue-100 mb-3">
              <span>🤖 AI Career & Event Advisor</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Hi {user.name.split(" ")[0]} 👋
            </h1>
            <p className="mt-2 text-blue-100 text-lg max-w-2xl">
              Tell me what you are interested in and I will analyze live college events, your technical skills, and career goals to recommend the best opportunities.
            </p>
          </div>

          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/30 px-5 py-3 rounded-2xl font-semibold backdrop-blur-md transition flex items-center gap-2 shrink-0"
          >
            <span>⚙️</span> Tune AI Profile
          </button>
        </div>
      </div>

      {/* Profile Completeness Alert */}
      {recommendations?.profileCompleteness && !recommendations.profileCompleteness.isComplete && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-bold text-amber-900">
                Complete your profile for hyper-personalized recommendations
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                Missing details:{" "}
                <span className="font-semibold">
                  {recommendations.profileCompleteness.missingFields.join(", ")}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowProfileModal(true)}
            className="bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition shrink-0"
          >
            Update AI Profile
          </button>
        </div>
      )}

      {/* AI Query Box */}
      <div className="bg-white rounded-3xl shadow-lg p-6 md:p-8 space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <span>💬</span> Ask AI Assistant
        </h2>

        {/* Quick Suggestion Chips */}
        <div className="space-y-2">
          <p className="text-sm font-medium text-slate-500">Quick Suggestions:</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(suggestion);
                  fetchRecommendations(suggestion);
                }}
                className="bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-sm font-medium px-4 py-2 rounded-xl transition border border-slate-200"
              >
                • {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Search Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            fetchRecommendations();
          }}
          className="flex flex-col md:flex-row gap-4"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI something... e.g. 'I know Java and MySQL, which events should I attend?'"
            className="flex-1 border rounded-2xl p-4 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 text-lg"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-8 py-4 rounded-2xl transition shadow-lg disabled:opacity-50 shrink-0 text-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span> Analyzing...
              </>
            ) : (
              <>
                <span>🤖</span> Get Recommendation
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-red-700 text-center">
          <p className="font-semibold text-lg">Failed to load recommendations</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            onClick={() => fetchRecommendations()}
            className="mt-4 bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="bg-white rounded-3xl shadow-lg p-12 text-center space-y-4 animate-pulse">
          <div className="text-5xl">🤖</div>
          <h3 className="text-2xl font-bold text-slate-700">
            Analyzing your profile & live events...
          </h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Matching your skills in <span className="font-semibold">{user.skills || "tech"}</span> and career goals with upcoming hackathons and workshops.
          </p>
        </div>
      )}

      {/* Recommendations Results Output */}
      {!loading && recommendations && (
        <div className="space-y-10">
          {/* Actionable Next Step Box */}
          {recommendations.actionableNextStep && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-6 text-white shadow-md flex items-center gap-4">
              <span className="text-4xl">💡</span>
              <div>
                <h4 className="text-sm font-semibold text-emerald-100 uppercase tracking-wider">
                  Recommended Immediate Action
                </h4>
                <p className="text-xl font-bold mt-1">
                  {recommendations.actionableNextStep}
                </p>
              </div>
            </div>
          )}

          {/* Section 1: Best Matches (Events) */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
                <span>🎯</span> Best Event Matches
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-bold px-3 py-1 rounded-full">
                {recommendations.bestMatches.length} Opportunities Found
              </span>
            </div>

            {recommendations.bestMatches.length === 0 ? (
              <div className="bg-white rounded-3xl shadow p-8 text-center space-y-3">
                <div className="text-5xl">🔍</div>
                <h3 className="text-xl font-bold text-slate-700">
                  No highly relevant events found right now
                </h3>
                <p className="text-slate-500 max-w-lg mx-auto">
                  We checked active upcoming events. Check back soon for new hackathons and workshops or try tuning your AI profile preferences!
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {recommendations.bestMatches.map(({ event, matchScore, matchLabel, whyRecommended }) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden flex flex-col justify-between hover:shadow-xl transition group"
                  >
                    <div className="p-6 space-y-4">
                      {/* Match Score & Mode */}
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-black uppercase px-3 py-1.5 rounded-full ${
                            matchScore >= 90
                              ? "bg-emerald-100 text-emerald-800"
                              : matchScore >= 80
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {matchScore}% • {matchLabel}
                        </span>

                        <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-3 py-1 rounded-full">
                          {event.mode}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-2xl font-bold text-slate-800 group-hover:text-blue-700 transition">
                          {event.title}
                        </h3>
                        <p className="text-sm font-medium text-slate-500 mt-1">
                          Category: {event.category} • Organizer: {event.organizer}
                        </p>
                      </div>

                      {/* Why Recommended AI Reasoning Box */}
                      <div className="bg-blue-50/70 border border-blue-100 rounded-2xl p-4 text-sm text-blue-900">
                        <p className="font-semibold flex items-center gap-1.5 text-blue-800 mb-1">
                          <span>🤖</span> Why this fits your profile:
                        </p>
                        <p className="text-blue-800 leading-relaxed">{whyRecommended}</p>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                        <div>
                          <span className="font-semibold text-slate-800">Date:</span>{" "}
                          {formatDate(event.date)}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-800">Location:</span>{" "}
                          {event.location}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-3">
                      <Link
                        href={`/events/${event.id}`}
                        className="flex-1 text-center bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-sm font-semibold py-2.5 rounded-xl transition"
                      >
                        View Event
                      </Link>

                      <Link
                        href={`/events/${event.id}/register`}
                        className="flex-1 text-center bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold py-2.5 rounded-xl transition shadow"
                      >
                        Register Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2 & 3 Grid: Skills to Learn & Career Roadmap */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Skills You Should Learn Next */}
            <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>🚀</span> Recommended Skills to Learn
              </h2>

              <div className="space-y-4">
                {recommendations.skillsToLearn.map((item, idx) => (
                  <div
                    key={idx}
                    className="border border-slate-100 bg-slate-50/50 rounded-2xl p-4 hover:border-blue-200 transition"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-blue-700 text-white text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <h4 className="text-lg font-bold text-slate-800">{item.skill}</h4>
                    </div>
                    <p className="text-sm text-slate-600 mt-2 pl-8">{item.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Personalized Career Roadmap */}
            <div className="bg-white rounded-3xl shadow-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>🧭</span> {recommendations.careerRoadmap.title}
              </h2>

              <p className="text-slate-600 font-medium">
                {recommendations.careerRoadmap.suggestion}
              </p>

              <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-4 space-y-2">
                <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
                  Current Assessed Level:{" "}
                  <span className="text-indigo-900">{recommendations.careerRoadmap.currentLevel}</span>
                </div>
                <div className="text-sm font-bold text-indigo-950">
                  Next Milestone: {recommendations.careerRoadmap.nextStep}
                </div>
              </div>

              {/* Roadmap Steps */}
              <div className="space-y-3 pt-2">
                {recommendations.careerRoadmap.steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-sm font-semibold text-slate-700">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Profile Tuner Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <span>⚙️</span> Tune AI Profile Preferences
              </h3>
              <button
                onClick={() => setShowProfileModal(false)}
                className="text-slate-400 hover:text-slate-600 text-2xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Technical Skills
                </label>
                <input
                  type="text"
                  value={profileData.skills}
                  onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                  placeholder="e.g. Java, Spring Boot, MySQL, React"
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Interests
                </label>
                <input
                  type="text"
                  value={profileData.interests}
                  onChange={(e) => setProfileData({ ...profileData, interests: e.target.value })}
                  placeholder="e.g. Web Development, Hackathons"
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Target Career Goal
                </label>
                <input
                  type="text"
                  value={profileData.careerGoal}
                  onChange={(e) => setProfileData({ ...profileData, careerGoal: e.target.value })}
                  placeholder="e.g. Java Backend Developer"
                  className="w-full border rounded-xl p-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    value={profileData.experienceLevel}
                    onChange={(e) => setProfileData({ ...profileData, experienceLevel: e.target.value })}
                    className="w-full border rounded-xl p-3 bg-white"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">
                    Preferred Event Mode
                  </label>
                  <select
                    value={profileData.preferredMode}
                    onChange={(e) => setProfileData({ ...profileData, preferredMode: e.target.value })}
                    className="w-full border rounded-xl p-3 bg-white"
                  >
                    <option value="All">All Modes</option>
                    <option value="Online">Online</option>
                    <option value="Offline">Offline</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="flex-1 border border-slate-200 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updatingProfile}
                  className="flex-1 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold shadow"
                >
                  {updatingProfile ? "Saving..." : "Save & Re-analyze"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
