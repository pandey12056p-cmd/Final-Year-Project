type Props = {
  student: string;
  event: string;
};

export default function CertificatePreview({
  student,
  event,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-12 border-8 border-blue-700">

      <div className="text-center">

        <h1 className="text-5xl font-bold text-blue-700">
          CERTIFICATE
        </h1>

        <p className="text-xl mt-2">
          OF PARTICIPATION
        </p>

        <p className="mt-16 text-xl">
          This Certificate is Proudly Presented To
        </p>

        <h2 className="text-5xl font-bold mt-6 text-slate-800">
          {student}
        </h2>

        <p className="mt-10 text-xl">
          for successfully participating in
        </p>

        <h3 className="text-4xl font-bold text-green-700 mt-5">
          {event}
        </h3>

        <p className="mt-12">
          Event Aggregator Platform
        </p>

        <div className="flex justify-between mt-20">

          <div>

            <div className="border-t w-48"></div>

            <p className="mt-2">
              Organizer
            </p>

          </div>

          <div>

            <div className="border-t w-48"></div>

            <p className="mt-2">
              Director
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}