import CertificateCard from "./CertificateCard";

type Certificate = {
  id: number;
  eventTitle: string;
  certificateId: string | null;
  certificateIssuedAt: Date | null;
};

type Props = {
  certificates: Certificate[];
};

export default function CertificateList({
  certificates,
}: Props) {
  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {certificates.map((certificate) => (
        <CertificateCard
          key={certificate.id}
          id={certificate.id}
          eventTitle={certificate.eventTitle}
          certificateId={certificate.certificateId ?? "-"}
          issuedAt={certificate.certificateIssuedAt}
        />
      ))}
    </div>
  );
}