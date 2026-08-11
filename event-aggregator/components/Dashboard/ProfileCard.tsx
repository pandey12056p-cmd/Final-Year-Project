type ProfileCardProps = {
  name: string;
  email: string;
  role: string;
};

export default function ProfileCard({
  name,
  email,
  role,
}: ProfileCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">
        👤 Profile Information
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <p className="text-gray-500 text-sm">Full Name</p>
          <p className="text-lg font-semibold">{name}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Email</p>
          <p className="text-lg font-semibold">{email}</p>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Role</p>
          <span className="inline-block mt-1 bg-blue-100 text-blue-700 px-4 py-1 rounded-full font-semibold capitalize">
            {role}
          </span>
        </div>

        <div>
          <p className="text-gray-500 text-sm">Account Status</p>
          <span className="inline-block mt-1 bg-green-100 text-green-700 px-4 py-1 rounded-full font-semibold">
            Active
          </span>
        </div>
      </div>
    </div>
  );
}