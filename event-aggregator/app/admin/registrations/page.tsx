import { prisma } from "@/lib/prisma";
import RegistrationSearchTable from "@/components/Dashboard/RegistrationSearchTable";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.registration.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <main className="min-h-screen bg-slate-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-5xl font-bold text-blue-700">
          Registrations Management
        </h1>

        <div className="bg-blue-700 text-white px-6 py-3 rounded-xl font-bold">
          Total: {registrations.length}
        </div>
      </div>

      <RegistrationSearchTable
        registrations={registrations}
      />
    </main>
  );
}