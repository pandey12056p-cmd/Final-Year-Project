export default function SettingsPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-10">

      <div className="bg-white rounded-3xl shadow-xl p-10">

        <h1 className="text-5xl font-bold text-blue-700">
          Settings
        </h1>

        <p className="text-gray-500 mt-4">
          Manage your application settings.
        </p>

        <div className="mt-10 space-y-6">

          <div>

            <label className="font-semibold">
              Website Name
            </label>

            <input
              className="border p-3 rounded-xl w-full mt-2"
              defaultValue="Event Aggregator"
            />

          </div>

          <div>

            <label className="font-semibold">
              Admin Email
            </label>

            <input
              className="border p-3 rounded-xl w-full mt-2"
              defaultValue="admin@event.com"
            />

          </div>

          <button className="bg-blue-700 text-white px-8 py-4 rounded-xl">
            Save Settings
          </button>

        </div>

      </div>

    </main>
  );
}