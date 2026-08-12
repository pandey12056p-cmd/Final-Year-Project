import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import ProfileImage from "@/components/Student/ProfileImage";
import EditProfileForm from "@/components/Student/EditProfileForm";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6">
        <h1 className="text-2xl font-bold text-red-600">Please Login</h1>
      </main>
    );
  }

  const decoded = jwt.decode(token) as { id: number };

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

  // Calculate Profile Completeness
  const fields = [
    { name: "Full Name", val: user.name },
    { name: "Email", val: user.email },
    { name: "Phone", val: user.phone },
    { name: "College", val: user.college },
    { name: "Branch", val: user.branch },
    { name: "Academic Year", val: user.year },
    { name: "Profile Photo", val: user.profile },
    { name: "Skills", val: user.skills },
    { name: "Interests", val: user.interests },
    { name: "Career Goal", val: user.careerGoal },
  ];

  const filledCount = fields.filter((f) => Boolean(f.val)).length;
  const percentage = Math.round((filledCount / fields.length) * 100);
  const missingFields = fields.filter((f) => !f.val).map((f) => f.name);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="bg-blue-500/20 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/20">
            Account Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-2">👤 My Student Profile</h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Update your academic details, skills, and AI recommendation preferences.
          </p>
        </div>

        {/* Profile Completion Badge */}
        <div className="bg-white/10 backdrop-blur border border-white/10 p-4 rounded-2xl text-center shrink-0 min-w-[180px]">
          <div className="flex items-center justify-between text-xs font-bold mb-1">
            <span>Completion</span>
            <span className="text-emerald-400">{percentage}%</span>
          </div>
          <div className="h-2.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>
          {missingFields.length > 0 && (
            <p className="text-[10px] text-amber-300 font-semibold mt-1">
              Missing: {missingFields.slice(0, 2).join(", ")}
            </p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div>
          <ProfileImage name={user.name} image={user.profile} />
        </div>

        <div className="lg:col-span-2">
          <EditProfileForm user={user} />
        </div>
      </div>

    </div>
  );
}