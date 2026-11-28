"use client";

import { Repeat, Plus, CalendarCheck, AlertCircle } from "lucide-react";

export default function SubscriptionHeader({
  monthlyTotal,
  activeCount,
  dueSoonCount,
  onOpenAddModal,
}) {
  const formatRupiah = (val) => `Rp ${Number(val || 0).toLocaleString("id-ID")}`;

  const stats = [
    {
      label: "Biaya tetap bulanan",
      value: formatRupiah(monthlyTotal),
      hint: "Estimasi komitmen rutin per bulan",
      Icon: Repeat,
      tone: "text-accent bg-accent/15",
      bar: "bg-linear-to-r from-cyan-400 to-blue-500",
    },
    {
      label: "Langganan aktif",
      value: `${activeCount} layanan`,
      hint: "Terjadwal berjalan rutin",
      Icon: CalendarCheck,
      tone: "text-emerald-500 bg-emerald-500/15",
      bar: "bg-linear-to-r from-emerald-400 to-teal-500",
    },
    {
      label: "Mendekati jatuh tempo",
      value: `${dueSoonCount} tagihan`,
      hint: "Jatuh tempo dalam 7 hari ke depan",
      Icon: AlertCircle,
      tone: "text-amber-500 bg-amber-500/15",
      bar: "bg-linear-to-r from-amber-400 to-orange-500",
    },
  ];

  return (
    <section className="glass-strong relative overflow-hidden rounded-[28px] p-6 sm:p-8">
      <div
        aria-hidden
        className="animate-float-a pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-400/20 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-b pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cyan-400/15 blur-3xl"
      />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <span className="chip inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold text-muted">
            <Repeat className="h-3 w-3 text-accent" />
            Transaksi berulang
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-main sm:text-3xl">
            Langganan & pemasukan rutin
          </h1>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
            Kelola tagihan bulanan, layanan berlangganan, dan pemasukan tetap agar tercatat otomatis dan disiplin.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenAddModal}
          className="btn-primary inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 self-start rounded-2xl px-5 py-3 text-sm font-semibold active:scale-95 md:self-auto"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah langganan</span>
        </button>
      </div>

      <div className="relative mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((s) => {
          const Icon = s.Icon;
          return (
            <div key={s.label} className="tile relative overflow-hidden rounded-2xl p-5">
              <div className={`absolute inset-x-0 top-0 h-[2px] ${s.bar}`} />
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-medium text-subtle">{s.label}</p>
                <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${s.tone}`}>
                  <Icon className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 text-xl font-bold tracking-tight text-main">{s.value}</p>
              <p className="mt-1 text-[11px] text-subtle">{s.hint}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}