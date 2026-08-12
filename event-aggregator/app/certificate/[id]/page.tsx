import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import CertificateTemplate from "@/components/Certificates/CertificateTemplate";
import CertificateDownload from "@/components/Certificates/CertificateDownload";
import { formatDate } from "@/lib/date";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CertificatePage({
  params,
}: Props) {
  const { id } = await params;

  const registration = await prisma.registration.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!registration) {
    notFound();
  }

  if (!registration.certificateIssued) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-md w-full">
          <h1 className="text-4xl font-bold text-red-600">
            Certificate Not Issued
          </h1>

          <p className="mt-4 text-gray-600">
            This certificate has not been issued by the administrator yet.
          </p>
        </div>
      </main>
    );
  }

  const certificateId =
    registration.certificateId ??
    `EA-${new Date().getFullYear()}-${registration.id.toString().padStart(6, "0")}`;

  const issueDate = formatDate(
    registration.certificateIssuedAt || new Date()
  );

  return (
    <main className="min-h-screen bg-slate-100 py-10">
      <CertificateTemplate
        fullName={registration.fullName}
        eventTitle={registration.eventTitle}
        certificateId={certificateId}
        issueDate={issueDate}
      />

      <CertificateDownload />
    </main>
  );
}