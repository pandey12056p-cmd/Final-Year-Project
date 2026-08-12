import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";

import ProfileHeader from "@/components/Student/ProfileHeader";
import ProfileStats from "@/components/Student/ProfileStats";
import { formatDate } from "@/lib/date";

const EVENT_CATEGORIES = [
  { label: "Hackathons", icon: "🚀", color: "bg-blue-50/80 text-blue-900 hover:bg-blue-100 border-blue-200" },
  { label: "Workshops", icon: "🛠️", color: "bg-purple-50/80 text-purple-900 hover:bg-purple-100 border-purple-200" },
  { label: "Seminars", icon: "🎤", color: "bg-indigo-50/80 text-indigo-900 hover:bg-indigo-100 border-indigo-200" },
  { label: "Sports", icon: "🏆", color: "bg-emerald-50/80 text-emerald-900 hover:bg-emerald-100 border-emerald-200" },
  { label: "Cultural", icon: "🎭", color: "bg-amber-50/80 text-amber-900 hover:bg-amber-100 border-amber-200" },
  { label: "Placement Drive", icon: "💼", color: "bg-pink-50/80 text-pink-900 hover:bg-pink-100 border-pink-200" },
];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-red-600">Please Login First</h1>
      </main>
    );
  }

  const decoded = jwt.decode(token) as { id: number };
  if (!decoded?.id) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-red-600">Invalid Session Token</h1>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-slate-800">User Not Found</h1>
      </main>
    );
  }

  const registrations = await prisma.registration.findMany({
    where: { email: user.email },
    orderBy: { createdAt: "desc" },
  });

  const issuedCertificates = registrations.filter((r) => r.certificateIssued);
  const pendingCertificates = registrations.filter((r) => !r.certificateIssued);

  const upcomingEvents = await prisma.event.count({
    where: { status: "Upcoming" },
  });

  const savedEventsCount = await prisma.savedEvent.count({
    where: { userId: user.id },
  });

  const achievementsCount = await prisma.achievement.count({
    where: { userId: user.id },
  });

  const activities = await prisma.activity.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const skillProgresses = await prisma.skillProgress.findMany({
    where: { userId: user.id },
    take: 4,
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">

      {/* Top Official Student Banner */}
      <ProfileHeader
        name={user.name}
        email={user.email}
        image={user.profile}
        phone={user.phone}
        college={user.college}
        branch={user.branch}
        year={user.year}
        skills={user.skills}
      />

      {/* 4 Summary Stat Cards */}
      <ProfileStats
        registrations={registrations.length}
        certificates={issuedCertificates.length}
        pendingCertificates={pendingCertificates.length}
        upcoming={upcomingEvents}
      />

      {/* Quick Category Explorer */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/80 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-slate-700 uppercase tracking-wider flex items-center gap-2">
            <span>⚡</span> Quick Event Categories Launcher
          </h3>
          <Link href="/events" className="text-[11px] font-bold text-blue-700 hover:underline">
            View All Events →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2.5">
          {EVENT_CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href="/events"
              className={`flex items-center justify-center gap-1.5 p-2.5 rounded-2xl text-xs font-bold border transition duration-200 shadow-xs ${cat.color}`}
            >
              <span className="text-sm">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid lg:grid-cols-3 gap-6 items-start">

        {/* Left Column (2/3): Certificates & Event Timeline */}
        <div className="lg:col-span-2 space-y-6">

          {/* Section 1: Issued Certificates */}
          <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <span>🏆</span> Official Issued Certificates
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Certificates issued by Admin ready for direct PDF download and verification.
                </p>
              </div>
              <span className="bg-emerald-100 text-emerald-800 font-bold text-[11px] px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                {issuedCertificates.length} Available
              </span>
            </div>

            {issuedCertificates.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 text-center space-y-2">
                <div className="text-4xl">📜</div>
                <h3 className="text-sm font-bold text-slate-700">No Certificates Issued Yet</h3>
                <p className="text-slate-500 text-xs max-w-md mx-auto leading-relaxed">
                  As soon as an Admin issues a certificate for your completed events, your official PDF certificate will appear here.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {issuedCertificates.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl p-4 shadow-md border border-indigo-900 space-y-3 flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="bg-emerald-500 text-slate-950 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
                          Official Certificate
                        </span>
                        <h4 className="text-base font-bold text-white mt-1.5">{cert.eventTitle}</h4>
                      </div>
                      <span className="text-2xl">🏅</span>
                    </div>

                    <div className="text-[11px] text-slate-300 space-y-1 bg-white/10 backdrop-blur border border-white/10 p-2.5 rounded-xl">
                      <p><strong className="text-slate-200">Certificate ID:</strong> <code className="bg-blue-900/80 px-1.5 py-0.5 rounded text-blue-200 font-mono font-bold text-[10px]">{cert.certificateId}</code></p>
                      <p><strong className="text-slate-200">Issued Date:</strong> {formatDate(cert.certificateIssuedAt)}</p>
                    </div>

                    <div className="flex items-center gap-1.5 pt-1">
                      <Link
                        href={`/certificate/${cert.id}`}
                        target="_blank"
                        className="flex-1 text-center bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] font-bold py-2 rounded-xl transition"
                      >
                        👁 Preview
                      </Link>

                      <Link
                        href={`/certificate/${cert.id}?autoDownload=true`}
                        target="_blank"
                        className="flex-1 text-center bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-[11px] font-extrabold py-2 rounded-xl transition shadow flex items-center justify-center gap-1"
                      >
                        <span>📄</span> PDF Download
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 2: Registrations */}
          <div id="registrations" className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>📝</span> Event Registrations & Status
              </h2>
              <span className="text-[11px] font-semibold text-slate-500">
                Total: {registrations.length} Events
              </span>
            </div>

            {registrations.length === 0 ? (
              <div className="bg-slate-50 border border-slate-200/70 rounded-2xl p-6 text-center space-y-2">
                <div className="text-3xl">🔍</div>
                <h3 className="text-sm font-bold text-slate-700">No Registrations Found</h3>
                <Link href="/events" className="inline-block mt-2 bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-4 py-2 rounded-xl">
                  Browse Events
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {registrations.slice(0, 4).map((registration) => (
                  <div
                    key={registration.id}
                    className="border border-slate-200/80 rounded-2xl p-4 hover:border-blue-300 transition bg-slate-50/50 space-y-2"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5">
                      <h4 className="text-base font-bold text-slate-900">{registration.eventTitle}</h4>
                      {registration.certificateIssued ? (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                          🏆 Certificate Issued
                        </span>
                      ) : (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                          ⌛ Registration Confirmed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1/3): Activity Timeline, Skills, AI Shortcut */}
        <div className="space-y-6">

          {/* AI Shortcut Card */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-900 rounded-3xl p-5 text-white shadow-lg border border-blue-800/60 space-y-4">
            <div className="inline-flex items-center gap-1.5 bg-blue-500/20 text-blue-200 text-[11px] font-bold px-3 py-0.5 rounded-full border border-blue-400/20">
              <span>🤖</span> AI Personal Advisor
            </div>
            <div>
              <h3 className="text-lg font-bold">Smart Career & Event Matcher</h3>
              <p className="text-slate-300 text-xs mt-1 leading-relaxed">
                Get personalized event suggestions, skill roadmaps, and instant career Q&A.
              </p>
            </div>
            <Link
              href="/dashboard/ai"
              className="block w-full bg-white hover:bg-blue-50 text-slate-950 font-bold py-3 rounded-xl text-center transition text-xs shadow-sm"
            >
              Ask AI Advisor →
            </Link>
          </div>

          {/* Career Progress Widget */}
          <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <span>🧭</span> Skill Mastery Progress
              </h3>
              <Link href="/dashboard/roadmap" className="text-[10px] font-bold text-blue-700 hover:underline">
                View All →
              </Link>
            </div>

            <div className="space-y-2 text-xs">
              {skillProgresses.map((sp) => (
                <div key={sp.id} className="space-y-1">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>{sp.skillName}</span>
                    <span className="text-blue-700">{sp.progress}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: `${sp.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Student Activity */}
          <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-5 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <span>🕒</span> Recent Portal Activity
            </h3>

            {activities.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No recent activity logged.</p>
            ) : (
              <div className="space-y-2 text-xs text-slate-600">
                {activities.map((act) => (
                  <div key={act.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="font-semibold text-slate-800">{act.title}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(act.createdAt)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
