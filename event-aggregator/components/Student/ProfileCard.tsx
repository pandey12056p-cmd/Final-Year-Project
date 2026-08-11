type Props = {
  name: string;
  image?: string | null;
  phone?: string | null;
  college?: string | null;
  branch?: string | null;
  year?: string | null;
};

export default function ProfileCard({
  name,
  image,
  phone,
  college,
  branch,
  year,
}: Props) {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-6">

      <div className="flex flex-col items-center mb-8">

        {image ? (
          <img
            src={image}
            alt={name}
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-600"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-blue-700 text-white text-5xl font-bold flex items-center justify-center">
            {name.charAt(0).toUpperCase()}
          </div>
        )}

        <h2 className="mt-4 text-2xl font-bold">
          {name}
        </h2>

        <p className="text-gray-500">
          Student
        </p>

      </div>

      <hr className="mb-6" />

      <h3 className="text-xl font-bold text-blue-700 mb-5">
        Personal Information
      </h3>

      <div className="space-y-5">

        <Info
          label="Phone"
          value={phone}
        />

        <Info
          label="College"
          value={college}
        />

        <Info
          label="Branch"
          value={branch}
        />

        <Info
          label="Year"
          value={year}
        />

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex justify-between border-b pb-3">

      <span className="font-semibold text-gray-600">
        {label}
      </span>

      <span className="text-gray-800">
        {value || "-"}
      </span>

    </div>
  );
}