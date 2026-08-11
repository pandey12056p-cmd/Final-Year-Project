type Props = {
  name: string;
  email: string;
};

export default function ProfileHeader({
  name,
  email,
}: Props) {
  return (
    <div className="rounded-3xl bg-gradient-to-r from-blue-700 via-indigo-600 to-purple-700 p-8 text-white shadow-xl">
      <div className="flex flex-col md:flex-row items-center gap-6">
        <div className="h-28 w-28 rounded-full bg-white/20 flex items-center justify-center text-5xl font-bold border-4 border-white">
          {name.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <h1 className="text-4xl font-bold">
            Welcome, {name}
          </h1>

          <p className="text-blue-100 mt-2">
            {email}
          </p>

          <p className="mt-4 text-blue-50">
            Manage your profile, registrations and certificates.
          </p>
        </div>
      </div>
    </div>
  );
}