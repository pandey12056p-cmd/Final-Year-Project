type Props = {
  name: string;
  email: string;
  image?: string | null;
  phone?: string | null;
  college?: string | null;
  branch?: string | null;
  year?: string | null;
  skills?: string | null;
};

export default function ProfileHeader({
  name,
  email,
  image,
  phone,
  college,
  branch,
  year,
  skills,
}: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 p-6 md:p-8 text-white shadow-xl border border-slate-800">
      {/* Background Decorative Glows */}
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-blue-600/15 blur-3xl pointer-events-none" />
      <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-indigo-600/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left w-full md:w-auto">
          {/* Avatar */}
          <div className="relative shrink-0">
            {image ? (
              <img
                src={image}
                alt={name}
                className="h-24 w-24 rounded-2xl object-cover ring-2 ring-blue-500/40 shadow-lg"
              />
            ) : (
              <div className="h-24 w-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-4xl font-black ring-2 ring-blue-500/40 shadow-lg text-white">
                {name.charAt(0).toUpperCase()}
              </div>
            )}
            <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border-2 border-slate-950 shadow-sm">
              Verified ✅
            </span>
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-0.5 rounded-full text-[11px] font-semibold text-blue-200 border border-white/10">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Official Student Dashboard
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {name}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm font-medium">
              {email} {phone ? `• 📱 ${phone}` : ""}
            </p>

            {/* Academic Detail Pills */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
              {college && (
                <span className="bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px] px-3 py-1 rounded-xl font-medium">
                  🏛️ {college}
                </span>
              )}

              {branch && (
                <span className="bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px] px-3 py-1 rounded-xl font-medium">
                  🎓 {branch}
                </span>
              )}

              {year && (
                <span className="bg-slate-800/90 border border-slate-700 text-slate-200 text-[11px] px-3 py-1 rounded-xl font-medium">
                  📅 {year}
                </span>
              )}
            </div>

            {skills && (
              <div className="pt-1.5 text-xs text-blue-200 flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
                <span className="font-semibold text-slate-300">Technical Skills:</span>
                <span className="bg-blue-900/60 border border-blue-700/50 px-2.5 py-0.5 rounded-lg text-blue-100 font-mono text-[11px]">
                  {skills}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}