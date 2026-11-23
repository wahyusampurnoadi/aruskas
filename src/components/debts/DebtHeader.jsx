"use client";

import { HandCoins, Plus, ArrowUpRight, ArrowDownLeft, Scale } from "lucide-react";

export default function DebtHeader({ totalPiutang, totalHutang, onOpenAddModal }) {
  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

  const netBalance = totalPiutang - totalHutang;

  const tiles = [
    {
      label: "Total piutang saya",
      value: formatRupiah(totalPiutang),
      hint: "Uang kamu di orang lain",
      tone: "text-emerald-500",
      bg: "bg-emerald-500/15",
      Icon: ArrowUpRight,
    },
    {
      label: "Total hutang saya",
      value: formatRupiah(totalHutang),
      hint: "Tagihan harus dilunasi",
      tone: "text-rose-500",
      bg: "bg-rose-500/15",
      Icon: ArrowDownLeft,
    },
    {
      label: "Posisi bersih (net)",
      value: formatRupiah(netBalance),
      hint: netBalance >= 0 ? "Surplus piutang" : "Defisit hutang",
      tone: netBalance >= 0 ? "text-accent" : "text-amber-500",
      bg: "bg-accent/15",
      Icon: Scale,
    },
  ];

  return (
    <section className="glass-strong relative overflow-hidden rounded-[28px] p-6 sm:p-8">
      <div
        aria-hidden
        className="animate-float-a pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-b pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <span className="chip inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold text-accent">
            <HandCoins className="h-3.5 w-3.5" />
            Debt & receivable tracker
          </span>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-main sm:text-4xl">
            Hutang & piutang
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            Pantau uang yang dipinjam orang lain dan tagihan yang harus kamu lunasi, secara terstruktur.
          </p>
        </div>

        <button
          onClick={onOpenAddModal}
          className="btn-primary inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-2xl px-5 py-3 text-sm font-semibold md:self-auto"
        >
          <Plus className="h-4 w-4" />
          Tambah catatan
        </button>
      </div>

      <div className="relative mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {tiles.map((t) => {
          const Icon = t.Icon;
          return (
            <div key={t.label} className="tile flex h-full flex-col rounded-2xl p-5">
              <div className="flex items-start justify-between gap-3">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-subtle">{t.label}</p>
                <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${t.bg} ${t.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className={`mt-3 break-words text-xl font-black tracking-tight sm:text-2xl ${t.tone}`}>
                {t.value}
              </p>
              <p className="mt-auto pt-2 text-[11px] text-subtle">{t.hint}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}