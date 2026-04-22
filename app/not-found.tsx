"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06142E] flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Grid overlay */}
      <div className="absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Glows */}
      <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.12) 0%, transparent 70%)" }}
      />
      <div className="absolute bottom-[-60px] right-[-60px] w-72 h-72 rounded-full"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.10) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 text-cyan-400 text-xs tracking-widest uppercase"
          style={{ background: "rgba(34,211,238,0.08)", border: "0.5px solid rgba(34,211,238,0.25)" }}>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
          Page not found
        </div>

        {/* Icon */}
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "rgba(34,211,238,0.08)", border: "0.5px solid rgba(34,211,238,0.2)" }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
            <path d="M11 8v3M11 14h.01" />
          </svg>
        </div>

        {/* 404 */}
        <div className="text-[120px] font-extrabold leading-none tracking-tighter mb-2 select-none"
          style={{ color: "transparent", WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}>
          4<span style={{ color: "#22d3ee", WebkitTextStroke: "0" }}>0</span>4
        </div>

        <h1 className="text-3xl font-semibold text-white mb-3">This page doesn't exist</h1>
        <p className="text-white/45 text-[15px] leading-relaxed max-w-sm mb-10">
          The content you're looking for may have been moved, deleted, or never existed. Let's get you back on track.
        </p>

        {/* Buttons */}
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/">
            <button className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-cyan-400 text-[#06142E] hover:opacity-85 transition-opacity">
              Back to home
            </button>
          </Link>
          <Link href="/courses">
            <button className="px-6 py-2.5 rounded-xl text-sm font-medium text-white/70 transition-colors hover:bg-white/10"
              style={{ background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.15)" }}>
              Browse courses
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}