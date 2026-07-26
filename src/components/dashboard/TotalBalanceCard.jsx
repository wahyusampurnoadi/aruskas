"use client";

import { Eye, EyeOff, Plus, ArrowUpRight, ArrowDownLeft, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function TotalBalanceCard({
  totalBalance = 0,
  totalIncome = 0,
  totalExpense = 0,
  showBalance = true,
  toggleBalance,
  onOpenModal,
  currency = "IDR",
}) {
  const isPositive = totalBalance >= 0;

  return (
    <section className="group relative overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl transition-all duration-300">
      {/* Visual Accent Light Glows */}
      <div className="pointer-events-none absolute -top-20 -right-20 h-72 w-72 rounded-full bg-blue-500/15 blur-[100px] transition-all duration-500 group-hover:bg-blue-500/25" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-500/15 blur-[100px] transition-all duration-500 group-hover:bg-indigo-500/25" />

      {/* Grid Pattern Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:24px_24px]" />

      <div className="relative z-10 space-y-6">
        {/* HEADER: JUDUL + TOGGLE EYE + TOMBOL TAMBAH TRANSAKSI */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 shadow-inner backdrop-blur-md">
              <Wallet className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                  Total Saldo Keseluruhan
                </span>
                <button
                  onClick={toggleBalance}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white active:scale-95 cursor-pointer"
                  title={showBalance ? "Sembunyikan Saldo" : "Tampilkan Saldo"}
                >
                  {showBalance ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-400/80">Ringkasan akumulasi seluruh transaksi</p>
            </div>
          </div>

          {/* Tombol Tambah Transaksi */}
          {onOpenModal && (
            <button
              onClick={onOpenModal}
              className="group/btn relative inline-flex items-center gap-2.5 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 px-5 py-2.5 text-xs font-extrabold text-white shadow-[0_0_20px_rgba(79,70,229,0.3)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] active:scale-95 cursor-pointer border border-white/20"
            >
              <Plus className="h-4 w-4 stroke-[3] transition-transform duration-300 group-hover/btn:rotate-90" />
              <span>Tambah Transaksi</span>
            </button>
          )}
        </div>

        {/* DISPLAY SALDO UTAMA */}
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total Semua Transaksi
          </p>
          <div className="flex flex-wrap items-baseline gap-3">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
              {showBalance ? (
                formatCurrency(totalBalance, currency)
              ) : (
                "••••••••"
              )}
            </h2>

            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur-md ${
                isPositive
                  ? "border-emerald-500/30 bg-emerald-500/15 text-emerald-300"
                  : "border-rose-500/30 bg-rose-500/15 text-rose-300"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isPositive ? "bg-emerald-400 animate-pulse" : "bg-rose-400 animate-pulse"}`} />
              {isPositive ? "Surplus" : "Defisit"}
            </span>
          </div>
        </div>

        {/* AKUMULASI PEMASUKAN & PENGELUARAN (KARTU KECIL INSIDE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Box Pemasukan */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md transition duration-300 hover:border-emerald-500/30 hover:bg-emerald-500/5">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pemasukan</p>
              <p className="text-base font-black text-emerald-400">
                {showBalance ? formatCurrency(totalIncome, currency) : "••••••••"}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <ArrowDownLeft className="h-5 w-5" />
            </div>
          </div>

          {/* Box Pengeluaran */}
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/40 p-4 backdrop-blur-md transition duration-300 hover:border-rose-500/30 hover:bg-rose-500/5">
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Pengeluaran</p>
              <p className="text-base font-black text-rose-400">
                {showBalance ? formatCurrency(totalExpense, currency) : "••••••••"}
              </p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-400">
              <ArrowUpRight className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}