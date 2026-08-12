"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  AiRecommendationResponse,
  CareerRoadmapData,
  SkillGapAnalysisData,
} from "@/types/event";
import { formatDate } from "@/lib/date";

export default function AiDashboardPage() {
  const [activeTab, setActiveTab] = useState<"recommendations" | "roadmap" | "skills" | "chat">("recommendations");

  // Recommendation State
  const [recData, setRecData] = useState<AiRecommendationResponse | null>(null);
  const [loadingRec, setLoadingRec] = useState(true);
  const [recError, setRecError] = useState<string | null>(null);

  // Career Roadmap State
  const [targetCareer, setTargetCareer] = useState("Full Stack Developer");
  const [roadmapData, setRoadmapData] = useState<CareerRoadmapData | null>(null);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);

  // Skill Gap State
  const [skillGapData, setSkillGapData] = useState<SkillGapAnalysisData | null>(null);
  const [loadingSkillGap, setLoadingSkillGap] = useState(false);

  // Chatbot State
  const [chatMessages, setChatMessages] = useState<
    { sender: "user" | "ai"; text: string; events?: any[] }[]
  >([
    {
      sender: "ai",
      text: "👋 Hi! I am your Event Aggregator AI Assistant. Ask me anything about upcoming hackathons, career roadmaps, or certificate events!",
    },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);

  // Fetch Recommendations on Mount
  useEffect(() => {
    fetchRecommendations();
  }, []);

  async function fetchRecommendations() {
    setLoadingRec(true);
    setRecError(null);
    try {
      const res = await fetch("/api/ai/recommendations");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load AI recommendations.");
      setRecData(data);
    } catch (err: any) {
      setRecError(err.message || "AI service is temporarily unavailable. Please try again.");
    } finally {
      setLoadingRec(false);
    }
  }

  // Fetch Career Roadmap when target changes
  async function fetchRoadmap(career: string) {
    setLoadingRoadmap(true);
    try {
      const res = await fetch("/api/ai/career", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetCareer: career }),
      });
      const data = await res.json();
      if (res.ok) setRoadmapData(data.roadmap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingRoadmap(false);
    }
  }

  // Fetch Skill Gap Analysis
  async function fetchSkillGap() {
    setLoadingSkillGap(true);
    try {
      const res = await fetch("/api/ai/skill-gap");
      const data = await res.json();
      if (res.ok) setSkillGapData(data.skillGap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSkillGap(false);
    }
  }

  // Handle Tab Switch
  function handleTabChange(tab: "recommendations" | "roadmap" | "skills" | "chat") {
    setActiveTab(tab);
    if (tab === "roadmap" && !roadmapData) fetchRoadmap(targetCareer);
    if (tab === "skills" && !skillGapData) fetchSkillGap();
  }

  // Handle Chat Submit
  async function handleSendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!chatInput.trim() || chatLoading) return;

    const userText = chatInput;
    setChatInput("");
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText }),
      });
      const data = await res.json();
      if (res.ok && data.chat) {
        setChatMessages((prev) => [
          ...prev,
          { sender: "ai", text: data.chat.text, events: data.chat.recommendedEvents },
        ]);
      } else {
        setChatMessages((prev) => [
          ...prev,
          { sender: "ai", text: "AI service is temporarily unavailable. Please try again." },
        ]);
      }
    } catch (err) {
      setChatMessages((prev) => [
        ...prev,
        { sender: "ai", text: "AI service is temporarily unavailable. Please try again." },
      ]);
    } finally {
      setChatLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 text-white shadow-xl border border-slate-800">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-indigo-500/20 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/20">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              AI Career & Event Assistant
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mt-2">
              🤖 AI Personalized Event & Career Recommendations
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Get personalized event recommendations and career guidance based on your profile, branch, and goals.
            </p>
          </div>

          <button
            onClick={fetchRecommendations}
            disabled={loadingRec}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-4 py-2.5 rounded-2xl text-xs font-bold transition shrink-0 flex items-center gap-2 shadow"
          >
            <span>🔄</span> Refresh Recommendations
          </button>
        </div>
      </div>

      {/* Profile Completeness Alert */}
      {recData?.profileCompleteness && !recData.profileCompleteness.isComplete && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-amber-900">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚠️</span>
            <div className="text-xs">
              <h4 className="font-bold text-amber-950">Complete your profile to improve AI recommendations</h4>
              <p className="text-amber-800">
                Missing: {recData.profileCompleteness.missingFields.join(", ")}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/profile"
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl shrink-0 transition"
          >
            Complete Profile
          </Link>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => handleTabChange("recommendations")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition ${
            activeTab === "recommendations"
              ? "bg-blue-700 text-white shadow"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>🎯</span> Recommended Events
        </button>

        <button
          onClick={() => handleTabChange("roadmap")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition ${
            activeTab === "roadmap"
              ? "bg-blue-700 text-white shadow"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>🧭</span> Career Roadmap
        </button>

        <button
          onClick={() => handleTabChange("skills")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition ${
            activeTab === "skills"
              ? "bg-blue-700 text-white shadow"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>📈</span> Skill Gap Analysis
        </button>

        <button
          onClick={() => handleTabChange("chat")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition ${
            activeTab === "chat"
              ? "bg-blue-700 text-white shadow"
              : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
          }`}
        >
          <span>💬</span> AI Chatbot Assistant
        </button>
      </div>

      {/* TAB 1: RECOMMENDED EVENTS */}
      {activeTab === "recommendations" && (
        <div className="space-y-6">
          {recError && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-700">
              ⚠️ {recError}
            </div>
          )}

          {loadingRec ? (
            <div className="bg-white rounded-3xl p-12 text-center space-y-3 shadow-sm border border-slate-200">
              <div className="text-4xl animate-bounce">🤖</div>
              <h3 className="text-base font-bold text-slate-800">AI is analyzing your profile & events...</h3>
              <p className="text-xs text-slate-500">Matching real events from Prisma database based on your skills and branch.</p>
            </div>
          ) : recData?.bestMatches.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 text-center space-y-3 border border-slate-200">
              <div className="text-4xl">🔍</div>
              <h3 className="text-base font-bold text-slate-800">No Direct Event Matches Found</h3>
              <p className="text-xs text-slate-500">Try updating your skills or browse all available events.</p>
              <Link href="/events" className="inline-block bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl">
                Browse All Events
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>🎯</span> Recommended For You ({recData?.bestMatches.length} Real Events)
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {recData?.bestMatches.map((match) => (
                  <div
                    key={match.event.id}
                    className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-md hover:shadow-xl transition duration-200 space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="bg-blue-100 text-blue-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                            {match.event.category}
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">
                            {match.event.title}
                          </h3>
                        </div>

                        {/* Match Score Badge */}
                        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-2xl text-center shrink-0">
                          <span className="text-base font-black block">{match.matchScore}%</span>
                          <span className="text-[9px] font-extrabold uppercase tracking-tight block">{match.matchLabel}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        <p><strong>📍 Mode:</strong> {match.event.mode} • <strong>Location:</strong> {match.event.location}</p>
                        <p><strong>⏳ Deadline:</strong> {formatDate(match.event.registrationDeadline)}</p>
                      </div>

                      {/* Why Recommended */}
                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-indigo-900">🧠 Why this event is recommended:</p>
                        <p className="text-slate-600 leading-relaxed bg-indigo-50/60 border border-indigo-100 p-2.5 rounded-xl">
                          "{match.whyRecommended}"
                        </p>
                      </div>

                      {/* Skills You Can Gain */}
                      <div className="space-y-1 text-xs">
                        <p className="font-bold text-slate-800">🚀 Skills You Can Gain:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {match.skillsGained.map((skill) => (
                            <span key={skill} className="bg-slate-100 text-slate-700 font-mono text-[10px] px-2.5 py-1 rounded-lg border border-slate-200">
                              • {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Career Benefit */}
                      <div className="text-xs text-slate-600">
                        <strong className="text-emerald-800">💼 Career Benefit:</strong> {match.careerBenefit}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                      <Link
                        href={`/events/${match.event.id}`}
                        className="flex-1 text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 rounded-xl transition"
                      >
                        View Event
                      </Link>

                      <Link
                        href={`/events/${match.event.id}`}
                        className="flex-1 text-center bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs py-2.5 rounded-xl transition shadow"
                      >
                        Register Now
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: CAREER ROADMAP */}
      {activeTab === "roadmap" && (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 md:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>🧭</span> Personalized Career Roadmap
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Select target career to generate structured learning steps & real events.</p>
            </div>

            {/* Target Career Selector */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <label className="text-xs font-bold text-slate-600 shrink-0">Target Role:</label>
              <select
                value={targetCareer}
                onChange={(e) => {
                  setTargetCareer(e.target.value);
                  fetchRoadmap(e.target.value);
                }}
                className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
              >
                <option value="Java Backend Developer">Java Backend Developer</option>
                <option value="Full Stack Developer">Full Stack Developer</option>
                <option value="Python ML / AI Engineer">Python ML / AI Engineer</option>
                <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
                <option value="Cyber Security Analyst">Cyber Security Analyst</option>
              </select>
            </div>
          </div>

          {loadingRoadmap ? (
            <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
              🤖 Generating roadmap for {targetCareer}...
            </div>
          ) : roadmapData ? (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-emerald-900">✅ Skills You Already Have:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {roadmapData.currentSkillsHad.map((s) => (
                      <span key={s} className="bg-white text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-1">
                  <p className="text-xs font-bold text-amber-900">🚀 Key Missing Skills To Acquire:</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {roadmapData.missingSkills.map((s) => (
                      <span key={s} className="bg-white text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-md border border-amber-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Learning Step-by-Step Order */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Structured Learning Order:</h3>
                <div className="space-y-2">
                  {roadmapData.learningOrder.map((step, idx) => (
                    <div key={step} className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs">
                      <span className="h-7 w-7 rounded-full bg-blue-700 text-white font-black flex items-center justify-center text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended Real Events */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Relevant Real Database Events:</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {roadmapData.recommendedEvents.map((e) => (
                    <div key={e.id} className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
                      <h4 className="font-bold text-sm">{e.title}</h4>
                      <p className="text-[11px] text-slate-300">Category: {e.category} • Mode: {e.mode}</p>
                      <Link href={`/events/${e.id}`} className="inline-block text-xs font-bold text-blue-300 hover:underline">
                        View Event →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 3: SKILL GAP ANALYSIS */}
      {activeTab === "skills" && (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 md:p-8 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>📈</span> Skill Gap & Proficiency Analysis
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">Visual representation of your mastered skills vs missing priority skills.</p>
          </div>

          {loadingSkillGap ? (
            <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
              🤖 Analyzing skill gap...
            </div>
          ) : skillGapData ? (
            <div className="space-y-6">
              {/* Strong Skills */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Strong & Mastered Skills:</h3>
                <div className="space-y-2">
                  {skillGapData.strongSkills.map((s) => (
                    <div key={s.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-bold text-slate-700">
                        <span>{s.name}</span>
                        <span className="text-emerald-700">{s.percentage}%</span>
                      </div>
                      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${s.percentage}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Missing Skills with Priority */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Missing Priority Skills:</h3>
                <div className="space-y-3">
                  {skillGapData.missingSkills.map((item) => (
                    <div key={item.name} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{item.name}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          item.priority === "High" ? "bg-red-100 text-red-800 border border-red-200" : "bg-amber-100 text-amber-800"
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <p className="text-slate-600"><strong className="text-slate-800">Why it matters:</strong> {item.why}</p>
                      <p className="text-blue-900"><strong className="text-blue-950">Practice:</strong> {item.practice}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* TAB 4: AI CHATBOT */}
      {activeTab === "chat" && (
        <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 md:p-8 space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>💬</span> Event Aggregator AI Assistant Chatbot
            </h2>
            <p className="text-xs text-slate-500">Ask questions about upcoming events, certificates, or career guidance.</p>
          </div>

          {/* Chat Message Box */}
          <div className="h-[380px] overflow-y-auto p-4 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-3 custom-scrollbar">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                    msg.sender === "user"
                      ? "bg-blue-700 text-white font-medium"
                      : "bg-white text-slate-800 border border-slate-200"
                  }`}
                >
                  {msg.text}

                  {msg.events && msg.events.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      <p className="font-bold text-[11px] text-slate-700">Real Database Event Matches:</p>
                      {msg.events.map((e) => (
                        <div key={e.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-900">
                          <p className="font-bold text-xs">{e.title}</p>
                          <p className="text-[10px] text-slate-500">{e.category} • {e.mode}</p>
                          <Link href={`/events/${e.id}`} className="text-[10px] font-bold text-blue-700 hover:underline">
                            View Event Details →
                          </Link>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex items-start">
                <div className="bg-white text-slate-500 p-3 rounded-2xl text-xs border border-slate-200 animate-pulse">
                  🤖 AI is searching database & processing query...
                </div>
              </div>
            )}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask AI: e.g., 'Show hackathons suitable for Java developers' or 'Which events give certificates?'"
              className="flex-1 bg-slate-50 border border-slate-300 rounded-2xl px-4 py-3 text-xs text-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="bg-blue-700 hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-2xl text-xs transition disabled:opacity-50 shadow"
            >
              Send
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
