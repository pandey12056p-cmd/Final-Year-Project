import Link from "next/link";

type Props = {
  name: string;
  image?: string | null;
  phone?: string | null;
  college?: string | null;
  branch?: string | null;
  year?: string | null;
  skills?: string | null;
};

export default function ProfileCard({
  name,
  image,
  phone,
  college,
  branch,
  year,
  skills,
}: Props) {
  const isComplete = Boolean(phone && college && branch && year);

  return (
    <div className="bg-white rounded-3xl shadow-lg border border-slate-200/80 p-6 space-y-6">
      {/* Student Card Top Section */}
      <div className="flex flex-col items-center text-center space-y-3 pb-6 border-b border-slate-100">
        <div className="relative">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-28 h-28 rounded-3xl object-cover border-4 border-blue-600 shadow-md"
            />
          ) : (
            <div className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-blue-700 to-indigo-600 text-white text-5xl font-black flex items-center justify-center shadow-lg">
              {name.charAt(0).toUpperCase()}
            </div>
          )}

          <span className="absolute -bottom-2 bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow border-2 border-white flex items-center gap-1">
            Verified Student ✅
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            {name}
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-0.5">
            College Student • Member
          </p>
        </div>

        {/* Profile Completeness Pill */}
        <div className="pt-1">
          {isComplete ? (
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full border border-emerald-200">
              Profile 100% Complete ✨
            </span>
          ) : (
            <span className="bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full border border-amber-200">
              Profile Incomplete (Missing details)
            </span>
          )}
        </div>
      </div>

      {/* Info Rows */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
          Student Information
        </h3>

        <div className="space-y-3">
          <InfoRow icon="📱" label="Phone" value={phone} />
          <InfoRow icon="🏛️" label="College" value={college} />
          <InfoRow icon="🎓" label="Branch" value={branch} />
          <InfoRow icon="📅" label="Academic Year" value={year} />
          {skills && <InfoRow icon="💡" label="Technical Skills" value={skills} />}
        </div>
      </div>

      {/* Action Edit Button */}
      <Link
        href="/dashboard/profile"
        className="w-full bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-sm font-bold py-3.5 rounded-2xl transition border border-slate-200 text-center flex items-center justify-center gap-2"
      >
        <span>✏️</span> Update Student Profile
      </Link>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
      <div className="flex items-center gap-2 font-semibold text-slate-600">
        <span>{icon}</span>
        <span>{label}</span>
      </div>
      <span className={`font-bold ${value ? "text-slate-800" : "text-slate-400 italic"}`}>
        {value || "Not specified"}
      </span>
    </div>
  );
}