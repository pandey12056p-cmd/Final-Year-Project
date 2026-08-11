export default function ExportButtons() {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-3xl font-bold text-blue-700 mb-8">
        Export Reports
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <button className="bg-green-600 hover:bg-green-700 transition text-white rounded-2xl py-5 font-bold">
          📄 CSV
        </button>

        <button className="bg-blue-700 hover:bg-blue-800 transition text-white rounded-2xl py-5 font-bold">
          📊 Excel
        </button>

        <button className="bg-red-600 hover:bg-red-700 transition text-white rounded-2xl py-5 font-bold">
          📕 PDF
        </button>

        <button className="bg-slate-700 hover:bg-slate-800 transition text-white rounded-2xl py-5 font-bold">
          🖨 Print
        </button>

      </div>

    </div>
  );
}