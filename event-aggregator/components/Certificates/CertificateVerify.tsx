type Props = {
  fullName: string;
  eventTitle: string;
  certificateId: string;
  issueDate: string;
};

export default function CertificateVerify({
  fullName,
  eventTitle,
  certificateId,
  issueDate,
}: Props) {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl p-10">

      <div className="text-center">

        <div className="text-7xl mb-5">
          ✅
        </div>

        <h1 className="text-4xl font-bold text-green-700">
          Certificate Verified
        </h1>

        <p className="text-gray-500 mt-3">
          This certificate is valid and has been issued by
          <strong> Event Aggregator</strong>.
        </p>

      </div>

      <div className="mt-10 space-y-5">

        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold text-gray-600">
            Student Name
          </span>

          <span className="font-bold">
            {fullName}
          </span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold text-gray-600">
            Event
          </span>

          <span className="font-bold">
            {eventTitle}
          </span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold text-gray-600">
            Certificate ID
          </span>

          <span className="font-bold text-blue-700">
            {certificateId}
          </span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold text-gray-600">
            Issue Date
          </span>

          <span className="font-bold">
            {issueDate}
          </span>
        </div>

        <div className="flex justify-between pb-3">
          <span className="font-semibold text-gray-600">
            Status
          </span>

          <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
            VERIFIED
          </span>
        </div>

      </div>

    </div>
  );
}