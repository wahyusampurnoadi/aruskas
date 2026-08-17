"use client";

import { Sparkles, RefreshCw, TrendingUp, Target, Wallet, Calendar } from "lucide-react";

export default function Form({
  mode,
  targetAmount,
  setTargetAmount,
  currentSavings,
  setCurrentSavings,
  monthlyContribution,
  setMonthlyContribution,
  targetMonths,
  setTargetMonths,
  annualReturn,
  setAnnualReturn,
  onReset,
}) {
  const formatInputDisplay = (val) => {
    if (val === "" || val === null || val === undefined) return "";
    return new Intl.NumberFormat("id-ID").format(val);
  };

  const handleInputChange = (e, setter) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setter(rawValue === "" ? "" : parseInt(rawValue, 10));
  };

  const handlePercentChange = (e, setter) => {
    let val = e.target.value.replace(/[^0-9.]/g, "");
    if ((val.match(/\./g) || []).length > 1) return;
    setter(val);
  };

  const inputContainerStyle =
    "relative flex items-center rounded-2xl bg-slate-950/80 border border-white/10 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/20 transition-all duration-200 overflow-hidden";
  const inputStyle =
    "w-full py-3.5 pl-12 pr-4 bg-transparent text-white placeholder:text-slate-600 outline-none text-sm font-semibold tracking-wide";

  return (
    <div className="lg:col-span-7 space-y-6 p-6 sm:p-8 rounded-3xl bg-slate-900/50 border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
      {/* Header Form */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-[0_0_12px_rgba(6,182,212,0.15)]">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-base font-bold text-white tracking-wide">Parameter Simulasi</h2>
            <p className="text-[11px] text-slate-400">Masukkan estimasi angka keuangan Anda</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold text-slate-400 hover:text-cyan-400 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/5 transition cursor-pointer active:scale-95"
        >
          <RefreshCw size={12} />
          Reset
        </button>
      </div>

      <div className="space-y-5">
        {/* Input Target Dana */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Target size={14} className="text-cyan-400" />
              Target Dana Impian
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Wajib diisi</span>
          </label>
          <div className={inputContainerStyle}>
            <span className="absolute left-4 text-xs font-bold text-slate-400">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="1.000.000.000"
              value={formatInputDisplay(targetAmount)}
              onChange={(e) => handleInputChange(e, setTargetAmount)}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Input Tabungan Awal */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Wallet size={14} className="text-blue-400" />
            Tabungan Awal / Modal Saat Ini
          </label>
          <div className={inputContainerStyle}>
            <span className="absolute left-4 text-xs font-bold text-slate-400">Rp</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="500.000"
              value={formatInputDisplay(currentSavings)}
              onChange={(e) => handleInputChange(e, setCurrentSavings)}
              className={inputStyle}
            />
          </div>
        </div>

        {/* Input Dinamis berdasarkan Mode */}
        {mode === "target" ? (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Wallet size={14} className="text-indigo-400" />
              Kemampuan Tabungan Rutin / Bulan
            </label>
            <div className={inputContainerStyle}>
              <span className="absolute left-4 text-xs font-bold text-slate-400">Rp</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="1.000.000"
                value={formatInputDisplay(monthlyContribution)}
                onChange={(e) => handleInputChange(e, setMonthlyContribution)}
                className={inputStyle}
              />
            </div>
          </div>
        ) : (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar size={14} className="text-indigo-400" />
              Target Waktu Selesai
            </label>
            <div className={inputContainerStyle}>
              <span className="absolute left-4 text-xs font-bold text-slate-400">Bln</span>
              <input
                type="text"
                inputMode="numeric"
                placeholder="12"
                value={formatInputDisplay(targetMonths)}
                onChange={(e) => handleInputChange(e, setTargetMonths)}
                className={inputStyle}
              />
            </div>
          </div>
        )}

        {/* Input Return Investasi */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-emerald-400" />
              Estimasi Return Investasi / Tahun
            </span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Opsional</span>
          </label>
          <div className={inputContainerStyle}>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Contoh: 6"
              value={annualReturn}
              onChange={(e) => handlePercentChange(e, setAnnualReturn)}
              className="w-full py-3.5 pl-4 pr-12 bg-transparent text-white placeholder:text-slate-600 outline-none text-sm font-semibold tracking-wide"
            />
            <span className="absolute right-4 text-xs font-bold text-slate-400">
              %
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}