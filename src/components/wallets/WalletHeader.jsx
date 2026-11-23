"use client";

import { Sparkles, Plus, TrendingUp, Wallet } from "lucide-react";

export default function WalletHeader({ wallets = [], totalBalance = 0, totalWallets = 0, onOpenAddModal, getThemeProps }) {
  const segments = wallets.map((w) => ({
    id: w.id,
    name: w.name,
    balance: w.balance,
    bar: getThemeProps(w.type).bar,
    share: totalBalance > 0 ? (w.balance / totalBalance) * 100 : 0,
  }));

  return (
    <section className="glass-strong relative overflow-hidden rounded-[28px] p-6 sm:p-10">
      <div
        aria-hidden
        className="animate-float-a pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-b pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <span className="chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-accent">
            <Sparkles className="h-3.5 w-3.5" />
            Multi-wallet management
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-main sm:text-4xl">
            Dompet & aset
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
            Pantau bank, e-wallet, hingga investasi seperti saham, crypto, dan properti dalam satu tampilan.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 rounded-2xl px-6 py-3.5 text-sm font-semibold"
        >
          <Plus className="h-4 w-4" />
          Tambah dompet
        </button>
      </div>

      {/* Total & status */}
      <div className="relative mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
        <div className="tile rounded-2xl p-5 md:col-span-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-subtle">Total saldo & aset</p>
            <span className="chip flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              Aktif
            </span>
          </div>
          <p className="mt-3 break-words text-3xl font-black tracking-tight text-main sm:text-4xl">
            Rp {totalBalance.toLocaleString("id-ID")}
          </p>

          {/* Bilah alokasi bertumpuk */}
          <div className="mt-5">
            <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-[var(--track)]">
              {segments.map((s) => (
                <div
                  key={s.id}
                  title={`${s.name}: ${s.share.toFixed(1)}%`}
                  className={`h-full transition-all duration-700 ${s.bar}`}
                  style={{ width: `${s.share}%` }}
                />
              ))}
            </div>
            {segments.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
                {segments.map((s) => (
                  <span key={s.id} className="flex items-center gap-1.5 text-[11px] text-subtle">
                    <span className={`h-2 w-2 rounded-full ${s.bar}`} />
                    {s.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="tile flex items-center justify-between gap-4 rounded-2xl p-5 md:col-span-2">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-subtle">Akun / aset aktif</p>
            <p className="mt-2 text-3xl font-black tracking-tight text-accent">{totalWallets}</p>
            <p className="mt-1 text-[11px] text-subtle">Siap untuk transaksi dan portofolio.</p>
          </div>
          <span className="chip flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-accent">
            <Wallet className="h-6 w-6" />
          </span>
        </div>
      </div>
    </section>
  );
}