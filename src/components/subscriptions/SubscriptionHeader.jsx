"use client";

import { Repeat, Plus, CalendarCheck, AlertCircle } from "lucide-react";

export default function SubscriptionHeader({
  monthlyTotal,
  activeCount,
  dueSoonCount,
  onOpenAddModal,
}) {
  const formatRupiah = (val) =>
    `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-slate-900/60 border border-white/10 backdrop-blur-2xl p-6 lg:p-8 shadow-2xl">
      {/* Background Accent Gradients */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-400 text-xs font-semibold mb-3">
            <Repeat className="w-3.5 h-3.5" />
            <span>Recurring & Subscriptions Manager</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Langganan & Transaksi Berulang
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-lg">
            Kelola tagihan bulanan rutin, langganan aplikasi (Netflix, Wifi), dan pemasukan tetap agar dicatat otomatis secara disiplin.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="self-start md:self-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-sm shadow-[0_0_25px_rgba(139,92,246,0.3)] transition-all duration-200 cursor-pointer active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Langganan</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
        <div className="p-4 rounded-2xl bg-violet-500/5 border border-violet-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">
              Biaya Tetap Bulanan
            </span>
            <div className="w-7 h-7 rounded-xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Repeat className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{formatRupiah(monthlyTotal)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Estimasi komitmen rutin/bulan</p>
        </div>

        <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
              Langganan Aktif
            </span>
            <div className="w-7 h-7 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{activeCount} Layanan</p>
          <p className="text-[11px] text-slate-400 mt-1">Terjadwal rutin</p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 backdrop-blur-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Mendekati Jatuh Tempo
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-xl font-bold text-white">{dueSoonCount} Tagihan</p>
          <p className="text-[11px] text-slate-400 mt-1">Jatuh tempo 7 hari ke depan</p>
        </div>
      </div>
    </div>
  );
}
