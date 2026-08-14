"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    async function logout() {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (e) {
        console.error("Logout request failed:", e);
      } finally {
        localStorage.removeItem("user");
        router.push("/login");
      }
    }
    logout();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 shadow-lg text-center space-y-3">
        <div className="text-4xl animate-bounce">⏳</div>
        <h1 className="text-lg font-bold text-slate-800">Logging you out...</h1>
        <p className="text-slate-400 text-xs font-semibold">Please wait a moment.</p>
      </div>
    </div>
  );
}
