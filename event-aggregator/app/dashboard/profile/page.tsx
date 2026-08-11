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
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold">
          Please Login
        </h1>
      </main>
    );
  }

  const decoded = jwt.decode(token) as {
    id: number;
  };

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1>User Not Found</h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <h1 className="text-4xl font-bold text-blue-700 mb-8">
        My Profile
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        <div>
          <ProfileImage
            name={user.name}
            image={user.profile}
          />
        </div>

        <div className="lg:col-span-2">
          <EditProfileForm
            user={user}
          />
        </div>

      </div>

    </main>
  );
}