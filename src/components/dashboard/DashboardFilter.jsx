"use client";

import { Calendar, CalendarDays, Filter, RefreshCw } from "lucide-react";

export default function DashboardFilter({
  month,
  setMonth,
  year,
  setYear,
  monthNames,
  filterMode,
  setFilterMode,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  activePeriodLabel,
  resetToMonthly,
  handleApplyCustomFilter,
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 backdrop-blur-3xl shadow-xl transition-all">
      {/* Background Accent */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-cyan-500/10 blur-[60px]" />
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-purple-500/10 blur-[60px]" />
      </div>

      <div className="relative z-10 space-y-5">
        {/* HEADER: Judul & Indicator Filter Aktif */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-cyan-400" />
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Filter Transaksi
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Pilih mode filter untuk menyesuaikan laporan data
            </p>
          </div>

          {/* BADGE FILTER AKTIF */}
          <div className="flex items-center gap-2 self-start sm:self-auto rounded-2xl border border-cyan-400/20 bg-cyan-500/10 px-3.5 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-xs font-semibold text-cyan-200">
              Aktif: <span className="text-white font-bold">{activePeriodLabel}</span>
            </span>
          </div>
        </div>

        {/* TAB TOGGLE MODE FILTER */}
        <div className="inline-flex w-full sm:w-auto rounded-2xl bg-slate-900/60 p-1 border border-white/10">
          <button
            onClick={() => setFilterMode("monthly")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              filterMode === "monthly"
                ? "bg-purple-500/20 text-purple-300 border border-purple-400/30 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>Filter Bulanan</span>
          </button>

          <button
            onClick={() => setFilterMode("custom")}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
              filterMode === "custom"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-lg"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <CalendarDays className="h-3.5 w-3.5" />
            <span>Rentang Tanggal</span>
          </button>
        </div>

        {/* KONTEN FILTER BERDASARKAN MODE */}
        {filterMode === "monthly" ? (
          /* FORM BULANAN */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">
                Pilih Bulan
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm font-medium text-white outline-none focus:border-purple-400/50"
              >
                {monthNames.map((m, i) => (
                  <option key={i} value={i} className="bg-slate-900 text-white">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">
                Pilih Tahun
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2.5 text-sm font-medium text-white outline-none focus:border-purple-400/50"
              >
                {/* Dinamis dari +3 Tahun ke Depan, Turun dan Mentok di 2016 */}
                {Array.from(
                  { length: new Date().getFullYear() + 3 - 2016 + 1 },
                  (_, i) => {
                    const y = new Date().getFullYear() + 3 - i;
                    return (
                      <option key={y} value={y} className="bg-slate-900 text-white">
                        {y}
                      </option>
                    );
                  }
                )}
              </select>
            </div>

            <button
              onClick={resetToMonthly}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/15 py-2.5 px-4 text-xs font-bold text-purple-300 hover:bg-purple-500/25 active:scale-95 transition"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Terapkan Bulanan
            </button>
          </div>
        ) : (
          /* FORM CUSTOM RANGE */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end pt-1">
            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">
                Tanggal Awal
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2 text-sm font-medium text-white outline-none focus:border-cyan-400/50 [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 block mb-1.5">
                Tanggal Akhir
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-3.5 py-2 text-sm font-medium text-white outline-none focus:border-cyan-400/50 [color-scheme:dark]"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleApplyCustomFilter}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-cyan-500/30 bg-cyan-500/15 py-2.5 px-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/25 active:scale-95 transition"
              >
                Terapkan Filter
              </button>
              <button
                onClick={resetToMonthly}
                title="Reset ke Bulanan"
                className="rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}