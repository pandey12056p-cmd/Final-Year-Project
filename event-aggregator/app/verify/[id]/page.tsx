import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CertificateVerify from "@/components/Certificates/CertificateVerify";
import { formatDate } from "@/lib/date";

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
      <main className="min-h-screen flex items-center justify-center bg-[#0b0f19] p-6">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-5">❌</div>

          <h1 className="text-2xl font-bold text-red-500">
            Invalid Certificate
          </h1>

          <p className="mt-3 text-slate-400 text-sm leading-6">
            This certificate reference does not exist in the database or has been revoked.
          </p>

          <div className="mt-6">
            <Link href="/" className="inline-block px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!registration.certificateIssued) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#0b0f19] p-6">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl p-10 text-center max-w-md w-full">
          <div className="text-6xl mb-5">⚠️</div>

          <h1 className="text-2xl font-bold text-amber-500">
            Certificate Not Issued
          </h1>

          <p className="mt-3 text-slate-400 text-sm leading-6">
            The registration exists, but the certificate has not been finalized and issued by the administrator.
          </p>

          <div className="mt-6">
            <Link href="/" className="inline-block px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0b0f19] py-10 px-6 flex items-center justify-center">
      <CertificateVerify
        fullName={registration.fullName}
        eventTitle={registration.eventTitle}
        certificateId={registration.certificateId!}
        issueDate={formatDate(registration.certificateIssuedAt)}
      />
    </main>
  );
}