"use client";

import { useMemo } from "react";
import { 
  Activity, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle,
  FileQuestion
} from "lucide-react";
import { usePro } from "@/app/hooks/usePro";

export default function FinancialHealthCard({ 
  income = 0, 
  expense = 0, 
  totalSavings = 0, 
  monthlyDebt = 0,
  onUpgrade 
}) {
  const { isPro } = usePro();

  const metrics = useMemo(() => {
    const hasData = income > 0 || expense > 0;

    if (!hasData) {
      return {
        hasData: false,
        savingsRatio: "-",
        debtRatio: "-",
        emergencyMonths: "-",
        score: "-",
        status: { 
          label: "Belum Ada Transaksi", 
          color: "text-slate-400", 
          bg: "bg-slate-800/50", 
          border: "border-slate-700" 
        }
      };
    }

    const rawSavingsRatio = ((income - expense) / income) * 100;
    const rawDebtRatio = (monthlyDebt / income) * 100;
    const rawEmergencyMonths = expense > 0 ? totalSavings / expense : totalSavings > 0 ? 6 : 0;

    let score = 0;
    if (rawSavingsRatio >= 20) score += 40;
    else if (rawSavingsRatio > 0) score += (rawSavingsRatio / 20) * 40;

    if (rawDebtRatio <= 30) score += 35;
    else if (rawDebtRatio < 50) score += ((50 - rawDebtRatio) / 20) * 35;

    if (rawEmergencyMonths >= 6) score += 25;
    else if (rawEmergencyMonths > 0) score += (rawEmergencyMonths / 6) * 25;

    const finalScore = Math.min(100, Math.max(0, Math.round(score)));

    let status = { label: "Kritis", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" };
    if (finalScore >= 80) {
      status = { label: "Sangat Sehat", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" };
    } else if (finalScore >= 60) {
      status = { label: "Cukup Sehat", color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/30" };
    } else if (finalScore >= 40) {
      status = { label: "Perlu Perhatian", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" };
    }

    const getBipolarBarProps = (value, maxScale = 50) => {
      if (value === 0) return { left: "50%", width: "0%" };
      const percentage = Math.min(50, (Math.abs(value) / maxScale) * 50);
      return value > 0 
        ? { left: "50%", width: `${percentage}%` } 
        : { left: `${50 - percentage}%`, width: `${percentage}%` };
    };

    return {
      hasData: true,
      savingsRatio: `${rawSavingsRatio.toFixed(1)}%`,
      debtRatio: `${rawDebtRatio.toFixed(1)}%`,
      emergencyMonths: `${rawEmergencyMonths.toFixed(1)} Bulan`,
      rawSavingsRatio,
      rawDebtRatio,
      rawEmergencyMonths,
      savingsStyle: getBipolarBarProps(rawSavingsRatio, 50),
      debtStyle: { left: "0%", width: `${Math.min(100, rawDebtRatio)}%` },
      emergencyStyle: getBipolarBarProps(rawEmergencyMonths, 6),
      score: finalScore,
      status
    };
  }, [income, expense, totalSavings, monthlyDebt]);

  return (
    <div className="relative rounded-3xl bg-slate-900/60 border border-white/10 p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between pb-6 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <Activity size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-wide">Smart Financial Health Score</h2>
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                PRO
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Analisis otomatis indikator dan rasio kesehatan keuangan Anda</p>
          </div>
        </div>
      </div>

      <div className="relative mt-6">
        {!isPro && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-center">
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-400/20 to-orange-500/20 text-amber-400 border border-amber-500/30 mb-3 shadow-[0_0_20px_rgba(245,158,11,0.2)]">
              <Lock size={24} />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Fitur Ini Khusus Akun Pro</h3>
            <p className="text-xs text-slate-400 max-w-sm mb-5 leading-relaxed">
              Buka analisis rasio tabungan, tingkat beban utang, dan rekomendasi otomatis untuk menjaga stabilitas keuangan Anda.
            </p>
            <button
              onClick={onUpgrade}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 hover:from-amber-300 hover:to-orange-400 text-slate-950 text-xs font-black tracking-wide shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <Sparkles size={14} />
              <span>Upgrade ke Pro Sekarang</span>
            </button>
          </div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${!isPro ? "filter blur-sm select-none pointer-events-none" : ""}`}>
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/60 border border-white/5 text-center relative overflow-hidden">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Skor Kesehatan</span>
            
            <div className="relative flex items-center justify-center my-2">
              <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400 tracking-tight">
                {metrics.score}
              </div>
              {metrics.hasData && <span className="text-sm font-bold text-slate-500 ml-1">/100</span>}
            </div>

            <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${metrics.status.bg} ${metrics.status.color} ${metrics.status.border}`}>
              {metrics.hasData ? <ShieldCheck size={14} /> : <FileQuestion size={14} />}
              <span>{metrics.status.label}</span>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4 flex flex-col justify-between">
            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  Rasio Tabungan
                  <HelpCircle size={12} className="text-slate-500" />
                </span>
                <span className={`font-bold ${!metrics.hasData ? "text-slate-400" : metrics.rawSavingsRatio < 0 ? "text-rose-400" : metrics.rawSavingsRatio >= 20 ? "text-emerald-400" : "text-amber-400"}`}>
                  {metrics.savingsRatio} <span className="text-slate-500 font-normal">(Ideal ≥ 20%)</span>
                </span>
              </div>
              <div className="relative w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-600/60 z-10" />
                {metrics.hasData && (
                  <div 
                    className={`absolute h-full transition-all duration-500 rounded-full ${
                      metrics.rawSavingsRatio < 0 
                        ? "bg-gradient-to-l from-rose-500 to-rose-600" 
                        : "bg-gradient-to-r from-cyan-400 to-emerald-400"
                    }`} 
                    style={metrics.savingsStyle}
                  />
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  Rasio Beban Utang (DTI)
                  <HelpCircle size={12} className="text-slate-500" />
                </span>
                <span className={`font-bold ${!metrics.hasData ? "text-slate-400" : metrics.rawDebtRatio <= 30 ? "text-emerald-400" : "text-rose-400"}`}>
                  {metrics.debtRatio} <span className="text-slate-500 font-normal">(Ideal ≤ 30%)</span>
                </span>
              </div>
              <div className="relative w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                {metrics.hasData && (
                  <div 
                    className={`absolute h-full transition-all duration-500 rounded-full ${metrics.rawDebtRatio <= 30 ? "bg-emerald-400" : "bg-rose-500"}`} 
                    style={metrics.debtStyle}
                  />
                )}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950/40 border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                  Ketahanan Dana Darurat
                  <HelpCircle size={12} className="text-slate-500" />
                </span>
                <span className={`font-bold ${!metrics.hasData ? "text-slate-400" : metrics.rawEmergencyMonths < 0 ? "text-rose-400" : metrics.rawEmergencyMonths >= 3 ? "text-emerald-400" : "text-amber-400"}`}>
                  {metrics.emergencyMonths} <span className="text-slate-500 font-normal">(Ideal ≥ 3 - 6 Bln)</span>
                </span>
              </div>
              <div className="relative w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
                <div className="absolute left-1/2 top-0 bottom-0 w-[2px] bg-slate-600/60 z-10" />
                {metrics.hasData && (
                  <div 
                    className={`absolute h-full transition-all duration-500 rounded-full ${
                      metrics.rawEmergencyMonths < 0 
                        ? "bg-gradient-to-l from-rose-500 to-rose-600" 
                        : "bg-gradient-to-r from-indigo-400 to-purple-500"
                    }`} 
                    style={metrics.emergencyStyle}
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {isPro && (
          <div className="mt-5 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs flex items-start gap-3">
            {!metrics.hasData ? (
              <>
                <FileQuestion size={18} className="shrink-0 text-slate-400 mt-0.5" />
                <span className="leading-relaxed text-slate-400">
                  Belum ada transaksi yang dicatat pada bulan ini. Silakan catat pemasukan dan pengeluaran Anda untuk melihat analisis skor kesehatan keuangan.
                </span>
              </>
            ) : metrics.score >= 70 ? (
              <>
                <CheckCircle2 size={18} className="shrink-0 text-cyan-400 mt-0.5" />
                <span className="leading-relaxed">
                  {metrics.score >= 80
                    ? "Keuangan Anda dalam kondisi sangat sehat! Alokasikan surplus tabungan Anda ke dalam portofolio investasi jangka panjang."
                    : "Kondisi stabil. Pertimbangkan untuk mengurangi pengeluaran sekunder agar rasio tabungan bulanan dapat ditingkatkan mendekati 20%."}
                </span>
              </>
            ) : (
              <>
                <AlertTriangle size={18} className="shrink-0 text-amber-400 mt-0.5" />
                <span className="leading-relaxed">
                  Peringatan: Beban utang atau alokasi tabungan Anda berada di luar batas aman. Prioritaskan pelunasan utang berbunga tinggi.
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}