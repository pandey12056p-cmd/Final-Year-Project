"use client";

import { QRCode } from "react-qrcode-logo";

type Props = {
  value: string;
};

export default function CertificateQR({ value }: Props) {
  return (
    <div className="bg-white p-2 rounded-lg shadow inline-block">
      <QRCode
        value={value}
        size={100}
        bgColor="#ffffff"
        fgColor="#000000"
        ecLevel="H"
      />
    </div>
  );
}