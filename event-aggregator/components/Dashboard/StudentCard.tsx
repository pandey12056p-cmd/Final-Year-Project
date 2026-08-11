type StudentCardProps = {
  name: string;
  email: string;
  role: string;
};

export default function StudentCard({
  name,
  email,
  role,
}: StudentCardProps) {
  return (
    <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-3xl shadow-xl p-8">
      <h1 className="text-4xl font-bold">
        👋 Welcome {name}
      </h1>

      <p className="mt-3 text-lg text-blue-100">
        Welcome back to Event Aggregator
      </p>

      <div className="mt-6 flex flex-col md:flex-row gap-4">
        <div className="bg-white/20 rounded-xl px-5 py-3">
          <p className="text-sm text-blue-100">Email</p>
          <p className="font-semibold">{email}</p>
        </div>

        <div className="bg-white/20 rounded-xl px-5 py-3">
          <p className="text-sm text-blue-100">Role</p>
          <p className="font-semibold capitalize">{role}</p>
        </div>
      </div>
    </div>
  );
}