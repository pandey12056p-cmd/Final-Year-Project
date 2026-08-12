import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";
import ProfileImage from "@/components/Student/ProfileImage";
import EditProfileForm from "@/components/Student/EditProfileForm";

export default async function ProfilePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="text-3xl font-bold text-slate-800">Please Login</h1>
          <p className="text-gray-500 mt-2">You must be logged in to view your profile.</p>
          <Link
            href="/login"
            className="inline-block mt-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Go to Login
          </Link>
        </div>
      </main>
    );
  }

  let userId: number | null = null;
  try {
    const decoded = jwt.decode(token) as { id: number };
    userId = decoded?.id || null;
  } catch (err) {
    console.error(err);
  }

  if (!userId) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-red-600">Invalid Session</h1>
          <p className="text-gray-500 mt-2">Please log in again.</p>
          <Link
            href="/login"
            className="inline-block mt-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Login Again
          </Link>
        </div>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <h1 className="text-3xl font-bold text-slate-800">User Not Found</h1>
          <Link
            href="/login"
            className="inline-block mt-6 bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            Back to Login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-700">My Profile</h1>
            <p className="text-gray-500 mt-1">Manage your account information</p>
          </div>
          <Link
            href="/dashboard"
            className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-3 rounded-xl transition"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div>
            <ProfileImage name={user.name} image={user.profile} />
          </div>
          <div className="lg:col-span-2">
            <EditProfileForm user={user} />
          </div>
        </div>
      </div>
    </main>
  );
}
