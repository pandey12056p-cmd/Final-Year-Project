"use client";

import QRCode from "react-qr-code";

type Props = {
  value: string;
};

export default function CertificateQR({ value }: Props) {
  return (
    <div className="bg-white p-2 rounded-lg shadow">
      <QRCode
        value={value}
        size={100}
        bgColor="#ffffff"
        fgColor="#000000"
        level="H"
      />
    </div>
  );
}