import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

import CertificateVerify from "@/components/Certificates/CertificateVerify";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VerifyCertificatePage({
  params,
}: Props) {
  const { id } = await params;

  const registration = await prisma.registration.findFirst({
    where: {
      certificateId: id,
    },
  });

  if (!registration) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-7xl mb-5">❌</div>

          <h1 className="text-4xl font-bold text-red-600">
            Invalid Certificate
          </h1>

          <p className="mt-4 text-gray-600">
            This certificate does not exist or has been removed.
          </p>

        </div>
      </main>
    );
  }

  if (!registration.certificateIssued) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

          <div className="text-7xl mb-5">⚠️</div>

          <h1 className="text-4xl font-bold text-orange-600">
            Certificate Not Issued
          </h1>

          <p className="mt-4 text-gray-600">
            This certificate has not been issued yet.
          </p>

        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-6">

      <CertificateVerify
        fullName={registration.fullName}
        eventTitle={registration.eventTitle}
        certificateId={registration.certificateId!}
        issueDate={
          registration.certificateIssuedAt
            ? registration.certificateIssuedAt.toLocaleDateString("en-IN")
            : "-"
        }
      />

    </main>
  );
}