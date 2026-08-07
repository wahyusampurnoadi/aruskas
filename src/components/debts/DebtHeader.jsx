"use client";

import { HandCoins, Plus, ArrowUpRight, ArrowDownLeft, Scale } from "lucide-react";

export default function DebtHeader({
  totalPiutang,
  totalHutang,
  onOpenAddModal,
}) {
  const formatRupiah = (val) =>
    `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

  const netBalance = totalPiutang - totalHutang;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl p-6 lg:p-8 shadow-2xl">
      {/* Background Accent Gradients */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-3">
            <HandCoins className="w-3.5 h-3.5" />
            <span>Debt & Receivable Tracker</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Catatan Hutang & Piutang
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-lg">
            Pantau uang yang dipinjam orang lain (Piutang) dan tagihan yang harus kamu lunasi (Hutang) secara terstruktur.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="self-start md:self-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(6,182,212,0.3)] transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Catatan</span>
        </button>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
        {/* Total Piutang (Saya Pinjamkan ke Orang) */}
        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Total Piutang Saya
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{formatRupiah(totalPiutang)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Uang kamu di orang lain</p>
        </div>

        {/* Total Hutang (Saya Utang ke Orang) */}
        <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Total Hutang Saya
            </span>
            <div className="w-7 h-7 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{formatRupiah(totalHutang)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Tagihan harus dilunasi</p>
        </div>

        {/* Saldo Net (Selisih) */}
        <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Posisi Bersih (Net)
            </span>
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-xl font-bold ${netBalance >= 0 ? "text-cyan-400" : "text-amber-400"}`}>
            {formatRupiah(netBalance)}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {netBalance >= 0 ? "Surplus Piutang" : "Defisit Hutang"}
          </p>
        </div>
      </div>
    </div>
  );
}
