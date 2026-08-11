import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import RegistrationForm from "@/components/RegistrationForm/RegistrationForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EventDetails({ params }: Props) {
  const { id } = await params;

  const event = await prisma.event.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!event) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 py-10 px-6">
      {/* Event Card */}

      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
        <Image
          src={event.image}
          alt={event.title}
          width={1400}
          height={700}
          className="w-full h-[450px] object-cover"
        />

        <div className="p-10">
          <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold">
            {event.category}
          </span>

          <h1 className="mt-5 text-5xl font-bold text-gray-900">
            {event.title}
          </h1>

          <p className="mt-6 text-lg text-gray-700 leading-8">
            {event.description}
          </p>

          {/* Information */}

          <div className="grid md:grid-cols-2 gap-6 mt-10">
            {/* Event Information */}

            <div className="bg-blue-50 rounded-2xl p-6 shadow">
              <h3 className="text-xl font-bold text-blue-700 mb-5">
                Event Information
              </h3>

              <div className="space-y-4 text-gray-700">
                <p>
                  📅 <strong>Date :</strong>{" "}
                  {new Date(event.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <p>
                  📍 <strong>Location :</strong> {event.location}
                </p>

                <p>
                  🏢 <strong>Organizer :</strong> {event.organizer}
                </p>

                <p>
                  💻 <strong>Mode :</strong> {event.mode}
                </p>

                <p>
                  👥 <strong>Team Size :</strong> {event.teamSize}
                </p>
              </div>
            </div>

            {/* Registration Information */}

            <div className="bg-green-50 rounded-2xl p-6 shadow">
              <h3 className="text-xl font-bold text-green-700 mb-5">
                Registration Details
              </h3>

              <div className="space-y-4 text-gray-700">
                <p>
                  🏆 <strong>Prize :</strong> ₹{event.prize}
                </p>

                <p>
                  👨‍🎓 <strong>Max Participants :</strong>{" "}
                  {event.maxParticipants}
                </p>

                <p>
                  ⏳ <strong>Registration Deadline :</strong>{" "}
                  {new Date(event.registrationDeadline).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    }
                  )}
                </p>

                <p>
                  📜 <strong>Certificate :</strong>{" "}
                  {event.certificateAvailable
                    ? "Available"
                    : "Not Available"}
                </p>

                <p>
                  🚦 <strong>Status :</strong>{" "}
                  <span
                    className={`font-semibold ${
                      event.status === "Upcoming"
                        ? "text-green-600"
                        : event.status === "Completed"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {event.status}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}

      <div className="max-w-6xl mx-auto mt-10">
        <RegistrationForm
          eventId={event.id}
          eventTitle={event.title}
        />
      </div>
    </main>
  );
}