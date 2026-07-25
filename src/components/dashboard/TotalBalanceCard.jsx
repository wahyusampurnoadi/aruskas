"use client";

import {
  Eye,
  EyeOff,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function TotalBalanceCard({
  totalBalance = 0,
  totalIncome = 0,
  totalExpense = 0,
  showBalance = true,
  toggleBalance,
}) {
  // Helper untuk merender mata uang dengan ukuran Rp dan Angka yang SAMA BESAR
  const renderFormattedCurrency = (value, sizeClass = "text-2xl sm:text-4xl") => {
    if (!showBalance) {
      return (
        <span className={`inline-flex items-baseline gap-2 font-bold ${sizeClass}`}>
          <span>Rp</span>
          <span>••••••••</span>
        </span>
      );
    }

    const number = Number(value || 0);
    const formatted = Math.abs(number).toLocaleString("id-ID");
    const sign = number < 0 ? "-" : "";

    return (
      <span className={`inline-flex items-baseline gap-2 font-bold tracking-tight ${sizeClass}`}>
        <span>Rp</span>
        <span>
          {sign}
          {formatted}
        </span>
      </span>
    );
  };

  const balanceStatus =
    totalBalance > 0 ? "Surplus" : totalBalance < 0 ? "Defisit" : "Stabil";

  const balanceStatusClass =
    totalBalance > 0
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/20"
      : totalBalance < 0
        ? "bg-rose-500/15 text-rose-300 border-rose-400/20"
        : "bg-slate-500/15 text-slate-300 border-slate-400/20";

  return (
    <section className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-3xl shadow-2xl transition-all duration-500 hover:border-white/20">
      {/* Visual Ambient Glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[100px]" />
        <div className="absolute top-0 right-0 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 h-60 w-60 rounded-full bg-blue-500/10 blur-[90px]" />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-fuchsia-500/5" />
      </div>

      <div className="relative z-10 p-5 sm:p-7 lg:p-8">
        {/* TOP HEADER */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/15 text-blue-300 backdrop-blur-md shadow-lg">
              <Wallet className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-bold tracking-[0.2em] text-blue-200/90 uppercase">
                Total Saldo Keseluruhan
              </p>
              <p className="text-xs text-slate-400">
                Ringkasan keuangan utama kamu
              </p>
            </div>
          </div>

          <button
            onClick={toggleBalance}
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 p-2.5 text-slate-300 backdrop-blur-md transition hover:bg-white/10 hover:text-white active:scale-95"
            aria-label="Toggle balance"
          >
            {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {/* MAIN BALANCE SECTION */}
        <div className="mt-6 sm:mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-cyan-300/80">
            Total Semua Transaksi
          </p>

          <div className="mt-2 leading-none">
            {renderFormattedCurrency(
              totalBalance,
              "text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-white via-slate-100 to-cyan-200 bg-clip-text text-transparent"
            )}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium backdrop-blur-md ${balanceStatusClass}`}>
              <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-80" />
              {balanceStatus}
            </span>
          </div>
        </div>

        {/* DIVIDER */}
        <div className="my-6 sm:my-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* INCOME & EXPENSE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Income Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-4 backdrop-blur-md transition-all hover:border-emerald-500/20">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <ArrowUpRight className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-400">Pemasukan</p>
              <div className="mt-1 text-emerald-400">
                {renderFormattedCurrency(
                  totalIncome,
                  "text-xl sm:text-2xl font-bold"
                )}
              </div>
            </div>
          </div>

          {/* Expense Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-rose-500/10 bg-rose-500/[0.03] p-4 backdrop-blur-md transition-all hover:border-rose-500/20">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-rose-400/20 bg-rose-500/10 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)]">
              <ArrowDownRight className="h-6 w-6" />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-slate-400">Pengeluaran</p>
              <div className="mt-1 text-rose-300">
                {renderFormattedCurrency(
                  totalExpense,
                  "text-xl sm:text-2xl font-bold"
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Shine Effect Hover */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
        <div className="absolute -left-1/2 top-0 h-full w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 transition-all duration-1000 group-hover:left-[140%] group-hover:opacity-100" />
      </div>
    </section>
  );
}