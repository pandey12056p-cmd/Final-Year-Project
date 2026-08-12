import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import { formatDate } from "@/lib/date";
import PrintResumeButton from "@/components/Student/PrintResumeButton";

export default async function ResumePage() {
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
        <h1 className="text-2xl font-bold text-red-600">Invalid Token</h1>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold">User Not Found</h1>
      </main>
    );
  }

  const registrations = await prisma.registration.findMany({
    where: { email: user.email },
    orderBy: { createdAt: "desc" },
  });

  const certificates = registrations.filter((r) => r.certificateIssued);

  const achievements = await prisma.achievement.findMany({
    where: { userId: user.id },
  });

  const skills = await prisma.skillProgress.findMany({
    where: { userId: user.id },
  });

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">

      {/* Top Action Bar (Hidden on print) */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/dashboard" className="text-xs font-bold text-slate-600 hover:underline">
          ← Back to Dashboard
        </Link>
        <PrintResumeButton />
      </div>

      {/* Official Resume Sheet Container */}
      <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-200 space-y-8 print:shadow-none print:border-none print:p-0">

        {/* Header Block */}
        <div className="border-b border-slate-200 pb-6 flex flex-col md:flex-row items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.name}</h1>
            <p className="text-sm font-bold text-blue-700">
              {user.careerGoal || "Software Engineering Student"}
            </p>
            <p className="text-xs text-slate-600 pt-1">
              🏛️ {user.college || "University Student"} • 🎓 {user.branch || "CSE"} ({user.year || "3rd Year"})
            </p>
            {user.bio && <p className="text-xs text-slate-500 italic pt-1">{user.bio}</p>}
          </div>

          <div className="text-xs text-slate-600 space-y-1 text-left md:text-right shrink-0">
            <p>📧 {user.email}</p>
            {user.phone && <p>📱 {user.phone}</p>}
            {user.githubUrl && <p>🔗 <a href={user.githubUrl} target="_blank" className="text-blue-600 hover:underline">GitHub</a></p>}
            {user.linkedinUrl && <p>💼 <a href={user.linkedinUrl} target="_blank" className="text-blue-600 hover:underline">LinkedIn</a></p>}
            {user.portfolioUrl && <p>🌐 <a href={user.portfolioUrl} target="_blank" className="text-blue-600 hover:underline">Portfolio</a></p>}
          </div>
        </div>

        {/* Technical Skills & Masteries */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
            Technical Skills & Masteries
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span key={s.id} className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1 rounded-xl border border-slate-200">
                {s.skillName} ({s.progress}%)
              </span>
            ))}
            {skills.length === 0 && user.skills && (
              <span className="text-xs text-slate-600">{user.skills}</span>
            )}
          </div>
        </div>

        {/* Verified Event Certificates */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
            Verified Credentials & Certificates
          </h2>
          {certificates.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No verified certificates issued yet.</p>
          ) : (
            <div className="space-y-2">
              {certificates.map((cert) => (
                <div key={cert.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-900">{cert.eventTitle}</h4>
                    <p className="text-[11px] text-slate-500">ID: {cert.certificateId} • Issued: {formatDate(cert.certificateIssuedAt)}</p>
                  </div>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    Verified ✅
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Event Participation History */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
            Campus Hackathons & Event Participation
          </h2>
          <div className="space-y-2">
            {registrations.map((reg) => (
              <div key={reg.id} className="text-xs text-slate-700 flex justify-between">
                <span className="font-semibold">{reg.eventTitle}</span>
                <span className="text-slate-400">{formatDate(reg.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements & Milestones */}
        <div className="space-y-3">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-1">
            Student Achievements
          </h2>
          <div className="flex flex-wrap gap-2">
            {achievements.map((ach) => (
              <span key={ach.id} className="bg-blue-50 text-blue-900 text-xs font-bold px-3 py-1 rounded-xl border border-blue-200">
                {ach.icon} {ach.title}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
