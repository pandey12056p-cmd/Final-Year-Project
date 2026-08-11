import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Link from "next/link";

import ProfileHeader from "@/components/Student/ProfileHeader";
import ProfileCard from "@/components/Student/ProfileCard";
import ProfileStats from "@/components/Student/ProfileStats";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-red-600">
          Please Login First
        </h1>
      </main>
    );
  }

  const decoded = jwt.decode(token) as {
    id: number;
  };

  if (!decoded?.id) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-red-600">
          Invalid Token
        </h1>
      </main>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          User Not Found
        </h1>
      </main>
    );
  }

  const registrations = await prisma.registration.findMany({
    where: {
      email: user.email,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const upcomingEvents = await prisma.event.count({
    where: {
      status: "Upcoming",
    },
  });

  const certificates = await prisma.event.count({
    where: {
      certificateAvailable: true,
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      {/* Header */}
      <ProfileHeader
        name={user.name}
        email={user.email}
      />

      {/* Edit Profile */}
      <div className="mt-6">
        <Link
          href="/dashboard/profile"
          className="inline-block bg-blue-700 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          ✏️ Edit Profile
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8">
        <ProfileStats
          registrations={registrations.length}
          certificates={certificates}
          upcoming={upcomingEvents}
        />
      </div>

      {/* Profile + Registrations */}
      <div className="grid lg:grid-cols-3 gap-8 mt-8">

        {/* Profile Card */}
        <div>
          <ProfileCard
            name={user.name}
            image={user.profile}
            phone={user.phone}
            college={user.college}
            branch={user.branch}
            year={user.year}
          />
        </div>

        {/* Recent Registrations */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-lg p-8">

          <h2 className="text-3xl font-bold text-blue-700 mb-6">
            Recent Registrations
          </h2>

          {registrations.length === 0 ? (
            <p className="text-gray-500">
              You have not registered for any event yet.
            </p>
          ) : (
            <div className="space-y-4">

              {registrations.map((registration) => (
                <div
                  key={registration.id}
                  className="border rounded-2xl p-5 hover:bg-slate-50 transition"
                >
                  <h3 className="text-xl font-bold text-gray-800">
                    {registration.eventTitle}
                  </h3>

                  <div className="mt-2 text-sm text-gray-500">
                    Registered on{" "}
                    {new Date(
                      registration.createdAt
                    ).toLocaleDateString()}
                  </div>

                  <div className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">

                    <p>
                      <strong>College:</strong>{" "}
                      {registration.college}
                    </p>

                    <p>
                      <strong>Branch:</strong>{" "}
                      {registration.branch}
                    </p>

                    <p>
                      <strong>Year:</strong>{" "}
                      {registration.year}
                    </p>

                    <p>
                      <strong>Phone:</strong>{" "}
                      {registration.phone}
                    </p>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>

      </div>

    </main>
  );
}
