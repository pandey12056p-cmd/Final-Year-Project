"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type SkillItem = {
  id?: number;
  skillName: string;
  status: "Not Started" | "Learning" | "Completed";
  progress: number;
};

export default function CareerRoadmapPage() {
  const [targetCareer, setTargetCareer] = useState("Java Backend Developer");
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    try {
      const res = await fetch("/api/skills");
      const data = await res.json();
      if (res.ok) {
        setSkills(data.skills || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateSkill(skillName: string, status: "Not Started" | "Learning" | "Completed", progress: number) {
    setSaving(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skillName, status, progress }),
      });
      if (res.ok) {
        setSkills((prev) =>
          prev.map((item) =>
            item.skillName === skillName ? { ...item, status, progress } : item
          )
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  const completedCount = skills.filter((s) => s.status === "Completed").length;
  const overallProgress = skills.length > 0 ? Math.round((completedCount / skills.length) * 100) : 0;

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-indigo-500/20 text-indigo-200 text-xs font-bold px-3 py-1 rounded-full border border-indigo-400/20">
            Career Architecture
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">🧭 Smart Career Roadmap & Skill Tracker</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Track your skill completion, target role requirements, and project milestones.
          </p>
        </div>

        {/* Overall Progress Badge */}
        <div className="bg-white/10 backdrop-blur border border-white/10 p-4 rounded-2xl text-center shrink-0 min-w-[170px]">
          <span className="text-2xl font-black text-emerald-400 block">{overallProgress}%</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Target Readiness</span>
        </div>
      </div>

      {/* Target Role Selector */}
      <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">Selected Target Career Role:</h3>
          <p className="text-xs text-slate-500">Skills and project suggestions will dynamically align with this goal.</p>
        </div>

        <select
          value={targetCareer}
          onChange={(e) => setTargetCareer(e.target.value)}
          className="bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none w-full sm:w-auto"
        >
          <option value="Java Backend Developer">Java Backend Developer</option>
          <option value="Full Stack Developer">Full Stack Developer</option>
          <option value="Python ML / AI Engineer">Python ML / AI Engineer</option>
          <option value="DevOps & Cloud Engineer">DevOps & Cloud Engineer</option>
          <option value="Cyber Security Analyst">Cyber Security Analyst</option>
        </select>
      </div>

      {/* Interactive Skill Progress Section */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 md:p-8 space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span>📈</span> Technical Skill Mastery & Status
          </h2>
          <span className="text-xs text-slate-500 font-semibold">
            {completedCount} of {skills.length} Completed
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
            Loading skill tracker...
          </div>
        ) : (
          <div className="space-y-4">
            {skills.map((item) => (
              <div
                key={item.skillName}
                className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-base font-bold text-slate-900">{item.skillName}</h4>
                    <p className="text-[11px] text-slate-500">Target Role Core Requirement</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {(["Not Started", "Learning", "Completed"] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() =>
                          handleUpdateSkill(
                            item.skillName,
                            st,
                            st === "Completed" ? 100 : st === "Not Started" ? 10 : item.progress
                          )
                        }
                        className={`px-3 py-1 rounded-xl text-[10px] font-extrabold transition ${
                          item.status === st
                            ? st === "Completed"
                              ? "bg-emerald-600 text-white"
                              : st === "Learning"
                              ? "bg-blue-600 text-white"
                              : "bg-slate-300 text-slate-800"
                            : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Progress Bar & Slider */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-600">Proficiency:</span>
                    <span className="text-blue-700">{item.progress}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={item.progress}
                    onChange={(e) =>
                      handleUpdateSkill(item.skillName, item.status, Number(e.target.value))
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
