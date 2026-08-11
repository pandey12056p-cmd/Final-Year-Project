import Sidebar from "@/components/Admin/Sidebar";
import Navbar from "@/components/Admin/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-100">

      <div className="flex">

        {/* Sidebar */}

        <div className="hidden lg:block">

          <Sidebar />

        </div>

        {/* Main */}

        <div className="flex-1">

          <div className="p-6">

            <Navbar />

            <div className="mt-6">

              {children}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}