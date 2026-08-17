"use client";

import { Calculator as CalcIcon, Sparkles } from "lucide-react";

export default function Header({ mode, setMode }) {
  return (
    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/10">
      {/* Background Accent Glow */}
      <div className="absolute -top-10 -left-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-2 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-semibold shadow-[0_0_15px_rgba(6,182,212,0.15)]">
          <CalcIcon size={14} className="text-cyan-400" />
          <span>Simulasi & Perencanaan</span>
          <Sparkles size={12} className="text-cyan-400 ml-0.5" />
        </div>
        
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
          Kalkulator <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">Finansial</span>
        </h1>
        
        <p className="text-slate-400 text-xs sm:text-sm max-w-xl leading-relaxed">
          Simulasikan target tabungan dan waktu pencapaian dana impian Anda secara presisi.
        </p>
      </div>

      {/* Mode Switcher */}
      <div className="flex p-1.5 rounded-2xl bg-slate-950/80 border border-white/10 backdrop-blur-md shrink-0 relative z-10 self-start md:self-auto shadow-inner">
        <button
          onClick={() => setMode("target")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
            mode === "target"
              ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          Hitung Estimasi Waktu
        </button>
        <button
          onClick={() => setMode("monthly")}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
            mode === "monthly"
              ? "bg-gradient-to-r from-cyan-500 via-blue-600 to-blue-700 text-white shadow-[0_0_20px_rgba(6,182,212,0.35)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
          }`}
        >
          Hitung Tabungan Bulanan
        </button>
      </div>
    </div>
  );
}