"use client";

import { useState, useEffect } from "react";

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    try {
      const res = await fetch("/api/achievements");
      const data = await res.json();
      if (res.ok) {
        setAchievements(data.achievements || []);
        setUnlockedCount(data.unlockedCount || 0);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-emerald-500/20 text-emerald-200 text-xs font-bold px-3 py-1 rounded-full border border-emerald-400/20">
            Gamified Milestones
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">🏆 Student Achievements</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Earn badges as you participate in hackathons, complete events, and earn verified certificates.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur border border-white/10 px-5 py-3 rounded-2xl text-center shrink-0">
          <span className="text-3xl font-black text-emerald-400 block">{unlockedCount} / {achievements.length}</span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">Badges Unlocked</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span>🏅</span> Official Milestone Badges
        </h2>

        {loading ? (
          <div className="p-8 text-center text-xs text-slate-500 animate-pulse">
            Evaluating student achievements...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {achievements.map((item) => (
              <div
                key={item.code}
                className={`p-5 rounded-3xl border transition space-y-3 flex flex-col justify-between ${
                  item.unlocked
                    ? "bg-gradient-to-br from-slate-900 to-indigo-950 text-white border-indigo-900 shadow-md"
                    : "bg-slate-50 text-slate-400 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-4xl">{item.icon}</div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    item.unlocked
                      ? "bg-emerald-500 text-slate-950"
                      : "bg-slate-200 text-slate-600"
                  }`}>
                    {item.unlocked ? "Unlocked ✅" : "Locked 🔒"}
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className={`text-base font-bold ${item.unlocked ? "text-white" : "text-slate-700"}`}>
                    {item.title}
                  </h3>
                  <p className="text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
