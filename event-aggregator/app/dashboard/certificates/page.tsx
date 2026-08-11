import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

import CertificateList from "@/components/Certificates/CertificateList";
import EmptyCertificate from "@/components/Certificates/EmptyCertificate";

export default async function MyCertificatesPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = jwt.decode(token) as {
    id: number;
  };

  if (!decoded?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const certificates = await prisma.registration.findMany({
    where: {
      email: user.email,
      certificateIssued: true,
    },
    orderBy: {
      certificateIssuedAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="max-w-7xl mx-auto">

        <div className="mb-10">
          <h1 className="text-4xl font-bold text-blue-700">
            🏆 My Certificates
          </h1>

          <p className="text-gray-500 mt-2">
            View, download and verify all your issued certificates.
          </p>
        </div>

        {certificates.length === 0 ? (
          <EmptyCertificate />
        ) : (
          <CertificateList certificates={certificates} />
        )}
      </div>
    </main>
  );
}