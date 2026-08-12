import { formatDate } from "@/lib/date";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: Date | string;
};

type LatestUsersProps = {
  users: User[];
};

export default function LatestUsers({ users }: LatestUsersProps) {
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}

      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 px-8 py-6">
        <h2 className="text-3xl font-bold text-white">
          Latest Users
        </h2>

        <p className="text-blue-100 mt-2">
          Recently registered students
        </p>
      </div>

      <div className="p-6 space-y-5">
        {users.length === 0 ? (
          <div className="text-center py-10 text-gray-500">
            No users found.
          </div>
        ) : (
          users.map((user) => (
            <div
              key={user.id}
              className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition"
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}

                <div className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="font-bold text-lg text-slate-800">
                    {user.name}
                  </h3>

                  <p className="text-gray-500">
                    {user.email}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    Joined {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>

              <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                {user.role}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}