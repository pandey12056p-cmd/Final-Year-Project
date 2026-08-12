"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/date";

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
        if (Array.isArray(data)) {
          setUsers(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mt-8 overflow-x-auto">
        {loading ? (
          <div className="p-10 text-center text-xs text-slate-400 font-bold animate-pulse">
            Loading...
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/75 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">ID</th>
                <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Name</th>
                <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Email</th>
                <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Role</th>
                <th className="px-5 py-3.5 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">Created</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/50 transition"
                >
                  <td className="px-5 py-3 text-xs font-bold text-slate-500">{user.id}</td>

                  <td className="px-5 py-3 text-xs font-bold text-slate-800 flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-[10px] shadow-sm">
                      {user.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span>{user.name}</span>
                  </td>

                  <td className="px-5 py-3 text-xs font-semibold text-slate-500">
                    {user.email}
                  </td>

                  <td className="px-5 py-3 text-xs">
                    <span
                      className={`font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wider border ${
                        user.role === "admin"
                          ? "bg-red-50 text-red-600 border-red-100"
                          : "bg-green-50 text-green-600 border-green-100"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-5 py-3 text-xs font-semibold text-slate-500">
                    {formatDate(user.createdAt)}
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}