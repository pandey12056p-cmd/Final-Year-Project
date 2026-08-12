export default function HelpPage() {
  const faqs = [
    {
      q: "How do I download my event certificate?",
      a: "Once an Admin issues your certificate after event completion, navigate to 'My Certificates' or your Dashboard. Click the '📄 PDF Download' button for single-click download.",
    },
    {
      q: "How does the QR verification work?",
      a: "Every issued certificate has a unique Certificate ID and QR code. Anyone can visit `/verify/[certificateId]` to verify official authenticity.",
    },
    {
      q: "How does the AI Advisor work?",
      a: "The AI Advisor matches your branch, year, skills, interests, and career goals with live events in the Prisma database, giving a 0–100% match score.",
    },
    {
      q: "Can I cancel a registration?",
      a: "You can view your confirmed registrations under 'My Registrations'. Contact your college event coordinator for deadline cancellations.",
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 rounded-3xl text-white shadow-xl border border-slate-800">
        <span className="bg-blue-500/20 text-blue-200 text-xs font-bold px-3 py-1 rounded-full border border-blue-400/20">
          Support Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-black mt-2">❓ Help & Frequently Asked Questions</h1>
        <p className="text-slate-300 text-xs sm:text-sm mt-1">
          Find instant answers about event registrations, certificate downloads, and AI recommendations.
        </p>
      </div>

      {/* FAQs List */}
      <div className="bg-white rounded-3xl shadow-md border border-slate-200/80 p-6 md:p-8 space-y-4">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
          <span>💡</span> Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="p-5 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-700">Q:</span> {faq.q}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
