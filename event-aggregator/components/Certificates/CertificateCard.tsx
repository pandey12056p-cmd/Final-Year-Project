import Link from "next/link";
import { formatDate } from "@/lib/date";

type Props = {
  id: number;
  eventTitle: string;
  certificateId: string;
  issuedAt: Date | string | null;
};

export default function CertificateCard({
  id,
  eventTitle,
  certificateId,
  issuedAt,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6 border hover:shadow-xl transition">
      <h2 className="text-2xl font-bold text-blue-700">
        {eventTitle}
      </h2>

      <p className="mt-4">
        <strong>Certificate ID:</strong> {certificateId}
      </p>

      <p className="mt-2">
        <strong>Issued On:</strong> {formatDate(issuedAt)}
      </p>

      <div className="flex gap-3 mt-6">
        <Link
          href={`/certificate/${id}`}
          target="_blank"
          className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded-lg"
        >
          👁 View
        </Link>

        <Link
          href={`/certificate/${id}?autoDownload=true`}
          target="_blank"
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
        >
          📄 Download
        </Link>

        <Link
          href={`/verify/${certificateId}`}
          target="_blank"
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
        >
          ✅ Verify
        </Link>
      </div>
    </div>
  );
}