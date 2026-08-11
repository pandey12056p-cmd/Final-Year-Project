"use client";

import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-8">

      <div className="flex justify-between items-center">

        <h1 className="text-5xl font-bold text-blue-700">
          Users Management
        </h1>

        <div className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold">
          Total Users : {users.length}
        </div>

      </div>

      <div className="bg-white shadow-lg rounded-xl mt-8 overflow-hidden">

        {loading ? (
          <div className="p-10 text-center text-xl">
            Loading...
          </div>
        ) : (

          <table className="w-full">

            <thead className="bg-blue-700 text-white">

              <tr>
                <th className="p-4 text-left">ID</th>
                <th className="p-4 text-left">Name</th>
                <th className="p-4 text-left">Email</th>
                <th className="p-4 text-left">Role</th>
                <th className="p-4 text-left">Created</th>
              </tr>

            </thead>

            <tbody>

              {users.map((user) => (

                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-4">{user.id}</td>

                  <td className="p-4 font-semibold">
                    {user.name}
                  </td>

                  <td className="p-4">
                    {user.email}
                  </td>

                  <td className="p-4">

                    <span
                      className={`px-3 py-1 rounded-full text-white text-sm ${
                        user.role === "admin"
                          ? "bg-red-600"
                          : "bg-green-600"
                      }`}
                    >
                      {user.role}
                    </span>

                  </td>

                  <td className="p-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>

    </main>
  );
}