import Link from "next/link";
import Button from "../Button/Button";

type EventCardProps = {
  id: number;
  title: string;
  image: string;
  date: string;
  location: string;
  description: string;
};

export default function EventCard({
  id,
  title,
  image,
  date,
  location,
  description,
}: EventCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300">

      <img
        src={image}
        alt={title}
        className="w-full h-56 object-cover"
      />

      <div className="p-6">

        <h2 className="text-3xl font-bold text-gray-800">
          {title}
        </h2>

        <p className="mt-4 text-gray-600">
          📅 {date}
        </p>

        <p className="mt-2 text-gray-600">
          📍 {location}
        </p>

        <p className="mt-5 text-gray-700">
          {description}
        </p>

        <div className="mt-6">
          <Link href={`/events/${id}`}>
            <Button>
              Register Now
            </Button>
          </Link>
        </div>

      </div>

    </div>
  );
}