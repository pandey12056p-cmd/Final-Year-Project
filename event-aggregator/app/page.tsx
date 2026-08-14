import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#fcfdff] relative overflow-hidden flex flex-col justify-between">
      
      {/* ── Background Mesh Gradients & Shapes ── */}
      <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-purple-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-12 left-0 w-[450px] h-[450px] bg-blue-200/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-indigo-200/15 rounded-full blur-3xl pointer-events-none" />

      {/* Floating Orbs */}
      <div className="absolute top-[28%] left-[8%] w-3 h-3 bg-blue-400/30 rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[18%] right-[12%] w-4 h-4 bg-purple-400/25 rounded-full pointer-events-none animate-pulse" />
      <div className="absolute top-[48%] right-[8%] w-3 h-3 bg-indigo-400/35 rounded-full pointer-events-none" />

      {/* Dotted Grid Patterns */}
      <div className="absolute top-10 left-10 w-24 h-24 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1.2px, transparent 1.2px)", backgroundSize: "12px 12px" }} />
      <div className="absolute top-20 right-10 w-28 h-28 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(#000 1.2px, transparent 1.2px)", backgroundSize: "12px 12px" }} />

      {/* ── Left Side College Building Vector Art ── */}
      <div className="absolute bottom-[20%] left-[-2%] w-[260px] h-[280px] opacity-[0.08] hidden xl:block pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-blue-900 w-full h-full">
          <rect x="5" y="40" width="35" height="55" rx="2" strokeWidth="1" />
          <rect x="40" y="20" width="45" height="75" rx="2" strokeWidth="1" />
          <rect x="85" y="50" width="12" height="45" rx="1" strokeWidth="1" />
          {/* Windows */}
          <line x1="12" y1="48" x2="16" y2="48" strokeWidth="1" />
          <line x1="12" y1="56" x2="16" y2="56" strokeWidth="1" />
          <line x1="12" y1="64" x2="16" y2="64" strokeWidth="1" />
          <line x1="12" y1="72" x2="16" y2="72" strokeWidth="1" />
          
          <line x1="24" y1="48" x2="28" y2="48" strokeWidth="1" />
          <line x1="24" y1="56" x2="28" y2="56" strokeWidth="1" />
          <line x1="24" y1="64" x2="28" y2="64" strokeWidth="1" />
          <line x1="24" y1="72" x2="28" y2="72" strokeWidth="1" />

          <line x1="48" y1="28" x2="52" y2="28" strokeWidth="1" />
          <line x1="48" y1="36" x2="52" y2="36" strokeWidth="1" />
          <line x1="48" y1="44" x2="52" y2="44" strokeWidth="1" />
          <line x1="48" y1="52" x2="52" y2="52" strokeWidth="1" />
          <line x1="48" y1="60" x2="52" y2="60" strokeWidth="1" />
          <line x1="48" y1="68" x2="52" y2="68" strokeWidth="1" />

          <line x1="60" y1="28" x2="64" y2="28" strokeWidth="1" />
          <line x1="60" y1="36" x2="64" y2="36" strokeWidth="1" />
          <line x1="60" y1="44" x2="64" y2="44" strokeWidth="1" />
          <line x1="60" y1="52" x2="64" y2="52" strokeWidth="1" />
          <line x1="60" y1="60" x2="64" y2="60" strokeWidth="1" />
          <line x1="60" y1="68" x2="64" y2="68" strokeWidth="1" />

          <line x1="72" y1="28" x2="76" y2="28" strokeWidth="1" />
          <line x1="72" y1="36" x2="76" y2="36" strokeWidth="1" />
          <line x1="72" y1="44" x2="76" y2="44" strokeWidth="1" />
          <line x1="72" y1="52" x2="76" y2="52" strokeWidth="1" />
          <line x1="72" y1="60" x2="76" y2="60" strokeWidth="1" />
          <line x1="72" y1="68" x2="76" y2="68" strokeWidth="1" />
        </svg>
      </div>

      {/* ── Main Hero Area ── */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-8 text-center relative z-10 w-full">
        
        {/* Rounded Purple Pill Badge */}
        <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 text-purple-700 text-[11px] font-bold px-4 py-1.5 rounded-full mb-6 tracking-wide shadow-sm">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          The Ultimate College Event Platform
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 leading-tight tracking-tight">
          Discover. Engage. Excel.
          <br />
          All <span className="text-blue-600">College Events</span>, One Place.
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-xs md:text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
          Find hackathons, workshops, cultural fests, sports, technical events and more
          happening across colleges near you.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            href="/events"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 transition px-6 py-3 rounded-xl text-white font-bold text-xs shadow-lg shadow-blue-500/15 active:scale-95 cursor-pointer"
          >
            Explore Events →
          </Link>

          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-800 transition px-6 py-3 rounded-xl font-bold text-xs shadow-sm active:scale-95 cursor-pointer"
          >
            🎓 Student Portal Login
          </Link>

          <Link
            href="/college/login"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-950 border border-slate-800 text-slate-205 hover:text-white transition px-6 py-3 rounded-xl font-bold text-xs shadow-md active:scale-95 cursor-pointer"
          >
            🏢 College Organizer Login
          </Link>

          <Link
            href="/register"
            className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 hover:text-indigo-800 transition px-6 py-3 rounded-xl font-bold text-xs active:scale-95 cursor-pointer"
          >
            ➕ Register Account
          </Link>
        </div>

        {/* ── Stats Card Section ── */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md flex flex-col md:flex-row items-stretch divide-y md:divide-y-0 md:divide-x divide-slate-100 max-w-4xl mx-auto mt-8 relative z-10">
          
          {/* Card 1 */}
          <div className="flex-1 flex items-center justify-center md:justify-start gap-3.5 p-4.5">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-lg font-extrabold text-blue-600 leading-tight">100+</p>
              <p className="text-xs font-bold text-slate-800">Events</p>
              <p className="text-[10px] text-slate-400 font-semibold">Happening Every Month</p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex-1 flex items-center justify-center md:justify-start gap-3.5 p-4.5">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-lg font-extrabold text-purple-600 leading-tight">5K+</p>
              <p className="text-xs font-bold text-slate-800">Students</p>
              <p className="text-[10px] text-slate-400 font-semibold">Actively Participating</p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex-1 flex items-center justify-center md:justify-start gap-3.5 p-4.5">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-lg font-extrabold text-emerald-600 leading-tight">50+</p>
              <p className="text-xs font-bold text-slate-800">Colleges</p>
              <p className="text-[10px] text-slate-400 font-semibold">Across the Platform</p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex-1 flex items-center justify-center md:justify-start gap-3.5 p-4.5">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a3 3 0 10-3-3v3h3zm-13-3a3 3 0 103 3V7H7z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-lg font-extrabold text-orange-600 leading-tight">20+</p>
              <p className="text-xs font-bold text-slate-800">Event Categories</p>
              <p className="text-[10px] text-slate-400 font-semibold">Something for Everyone</p>
            </div>
          </div>

        </div>

      </section>

      {/* ── Categories Section ── */}
      <section id="categories" className="max-w-6xl w-full mx-auto px-6 pb-12 relative z-10 scroll-mt-20">
        
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-xl font-extrabold text-slate-800">
            Explore Events by Category
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-semibold">
            Find events that match your interests
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-2">
            <div className="w-8 h-0.5 bg-blue-600 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4.5 mt-8">
          
          {/* Tech */}
          <div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-4.5 flex flex-col items-center text-center cursor-pointer hover:-translate-y-0.5 group">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-800 mt-3">Technical</h3>
            <p className="text-[9.5px] text-slate-400 font-semibold mt-1">Code, Hack, Innovate</p>
          </div>

          {/* Cultural */}
          <div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-4.5 flex flex-col items-center text-center cursor-pointer hover:-translate-y-0.5 group">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-800 mt-3">Cultural</h3>
            <p className="text-[9.5px] text-slate-400 font-semibold mt-1">Art, Music, Dance</p>
          </div>

          {/* Sports */}
          <div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-4.5 flex flex-col items-center text-center cursor-pointer hover:-translate-y-0.5 group">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5a2 2 0 10-2 2h2zm0 0h4m-4 0H8m12 3a3 3 0 10-3-3v3h3zm-13-3a3 3 0 103 3V7H7z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-800 mt-3">Sports</h3>
            <p className="text-[9.5px] text-slate-400 font-semibold mt-1">Compete & Win</p>
          </div>

          {/* Workshops */}
          <div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-4.5 flex flex-col items-center text-center cursor-pointer hover:-translate-y-0.5 group">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-800 mt-3">Workshops</h3>
            <p className="text-[9.5px] text-slate-400 font-semibold mt-1">Learn & Grow</p>
          </div>

          {/* Hackathons */}
          <div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-4.5 flex flex-col items-center text-center cursor-pointer hover:-translate-y-0.5 group">
            <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-pink-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-800 mt-3">Hackathons</h3>
            <p className="text-[9.5px] text-slate-400 font-semibold mt-1">Build & Solve</p>
          </div>

          {/* Competitions */}
          <div className="bg-white rounded-2xl border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-md transition-all duration-300 p-4.5 flex flex-col items-center text-center cursor-pointer hover:-translate-y-0.5 group">
            <div className="w-10 h-10 rounded-full bg-cyan-50 flex items-center justify-center text-cyan-600 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.907c.961 0 1.357 1.235.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.575-.389-1.81.588-1.81h4.907a1 1 0 00.95-.69l1.519-4.674z" />
              </svg>
            </div>
            <h3 className="text-xs font-bold text-slate-800 mt-3">Competitions</h3>
            <p className="text-[9.5px] text-slate-400 font-semibold mt-1">Show Your Talent</p>
          </div>

        </div>

      </section>

      {/* ── Right Side Decorative Leaf SVG ── */}
      <div className="absolute bottom-[-10px] right-[-15px] w-[260px] h-[280px] opacity-[0.07] hidden xl:block pointer-events-none select-none">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" className="text-blue-900 w-full h-full">
          <path d="M50,90 C45,70 25,60 15,50 C5,40 10,25 20,25 C35,25 45,45 50,90 Z" strokeWidth="1" />
          <path d="M50,90 C55,70 75,60 85,50 C95,40 90,25 80,25 C65,25 55,45 50,90 Z" strokeWidth="1" />
          <path d="M50,90 C50,55 50,25 50,10" strokeWidth="1" />
          {/* Veins */}
          <path d="M50,75 C43,70 33,65 25,62" strokeWidth="1" />
          <path d="M50,60 C40,55 30,50 20,45" strokeWidth="1" />
          <path d="M50,45 C42,40 32,35 25,32" strokeWidth="1" />
          
          <path d="M50,75 C57,70 67,65 75,62" strokeWidth="1" />
          <path d="M50,60 C60,55 70,50 80,45" strokeWidth="1" />
          <path d="M50,45 C58,40 68,35 75,32" strokeWidth="1" />
        </svg>
      </div>

    </main>
  );
}
