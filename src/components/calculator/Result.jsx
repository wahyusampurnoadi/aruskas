"use client";

import { Target, TrendingUp, BarChart3 } from "lucide-react";

export default function Result({
  mode,
  targetAmount,
  currentSavings,
  remainingTarget,
  estimatedMonthsNeeded,
  requiredMonthlySavings,
  formatRp,
}) {
  // Helper untuk mengecilkan font secara otomatis jika angka sangat panjang
  const getFontSizeClass = (text) => {
    const length = text ? text.length : 0;
    if (length > 18) return "text-lg sm:text-xl";
    if (length > 14) return "text-xl sm:text-2xl";
    if (length > 10) return "text-2xl sm:text-3xl";
    return "text-3xl sm:text-4xl";
  };

  const formattedRequiredMonthly = formatRp(requiredMonthlySavings);

  return (
    <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900/90 via-[#0a1224]/90 to-[#070d19]/90 border border-cyan-500/30 backdrop-blur-2xl relative overflow-hidden shadow-[0_0_40px_rgba(6,182,212,0.12)] space-y-6">
      {/* Background Glow Accent */}
      <div className="absolute top-0 right-0 w-56 h-56 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-6 relative z-10">
        {/* Header Result */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
              <Target size={18} />
            </div>
            <h2 className="text-base font-bold text-white tracking-wide">Hasil Estimasi</h2>
          </div>
          <BarChart3 size={18} className="text-slate-500" />
        </div>

        {/* Hero Card Result */}
        <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-cyan-500/15 via-blue-600/10 to-transparent border border-cyan-500/30 text-center relative overflow-hidden shadow-inner">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
            {mode === "target" ? "Estimasi Waktu Tercapai" : "Tabungan Rutin / Bulan"}
          </p>

          {mode === "target" ? (
            <div className="my-2">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 tracking-tight">
                  {estimatedMonthsNeeded}
                </span>
                <span className="text-lg font-bold text-cyan-300">Bulan</span>
              </div>
              <span className="inline-block mt-2 text-xs font-semibold text-slate-400 bg-slate-950/60 px-3 py-1 rounded-full border border-white/10">
                ≈ {(estimatedMonthsNeeded / 12).toFixed(1)} Tahun
              </span>
            </div>
          ) : (
            <div className="my-2 w-full flex flex-col items-center justify-center">
              {/* Font Otomatis Menyesuaikan Panjang Karakter tanpa Truncate */}
              <div
                className={`font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 tracking-tight whitespace-nowrap transition-all duration-200 ${getFontSizeClass(
                  formattedRequiredMonthly
                )}`}
              >
                {formattedRequiredMonthly}
              </div>
              <span className="text-xs font-semibold text-slate-400 block mt-1">/ bulan</span>
            </div>
          )}
        </div>

        {/* Ringkasan Rincian Angka */}
        <div className="space-y-3 text-xs">
          <div className="flex justify-between items-center py-2 border-b border-white/5 gap-2">
            <span className="text-slate-400 font-medium shrink-0">Total Target Dana</span>
            <span className="font-bold text-white tracking-wide text-right whitespace-nowrap">{formatRp(targetAmount)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 gap-2">
            <span className="text-slate-400 font-medium shrink-0">Terkumpul Sekarang</span>
            <span className="font-bold text-emerald-400 tracking-wide text-right whitespace-nowrap">{formatRp(currentSavings)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-white/5 gap-2">
            <span className="text-slate-400 font-medium shrink-0">Sisa Kekurangan</span>
            <span className="font-bold text-rose-400 tracking-wide text-right whitespace-nowrap">{formatRp(remainingTarget)}</span>
          </div>
        </div>
      </div>

      {/* Insight Box */}
      <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-start gap-3 relative z-10 shadow-lg">
        <TrendingUp size={18} className="shrink-0 text-cyan-400 mt-0.5" />
        <span className="leading-relaxed">
          {mode === "target"
            ? "Menambah alokasi bulanan sebesar 10% dapat mempercepat target hingga beberapa bulan lebih awal."
            : "Konsistensi menabung di awal bulan membantu memastikan target Anda tercapai tepat waktu."}
        </span>
      </div>
    </div>
  );
}