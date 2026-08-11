import CertificateQR from "./CertificateQR";

type Props = {
  fullName: string;
  eventTitle: string;
  certificateId: string;
  issueDate: string;
};

export default function CertificateTemplate({
  fullName,
  eventTitle,
  certificateId,
  issueDate,
}: Props) {
  return (
    <div className="flex justify-center py-10 bg-slate-100">

      <div
        id="certificate"
        className="relative bg-white shadow-2xl"
        style={{
          width: "1123px",
          height: "794px",
          border: "18px solid #1d4ed8",
          overflow: "hidden",
          fontFamily: "Arial, sans-serif",
        }}
      >

        {/* Top Border */}

        <div className="absolute top-0 left-0 w-full h-5 bg-blue-700" />

        {/* Bottom Border */}

        <div className="absolute bottom-0 left-0 w-full h-5 bg-blue-700" />

        {/* Watermark */}

        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: 0.04,
            fontSize: "180px",
            fontWeight: "bold",
            color: "#2563eb",
            userSelect: "none",
          }}
        >
          EA
        </div>

        {/* Content */}

        <div className="relative z-10 h-full px-16 py-14 flex flex-col">

          {/* Header */}

          <div className="text-center">

            <h1 className="text-6xl font-bold text-blue-700 tracking-wider">
              EVENT AGGREGATOR
            </h1>

            <p className="text-gray-600 mt-3 text-xl">
              Certificate of Participation
            </p>

          </div>

          {/* Body */}

          <div className="flex-1 flex flex-col items-center justify-center">

            <p className="text-2xl text-gray-600">
              This Certificate is Proudly Presented To
            </p>

            <h2 className="text-6xl font-bold text-blue-700 mt-6 uppercase">
              {fullName}
            </h2>

            <p className="text-2xl text-gray-600 mt-8">
              For Successfully Participating In
            </p>

            <h3 className="text-4xl font-bold text-gray-900 mt-5">
              {eventTitle}
            </h3>

            <p className="text-xl text-gray-600 mt-8 max-w-3xl text-center leading-9">
              Your dedication, enthusiasm and outstanding participation
              are highly appreciated. We wish you continued success in
              all your future endeavors.
            </p>

          </div>

          {/* Footer */}

          <div className="grid grid-cols-3 items-end">

            {/* Left */}

            <div>

              <p className="font-bold text-gray-700">
                Certificate ID
              </p>

              <p className="text-blue-700 font-semibold mt-1">
                {certificateId}
              </p>

              <p className="font-bold mt-5 text-gray-700">
                Issue Date
              </p>

              <p>{issueDate}</p>

            </div>

            {/* Center */}

            <div className="flex flex-col items-center">

              <div className="w-56 border-t-2 border-black mb-2" />

              <h3 className="font-bold text-lg">
                Event Coordinator
              </h3>

              <p className="text-gray-500">
                Event Aggregator
              </p>

            </div>

            {/* Right */}

            <div className="flex flex-col items-end">

              <CertificateQR
                value={`http://localhost:3000/verify/${certificateId}`}
              />

              <p className="text-sm text-gray-500 mt-2">
                Scan to Verify
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}